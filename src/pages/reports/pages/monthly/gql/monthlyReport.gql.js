import gql from 'graphql-tag';

export default gql`
  query MONTHLY_REPORT {
    accounts {
      id
      name
      transactions {
        id
        createdAt
        amount
        date
        category {
          id
          name
          group {
            id
            name
            isIncome
          }
        }
        payee {
          id
          name
        }
        account {
          id
          name
        }
      }
    }

    groups {
      id
      name
    }

    categories {
      id
      name
      transactions {
        id
      }
    }
  }
`;
