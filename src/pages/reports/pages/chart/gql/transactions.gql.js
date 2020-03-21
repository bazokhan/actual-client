import gql from 'graphql-tag';

export default gql`
  query TRANSACTIONS {
    transactions {
      id
      amount
      date
      account {
        id
        name
      }
      category {
        id
        group {
          id
          name
        }
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
