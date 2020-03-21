import gql from 'graphql-tag';

export default gql`
  query TRANSACTIONS {
    transactions {
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
