import gql from 'graphql-tag';

export default gql`
  query CONTRIBUTOR_ACCOUNTS($serviceId: ID!) {
    accounts: contributorAccounts(serviceId: $serviceId) {
      id
      name
      balance
    }
  }
`;
