import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_CATEGORY($category: MigrateCategoryInput!) {
    migrateCategory(category: $category) {
      id
      name
      group {
        id
        isIncome
      }
    }
  }
`;
