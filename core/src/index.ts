import { faker } from '@faker-js/faker'
import cors from 'cors'
import { addDays, compareAsc } from 'date-fns'
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

const todos = Array.from({ length: 20 }, () => {
  const date = faker.date.between({ from: new Date(), to: addDays(new Date(), 7) })
  return {
    id: faker.string.uuid(),
    text: faker.lorem.sentence(),
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  }
})

const schema = buildSchema(`
  type Todo {
    id: ID!
    text: String!
    createdAt: String!
    updatedAt: String!
  }

  type TodoEdge {
    cursor: String!
    node: Todo!
  }
  
  type TodoConnection {
    edges: [TodoEdge!]
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
    deleteTodo(id: ID!): Boolean
  }
`)

const rootValue = {
  todos: ({
    first, after, last, before,
  }: { first?: number, after?: string, last?: number, before?: string }) => {
    const sortedTodos = todos.toSorted((a, b) => compareAsc(a.createdAt, b.createdAt))

    let startIndex: number = 0
    let endIndex: number = todos.length

    if (after) {
      const afterIndex = sortedTodos.findIndex(todo => todo.id === after)
      if (afterIndex >= 0) {
        startIndex = afterIndex + 1
      }
    }

    if (before) {
      const beforeIndex = sortedTodos.findIndex(todo => todo.id === before)
      if (beforeIndex >= 0) {
        endIndex = beforeIndex
      }
    }

    let slicedTodos
    if (first) {
      slicedTodos = sortedTodos.slice(startIndex, startIndex + first)
    } else if (last) {
      slicedTodos = sortedTodos.slice(Math.max(0, endIndex - last), endIndex)
    } else {
      slicedTodos = sortedTodos.slice(startIndex, endIndex)
    }

    const edges = slicedTodos.map(todo => ({ cursor: todo.id, node: todo }))
    const startCursor = edges.length > 0 ? edges[0].cursor : null
    const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null

    let hasNextPage = endIndex < todos.length
    let hasPreviousPage = startIndex > 0

    if (first && slicedTodos.length === first) {
      hasNextPage = startIndex + first < todos.length
    }

    if (last && slicedTodos.length === last) {
      hasPreviousPage = endIndex - last > 0
    }

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
    const timestamp = new Date().toISOString()
    const newTodo = {
      id: faker.string.uuid(),
      text,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    todos.push(newTodo)
    return newTodo
  },
  updateTodo: ({ id, text }: { id: string, text: string }) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) {
      throw new Error('Todo not found')
    }
    todo.text = text
    todo.updatedAt = new Date().toISOString()
    return todo
  },
  deleteTodo: ({ id }: { id: string }) => {
    const todoIndex = todos.findIndex(t => t.id === id)
    if (todoIndex < 0) {
      throw new Error('Todo not found')
    }
    todos.splice(todoIndex, 1)
    return true
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
}).on('error', console.error)

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
