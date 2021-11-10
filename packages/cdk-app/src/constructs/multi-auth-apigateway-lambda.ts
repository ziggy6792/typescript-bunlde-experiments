/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
/**
 *  Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as api from '@aws-cdk/aws-apigateway';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from '@aws-cdk/aws-cognito';
import { LogGroup } from '@aws-cdk/aws-logs';
import * as iam from '@aws-cdk/aws-iam';
import * as defaults from '@aws-solutions-constructs/core';
import { Construct } from '@aws-cdk/core';
import { OAuthScope } from '@aws-cdk/aws-cognito';
import _ from 'lodash';

/**
 * @summary The properties for the MultiAuthApiGatewayLambda Construct
 */
export interface MultiAuthApiGatewayLambdaProps {
  /**
   * Existing instance of Lambda Function object, if this is set then the lambdaFunctionProps is ignored.
   *
   * @default - None
   */
  readonly existingLambdaObj?: lambda.Function;
  /**
   * User provided props to override the default props for the Lambda function.
   *
   * @default - Default props are used
   */
  readonly lambdaFunctionProps?: lambda.FunctionProps;
  /**
   * Optional user provided props to override the default props for the API Gateway.
   *
   * @default - Default props are used
   */
  readonly apiGatewayProps?: api.LambdaRestApiProps | any;
  /**
   * Optional user provided props to override the default props
   *
   * @default - Default props are used
   */
  readonly cognitoUserPoolProps?: cognito.UserPoolProps;
  /**
   * Optional user provided props to override the default props
   *
   * @default - Default props are used
   */
  readonly cognitoUserPoolClientProps?: cognito.UserPoolClientProps | any;
  readonly scopes?: OAuthScope[];

  readonly enableAuthNone?: boolean;
}

export enum RESOURCE_TYPE {
  AUTH_ROLE = 'auth-role',
  AUTH_USER = 'auth-user',
  AUTH_NONE = 'auth-none',
}

export class MultiAuthApiGatewayLambda extends Construct {
  public readonly userPool: cognito.UserPool;

  public readonly userPoolClient: cognito.UserPoolClient;

  public readonly apiGateway: api.RestApi;

  public readonly apiGatewayCloudWatchRole: iam.Role;

  public readonly apiGatewayLogGroup: LogGroup;

  public readonly apiGatewayAuthorizer: api.CfnAuthorizer;

  public readonly lambdaFunction: lambda.Function;

  public readonly authdResources: { type: RESOURCE_TYPE; resource: api.Resource }[];

  private readonly scopes: OAuthScope[];

  /**
   * @summary Constructs a new instance of the MultiAuthApiGatewayLambda class.
   * @param {cdk.App} scope - represents the scope for all the resources.
   * @param {string} id - this is a a scope-unique id.
   * @param {MultiAuthApiGatewayLambdaProps} props - user provided props for the construct
   * @since 0.8.0
   * @access public
   */
  constructor(scope: Construct, id: string, props: MultiAuthApiGatewayLambdaProps) {
    super(scope, id);

    this.lambdaFunction = defaults.buildLambdaFunction(this, {
      existingLambdaObj: props.existingLambdaObj,
      lambdaFunctionProps: props.lambdaFunctionProps,
    });
    [this.apiGateway, this.apiGatewayCloudWatchRole, this.apiGatewayLogGroup] = defaults.GlobalLambdaRestApi(this, this.lambdaFunction, props.apiGatewayProps);
    this.userPool = defaults.buildUserPool(this, props.cognitoUserPoolProps);
    this.userPoolClient = defaults.buildUserPoolClient(this, this.userPool, props.cognitoUserPoolClientProps);

    this.apiGatewayAuthorizer = new api.CfnAuthorizer(this, 'CognitoAuthorizer', {
      restApiId: this.apiGateway.restApiId,
      type: api.AuthorizationType.COGNITO,
      providerArns: [this.userPool.userPoolArn],
      identitySource: 'method.request.header.Authorization',
      name: 'cognito-authorizer',
    });

    this.authdResources = [];

    const resourceTypesToAdd = [RESOURCE_TYPE.AUTH_USER, RESOURCE_TYPE.AUTH_ROLE, props.enableAuthNone ? RESOURCE_TYPE.AUTH_NONE : null].filter(_.identity);

    resourceTypesToAdd.forEach((type) => {
      this.authdResources.push({ type, resource: this.apiGateway.root.addResource(type) });
    });

    // this.resources.push({type})

    // this.authUserResource = this.apiGateway.root.addResource(RESOURCE_TYPE.AUTH_USER);
    // this.authRoleResource = this.apiGateway.root.addResource(RESOURCE_TYPE.AUTH_ROLE);
    // if (props.enableAuthNone) {
    //   this.authNoneResource = this.apiGateway.root.addResource(RESOURCE_TYPE.AUTH_NONE);
    // }

    this.scopes = props.scopes;
  }

  // authorizedRoles are the roles that will be allowed to invoke the iam authorized methods
  public addAuthorizers(authorizedRoles: { [key: string]: iam.IRole }) {
    const authorizedRolePolicyStatements: iam.PolicyStatement[] = [];
    this.apiGateway.methods.forEach((apiMethod) => {
      if (apiMethod.resource.path.startsWith(`/${RESOURCE_TYPE.AUTH_USER}`)) {
        this.addCognitoAuthorizer(apiMethod);
      } else if (apiMethod.resource.path.startsWith(`/${RESOURCE_TYPE.AUTH_ROLE}`)) {
        this.addIamAuthorizer(apiMethod);
        authorizedRolePolicyStatements.push(
          new iam.PolicyStatement({
            actions: ['execute-api:Invoke'],
            effect: iam.Effect.ALLOW,
            resources: [apiMethod.methodArn],
          })
        );
      } else {
        this.addNoAuthorizer(apiMethod);
      }
    });

    for (const [key, authorizedRole] of Object.entries(authorizedRoles)) {
      authorizedRole.attachInlinePolicy(
        new iam.Policy(this, `${key}InvokeApi`, {
          statements: authorizedRolePolicyStatements,
        })
      );
    }
  }

  private addNoAuthorizer(apiMethod: api.Method) {
    const child = apiMethod.node.findChild('Resource') as api.CfnMethod;
    child.addPropertyOverride('AuthorizationType', api.AuthorizationType.NONE);
  }

  private addCognitoAuthorizer(apiMethod: api.Method) {
    // Leave the authorizer NONE for HTTP OPTIONS method to support CORS, for the rest set it to COGNITO

    const child = apiMethod.node.findChild('Resource') as api.CfnMethod;
    if (apiMethod.httpMethod === 'OPTIONS') {
      child.addPropertyOverride('AuthorizationType', api.AuthorizationType.NONE);
    } else {
      child.addPropertyOverride('AuthorizationType', api.AuthorizationType.COGNITO);
      child.addPropertyOverride('AuthorizerId', { Ref: this.apiGatewayAuthorizer.logicalId });
      if (this.scopes) {
        child.addPropertyOverride(
          'AuthorizationScopes',
          this.scopes.map((scope) => scope.scopeName)
        );
      }
    }
  }

  private addIamAuthorizer(apiMethod: api.Method) {
    // Leave the authorizer NONE for HTTP OPTIONS method to support CORS, for the rest set it to COGNITO

    const child = apiMethod.node.findChild('Resource') as api.CfnMethod;
    if (apiMethod.httpMethod === 'OPTIONS') {
      child.addPropertyOverride('AuthorizationType', api.AuthorizationType.NONE);
    } else {
      child.addPropertyOverride('AuthorizationType', api.AuthorizationType.IAM);
    }
  }
}

export default MultiAuthApiGatewayLambda;
