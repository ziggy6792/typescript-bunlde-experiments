/* eslint-disable max-len */
import { mongoose } from '@typegoose/typegoose';
import { gCall } from 'src/test-utils/g-call';
import testConn from 'src/test-utils/test-conn';

beforeAll(async () => {
  await testConn();
});

const updateUserMutation = `mutation updateUser($input: UpdateUserInput!){ 
  updateUser(input: $input){
    id
    firstName
    lastName
    email
    cognitoId
  }
}`;

// ToDo move to globalTeardown
afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});

describe('User Resolver', () => {
  it('update user', async () => {
    const response = await gCall({
      source: updateUserMutation,
      variableValues: {
        input: { id: '615f3231b914431518da484d', firstName: 'Fred', lastName: 'Bob', email: 'ziggy067s2@gmail.com' },
      },
    });

    const expectedResponse = {
      data: { updateUser: { id: '615f3231b914431518da484d', firstName: 'Fred', lastName: 'Bob', email: 'ziggy067s2@gmail.com', cognitoId: '1234' } },
    };

    expect(response).toMatchObject(expectedResponse);
  });
});
