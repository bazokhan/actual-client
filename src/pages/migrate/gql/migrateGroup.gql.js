import gql from 'graphql-tag';

export default gql`
  mutation MIGRATE_GROUP($group: MigrateGroupInput!) {
    migrateGroup(group: $group) {
      id
      name
    }
  }
`;
