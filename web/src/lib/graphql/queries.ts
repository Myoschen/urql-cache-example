import { graphql } from './index'

export const TodosConnection = graphql(`
  query TodosConnection($first: Int, $last: Int, $after: String, $before: String) {
    todos(first: $first, last: $last, after: $after, before: $before) @_relayPagination {
      edges {
        cursor
        node {
          id
          text
          createdAt
          updatedAt
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }
`)
