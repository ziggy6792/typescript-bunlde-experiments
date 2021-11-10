/* eslint-disable import/prefer-default-export */
import * as cdk from '@aws-cdk/core';

import { DEPLOYMENT_CONFIG } from 'src/config';
import { commonConfig } from '@whire-be/common';

import DeploymentStack from 'src/stacks/deployment-stack';
import { StageName } from 'src/common/types';

class DummyPipelineStack extends cdk.Stack {
  public readonly stagingUrlOutput: cdk.CfnOutput;

  public readonly prodUrlOutput: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stages = [StageName.STAGING, StageName.PROD];

    stages.forEach((stageName) => {
      const stageConfig = DEPLOYMENT_CONFIG[stageName];
      const stagingDeployment = new DeploymentStack(this, `${commonConfig.PROJECT_NAME}-${stageName}-deployment`, { stageName, stageConfig });
    });
  }
}

export default DummyPipelineStack;
