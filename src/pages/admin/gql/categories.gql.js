import gql from 'graphql-tag';

const categoriesGql = gql`
  query CATEGORIES {
    categories {
      id
      name
      count
      balance
      group {
        id
        name
      }
    }
  }
`;

const createCategoryGql = gql`
  mutation CREATE_CATEGORY($name: String!, $groupId: ID!) {
    createCategory(category: { name: $name, groupId: $groupId }) {
      id
      name
    }
  }
`;

const deleteCategoryGql = gql`
  mutation DELETE_CATEGORY($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
    }
  }
`;

const updateCategoryGql = gql`
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

export {
  categoriesGql,
  createCategoryGql,
  deleteCategoryGql,
  updateCategoryGql
};
