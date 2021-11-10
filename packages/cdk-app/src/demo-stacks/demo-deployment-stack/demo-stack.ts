import { StageName } from 'src/common/types';
// Dummy stack

import { DEPLOYMENT_CONFIG } from 'src/config';
import * as cdk from '@aws-cdk/core';
import DeploymentStack from 'src/stacks/deployment-stack';
import { commonConfig } from '@whire-be/common';

const createDummyStack = (scope: cdk.Construct) => {
  const stageName = StageName.DEMO;

  const stageConfig = DEPLOYMENT_CONFIG[stageName];

  const stack = new DeploymentStack(scope, `${commonConfig.PROJECT_NAME}-demo-deployment`, {
    stageName,
    stageConfig,
  });
};

export default createDummyStack;
