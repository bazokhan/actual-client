import gql from 'graphql-tag';

export default gql`
  mutation CREATE_CATEGORIES($categories: [CreateCategoryInput!]!) {
    createCategories(categories: $categories) {
      id
      name
      group {
        id
        isIncome
      }
    }
  }
`;
