import gql from 'graphql-tag';

const groupsGql = gql`
  query GROUPS {
    groups {
      id
      name
      categories {
        id
        name
      }
      count
      balance
    }
  }
`;

const createGroupGql = gql`
  mutation CREATE_GROUP($name: String!, $isIncome: Boolean!) {
    createGroup(group: { name: $name, isIncome: $isIncome }) {
      id
      name
      isIncome
    }
  }
`;

const deleteGroupGql = gql`
  mutation DELETE_GROUP($id: ID!) {
    deleteGroup(id: $id) {
      id
      name
    }
  }
`;

export { groupsGql, createGroupGql, deleteGroupGql };
