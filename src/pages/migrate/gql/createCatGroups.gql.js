import gql from 'graphql-tag';

export default gql`
  mutation CREATE_CAT_GROUPS($groups: [CreateCatGroupInput!]!) {
    createCatGroups(groups: $groups) {
      id
      name
    }
  }
`;
