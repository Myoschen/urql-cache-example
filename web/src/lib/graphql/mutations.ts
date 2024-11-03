import { graphql } from './index'
import { TodoFragment } from './queries'

export const AddTodo = graphql(`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
    }
  }
`)

export const UpdateTodo = graphql(`
  mutation UpdateTodo($id: ID!, $text: String!) {
    updateTodo(id: $id, text: $text) {
      id
      text
    }
  }
`)

export const DeleteTodo = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`)
