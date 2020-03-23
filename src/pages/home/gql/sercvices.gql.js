import gql from 'graphql-tag';

export default gql`
  query SERVICES {
    myService {
      id
      owner {
        id
        name
      }
      contributors {
        id
        name
      }
    }

    contributorServices {
      id
      owner {
        id
        name
      }
    }
  }
`;
