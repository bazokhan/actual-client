import gql from 'graphql-tag';

export default gql`
  query SIDEBAR {
    categories {
      id
      name
    }

    payees {
      id
      name
    }

    accounts {
      id
      name
    }
  }
`;
