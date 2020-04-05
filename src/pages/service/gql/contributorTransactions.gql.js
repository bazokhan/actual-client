import gql from 'graphql-tag';

export default gql`
  query CONTRIBUTOR_TRANSACTIONS($serviceId: ID!) {
    transactions: contributorTransactions(serviceId: $serviceId) {
      id
      amount
      notes
      date
      account {
        id
        name
      }
      category {
        id
        name
      }
      payee {
        id
        name
        account {
          id
        }
      }
    }
  }
`;
