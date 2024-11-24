import { graphql } from './index'

export const AddTodo = graphql(`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      createdAt
      updatedAt
    }
  }
`)

export const UpdateTodo = graphql(`
  mutation UpdateTodo($id: ID!, $text: String!) {
    updateTodo(id: $id, text: $text) {
      id
      text
      createdAt
      updatedAt
    }
  }
`)

export const DeleteTodo = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`)
