import {
  RemovalPolicy,
  Stack,
  StackProps,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
import {
  AllowedMethods,
  CachedMethods,
  Distribution,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class JotaiTodoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the React app
    const bucket = new Bucket(this, "JotaiTodoBucket", {
      // Enables versioning for the bucket, ensuring that every update to objects
      // will be stored as a new version, while keeping older versions available.
      versioned: true,

      // Grants public read access to the contents of the bucket, making the assets
      // publicly available over the web.
      publicReadAccess: true,

      // Configures public access settings for the bucket.
      blockPublicAccess: {
        // Allows public ACLs (Access Control Lists) to be attached to bucket objects.
        blockPublicAcls: false,

        // Allows bucket policies that grant public access to remain in place.
        blockPublicPolicy: false,

        // Does not ignore any public ACLs that are attached to objects within the bucket.
        ignorePublicAcls: false,

        // Does not restrict the bucket from being publicly accessible.
        restrictPublicBuckets: false,
      },

      // Enforces SSL (Secure Socket Layer) connections when accessing the bucket,
      // ensuring secure communication over HTTPS.
      enforceSSL: true,

      // Specifies the index document for the S3-hosted website, which is typically 'index.html'.
      websiteIndexDocument: "index.html",

      // Always destroys the bucket and its contents when the stack is deleted.
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const originAccessIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    bucket.grantRead(originAccessIdentity);

    // Create a CloudFront distribution for the React app
    const distribution = new Distribution(this, "JotaiTodoDistribution", {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(bucket, {
          customHeaders: {
            "x-origin-access-identity":
              originAccessIdentity.originAccessIdentityId,
          },
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS, // needed for cors
        cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS, // needed for cors
      },
      errorResponses: [
        {
          // for single page application router support
          httpStatus: 403, //forbidden
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: Duration.minutes(10),
        },
      ],
      defaultRootObject: "index.html",
    });

    // Deploy the React app to the S3 bucket
    new BucketDeployment(this, "JotaiTodoWebApp", {
      sources: [Source.asset("./dist")],
      destinationBucket: bucket,
      distribution, // Invalidate CloudFront cache on new deploy
      distributionPaths: [
        "/",
        "/assets/*",
        "/assets/css/*",
        "/assets/js/*",
        "/assets/media/*",
      ],
    });

    // Output the CloudFront URL
    new CfnOutput(this, "CloudFrontURL", {
      value: distribution.distributionDomainName,
    });
  }
}
