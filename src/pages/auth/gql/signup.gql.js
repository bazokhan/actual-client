import gql from 'graphql-tag';

export default gql`
  mutation SIGNUP($user: CreateUserInput!) {
    createUser(user: $user) {
      id
      name
      email
    }
  }
`;
