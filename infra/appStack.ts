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
  OriginRequestPolicy,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import {
  BlockPublicAccess,
  Bucket,
  BucketAccessControl,
} from "aws-cdk-lib/aws-s3";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";

export class JotaiTodoStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket to host the React app
    const bucket = new Bucket(this, "JotaiTodoBucket", {
      bucketName: `${Stack.of(this).stackName.toLowerCase()}-bucket`,
      versioned: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      accessControl: BucketAccessControl.PRIVATE,
      enforceSSL: true,
      websiteIndexDocument: "index.html",
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // Create a CloudFront distribution for the React app
    const distribution = new Distribution(this, "JotaiTodoDistribution", {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(bucket),
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
