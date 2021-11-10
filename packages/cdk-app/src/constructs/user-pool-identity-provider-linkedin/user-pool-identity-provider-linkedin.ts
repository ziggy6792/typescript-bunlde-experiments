import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { CfnUserPoolIdentityProvider, UserPool } from '@aws-cdk/aws-cognito';
import { AssetCode, Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, Duration } from '@aws-cdk/core';
import * as defaults from '@aws-solutions-constructs/core';
import * as api from '@aws-cdk/aws-apigateway';

export interface IUserPoolIdentityProviderLinkedInProps {
  /**
   * The user pool.
   */
  userPool: UserPool;
  /**
   * The client id recognized by Github APIs.
   */
  clientId: string;
  /**
   * The client secret to be accompanied with clientId for Github APIs to authenticate the client.
   */
  clientSecret: string;
  /**
   * The Cognito hosted UI domain.
   */
  cognitoHostedUiDomain: string;
  /**
   * The URL of the Git repository for the GitHub wrapper
   */
  lambdaCode: AssetCode;

  attributeMapping: any;

  scopes: string;

  stageName: string;

  restApiName: string;
}

/**
 * GitHub OpenID Connect Wrapper for Cognito
 *
 * @example
 *
 * new UserPoolIdentityProviderGithub(this, 'UserPoolIdentityProviderGithub', {
 *   userPool: new UserPool(stack, 'UserPool'),
 *   clientId: 'myClientId',
 *   clientSeret: 'myClientSecret',
 *   cognitoHostedUiDomain: 'https://auth.domain.com',
 * });
 */
export class UserPoolIdentityProviderLinkedIn extends Construct {
  public readonly userPoolIdentityProvider: CfnUserPoolIdentityProvider;

  public readonly openidApi: RestApi;

  constructor(scope: Construct, id: string, props: IUserPoolIdentityProviderLinkedInProps) {
    super(scope, id);

    const getConstructDescription = (partialDesc: string) => `props.restApiName-${partialDesc}`;

    const api = new RestApi(this, props.restApiName, {
      restApiName: props.restApiName,
      deployOptions: { stageName: props.stageName },
    });

    const usagePlanProps: api.UsagePlanProps = {
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    };

    api.addUsagePlan('UsagePlan', usagePlanProps);

    const wellKnownResource = api.root.addResource('.well-known');

    const commonFunctionProps = {
      code: props.lambdaCode,
      environment: {
        LINKEDIN_CLIENT_ID: props.clientId,
        LINKEDIN_CLIENT_SECRET: props.clientSecret,
        COGNITO_REDIRECT_URI: `${props.cognitoHostedUiDomain}/oauth2/idpresponse`,
        LINKEDIN_API_URL: 'https://api.linkedin.com',
        LINKEDIN_LOGIN_URL: 'https://www.linkedin.com',
        LINKEDIN_SCOPE: 'r_liteprofile r_emailaddress',
      },
      runtime: Runtime.NODEJS_14_X,
      timeout: Duration.minutes(15),
    };
    const openIdDiscoveryFunction = new Function(this, 'OpenIdDiscoveryFunction', {
      ...commonFunctionProps,
      handler: 'openIdConfiguration.handler',
      description: getConstructDescription('openid-configuration'),
    });
    const openIdConfigurationResource = wellKnownResource.addResource('openid-configuration');
    openIdConfigurationResource.addMethod('GET', new LambdaIntegration(openIdDiscoveryFunction));

    const authorizeFunction = new Function(this, 'AuthorizeFunction', {
      ...commonFunctionProps,
      handler: 'authorize.handler',
      description: getConstructDescription('authorize'),
    });
    const authorizeResource = api.root.addResource('authorize');
    authorizeResource.addMethod('GET', new LambdaIntegration(authorizeFunction));

    const tokenFunction = new Function(this, 'TokenFunction', {
      ...commonFunctionProps,
      handler: 'token.handler',
      description: getConstructDescription('token'),
    });
    const tokenResource = api.root.addResource('token');
    tokenResource.addMethod('GET', new LambdaIntegration(tokenFunction));
    tokenResource.addMethod('POST', new LambdaIntegration(tokenFunction));

    const userInfoFunction = new Function(this, 'UserInfoFunction', {
      ...commonFunctionProps,
      handler: 'userinfo.handler',
      description: getConstructDescription('userinfo'),
    });
    const userInfoResource = api.root.addResource('userinfo');
    userInfoResource.addMethod('GET', new LambdaIntegration(userInfoFunction));
    userInfoResource.addMethod('POST', new LambdaIntegration(userInfoFunction));

    const jwksFunction = new Function(this, 'JwksFunction', {
      ...commonFunctionProps,
      handler: 'jwks.handler',
      description: getConstructDescription('jwks'),
    });
    const jwksJsonResource = wellKnownResource.addResource('jwks.json');
    jwksJsonResource.addMethod('GET', new LambdaIntegration(jwksFunction));

    this.openidApi = api;

    this.userPoolIdentityProvider = new CfnUserPoolIdentityProvider(this, 'UserPoolIdentityProviderLinkedIn', {
      providerName: 'LinkedIn',
      providerDetails: {
        client_id: props.clientId,
        client_secret: props.clientSecret,
        attributes_request_method: 'GET',
        oidc_issuer: api.url,
        authorize_scopes: props.scopes,
        authorize_url: `${api.url}/authorize`,
        token_url: `${api.url}/token`,
        attributes_url: `${api.url}/userinfo`,
        jwks_uri: `${api.url}/.well-known/jwks.json`,
      },
      providerType: 'OIDC',
      attributeMapping: props.attributeMapping,
      userPoolId: props.userPool.userPoolId,
    });
  }
}
