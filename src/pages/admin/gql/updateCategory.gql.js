import gql from 'graphql-tag';

export default gql`
  mutation UPDATE_CATEGORY($id: ID!, $category: UpdateCategoryInput) {
    updateCategory(id: $id, category: $category) {
      id
      name
      group {
        id
        name
      }
    }
  }
`;
