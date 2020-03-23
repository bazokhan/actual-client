import gql from 'graphql-tag';

export default gql`
  query TRANSACTION_INPUT_LIST {
    accounts {
      id
      name
    }

    payees {
      id
      name
    }

    categories {
      id
      name
    }
  }
`;
