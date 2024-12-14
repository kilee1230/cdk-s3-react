#!/opt/homebrew/opt/node/bin/node
import * as cdk from "aws-cdk-lib";
import { JotaiTodoStack } from "./appStack";

const app = new cdk.App();
new JotaiTodoStack(app, "JotaiTodoStack");
