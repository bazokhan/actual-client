import gql from 'graphql-tag';

export default gql`
  query CONTRIBUTOR_SIDEBAR($serviceId: ID!) {
    categories: contributorCategories(serviceId: $serviceId) {
      id
      name
    }

    payees: contributorPayees(serviceId: $serviceId) {
      id
      name
    }

    accounts: contributorAccounts(serviceId: $serviceId) {
      id
      name
    }
  }
`;
