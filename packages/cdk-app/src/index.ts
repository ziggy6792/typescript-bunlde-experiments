/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
/* eslint-disable no-new */
import * as cdk from '@aws-cdk/core';
import * as utils from 'src/utils';
import * as config from 'src/config';
import PipelineStack from 'src/stacks/pipeline-stack';
import createDummyStack from 'src/demo-stacks/demo-deployment-stack';

const app = new cdk.App();

const context = JSON.parse(process.env.CDK_CONTEXT_JSON);

enum EnvType {
  PIPELINE = 'pipeline',
  TEST = 'test',
  DEMO = 'demo',
}

context.env = context.env || EnvType.PIPELINE;

console.log('environment:', context.env);

switch (context.env) {
  case EnvType.TEST:
    const env = {
      account: process.env.CDK_DEFAULT_ACCOUNT || '000000000000',
      region: process.env.CDK_DEFAULT_REGION || 'ap-southeast-1',
    };
    // Here you can deploy something locally
    break;
  case EnvType.DEMO:
    createDummyStack(app);
    break;
  default:
    new PipelineStack(app, utils.getConstructId('pipeline'), {
      description: utils.getConstructId('pipeline'),
      env: {
        account: config.AWS_ACCOUNT_ID,
        region: config.AWS_REGION,
      },
    });
}

app.synth();
