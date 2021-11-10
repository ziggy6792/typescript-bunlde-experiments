import gql from 'graphql-tag';
import { apolloClient } from 'src/utils/apollo-client';

const REGISTER = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`;

export interface IUser {
  email: string;
  cognitoId: string;
}

export const registerUser = async (user: IUser): Promise<any> => {
  console.log('user', user);

  // const response = await client.query({ query: HELLO });
  const response = await apolloClient.mutate({
    mutation: REGISTER,
    variables: {
      input: user,
    },
    // ToDo: Not sure why this doesn't work
    errorPolicy: 'ignore',
  });

  if (response.errors) {
    throw new Error(response.errors.toString());
  }

  return response.data.createUser;
};
