import gql from 'graphql-tag';

export default gql`
  mutation CREATE_PAYEES($payees: [CreatePayeeInput!]!) {
    createPayees(payees: $payees) {
      id
      name
      account {
        id
        name
      }
    }
  }
`;
