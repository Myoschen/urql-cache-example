import { faker } from '@faker-js/faker'
import cors from 'cors'
import express from 'express'
import { buildSchema } from 'graphql'
import { createHandler } from 'graphql-http/lib/use/express'
import helmet from 'helmet'
import morgan from 'morgan'
import { ruruHTML } from 'ruru/server'

import { env } from './env'

const app = express()
const port = env.EXPRESS_PORT

// middlewares
app.use(cors())
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ['\'self\'', '\'unsafe-inline\''],
      'script-src-elem': ['\'self\'', '\'unsafe-inline\'', 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
    },
  },
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))

faker.seed(22)

const todos = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  text: faker.lorem.sentence(),
}))

const schema = buildSchema(`
  type Todo {
    id: ID!
    text: String!
  }

  type TodoEdge {
    cursor: String!
    node: Todo!
  }
  
  type TodoConnection {
    edges: [TodoEdge]
    pageInfo: PageInfo!
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type Query {
    todos(first: Int, after: String, last: Int, before: String): TodoConnection
  }

  type Mutation {
    addTodo(text: String!): Todo
    updateTodo(id: ID!, text: String!): Todo
  }
`)

const rootValue = {
  todos: ({
    first, after, last, before,
  }: { first?: number, after?: string, last?: number, before?: string }) => {
    let startIndex: number = 0
    let endIndex: number = todos.length

    if (after) {
      startIndex = todos.findIndex(todo => todo.id === after) + 1
    }

    if (before) {
      endIndex = todos.findIndex(todo => todo.id === before)
    }

    let slicedTodos
    if (first) {
      slicedTodos = todos.slice(startIndex, startIndex + first)
    } else if (last) {
      slicedTodos = todos.slice(Math.max(0, endIndex - last), endIndex)
    } else {
      slicedTodos = todos.slice(startIndex, endIndex)
    }

    const edges = slicedTodos.map(todo => ({ cursor: todo.id, node: todo }))
    const startCursor = edges.length > 0 ? edges[0].cursor : null
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null
    const hasNextPage = endIndex < todos.length
    const hasPreviousPage = startIndex > 0

    return {
      edges,
      pageInfo: {
        startCursor,
        endCursor,
        hasNextPage,
        hasPreviousPage,
      },
    }
  },
  addTodo: ({ text }: { text: string }) => {
    const newTodo = { id: String(todos.length + 1), text }
    todos.push(newTodo)
    return newTodo
  },
  updateTodo: ({ id, text }: { id: string, text: string }) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) {
      throw new Error('Todo not found')
    }
    todo.text = text
    return todo
  },
}

app.all('/graphql', createHandler({ schema, rootValue }))

app.get('/', (_req, res) => {
  res.type('html')
  res.end(ruruHTML({ endpoint: '/graphql' }))
})

const server = app.listen(port, () => {
  console.log(`Running a GraphQL IDE at http://localhost:${port}/`)
  console.log(`Running a GraphQL API server at http://localhost:${port}/graphql`)
})

// graceful shutdown
function shutdownListener() {
  console.log('\ngracefully shutting down')
  setTimeout(() => {
    console.log('shutting down application')
    server.close(() => process.exit())
  }, 0)
}

process.on('SIGINT', shutdownListener)
process.on('SIGTERM', shutdownListener)
