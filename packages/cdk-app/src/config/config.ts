import path from 'path';

import { commonConfig } from '@whire-be/common';
/* eslint-disable import/prefer-default-export */
export const AWS_REGION = 'ap-southeast-1';
export const AWS_ACCOUNT_ID = '596905900055';

export const PROJECT_ROOT_DIR = path.join(process.env.PWD, '../../');

export const PROJECT_REPO = { owner: 'whirenet', repo: 'whire-be', branch: 'feature/remove-bundler' };

interface IdentityProviderConfig {
  clientId: string;
  clientSecret: string;
}

export interface IdentityProvidersConfig {
  facebook?: IdentityProviderConfig;
  google: IdentityProviderConfig;
  linkedin?: IdentityProviderConfig;
}

export interface StageConfig {
  domainPrefix: string;
  identityProviders: IdentityProvidersConfig;
}

export const DEPLOYMENT_CONFIG: { [key: string]: StageConfig } = {
  staging: {
    domainPrefix: `${commonConfig.PROJECT_NAME}-staging`,
    identityProviders: {
      google: {
        clientId: '968834559759-thvdat33l880tvfvaofp2sq9gn9a0k86.apps.googleusercontent.com',
        clientSecret: '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',
      },
      linkedin: {
        clientId: '86agoa2goa5v2b',
        clientSecret: 'CtH6d15hZu92B0LY',
      },
    },
  },
  prod: {
    domainPrefix: `${commonConfig.PROJECT_NAME}-prod`,
    identityProviders: {
      google: {
        clientId: '968834559759-thvdat33l880tvfvaofp2sq9gn9a0k86.apps.googleusercontent.com',
        clientSecret: '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',
      },
      linkedin: {
        clientId: '86agoa2goa5v2b',
        clientSecret: 'CtH6d15hZu92B0LY',
      },
    },
  },
  demo: {
    domainPrefix: `${commonConfig.PROJECT_NAME}-demo`,
    identityProviders: {
      google: {
        clientId: '968834559759-thvdat33l880tvfvaofp2sq9gn9a0k86.apps.googleusercontent.com',
        clientSecret: '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',
      },
      linkedin: {
        clientId: '86agoa2goa5v2b',
        clientSecret: 'CtH6d15hZu92B0LY',
      },
    },
  },
};
