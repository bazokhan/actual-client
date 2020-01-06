import gql from 'graphql-tag';

export default gql`
  mutation CREATE_TRANSACTIONS($transactions: [CreateTransactionInput!]!) {
    createTransactions(transactions: $transactions) {
      id
      amount
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
      }
    }
  }
`;
