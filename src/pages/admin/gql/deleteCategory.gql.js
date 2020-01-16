import gql from 'graphql-tag';

export default gql`
  mutation DELETE_CATEGORY($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;
