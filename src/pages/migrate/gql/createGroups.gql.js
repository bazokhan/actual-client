import gql from 'graphql-tag';

export default gql`
  mutation CREATE_GROUPS($groups: [CreateGroupInput!]!) {
    createGroups(groups: $groups) {
      id
      name
    }
  }
`;
