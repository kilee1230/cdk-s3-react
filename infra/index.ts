#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { JotaiTodoStack } from "./appStack";

const app = new cdk.App();
new JotaiTodoStack(app, "JotaiTodoStack", {
  stackName: "jotai-todo-stack",
});

app.synth();
