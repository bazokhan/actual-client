import gql from 'graphql-tag';

export default gql`
  mutation LOGIN($credentials: LoginInput!) {
    login(credentials: $credentials)
  }
`;
