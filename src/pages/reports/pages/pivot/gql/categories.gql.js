import gql from 'graphql-tag';

export default gql`
  query CATEGORIES {
    categories {
      id
      name
      transactions {
        id
        date
        account {
          id
          name
        }
        amount
        payee {
          id
          name
        }
      }
      balance
    }
  }
`;
