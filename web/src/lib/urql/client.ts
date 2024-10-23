import { cacheExchange } from '@urql/exchange-graphcache'
import { relayPagination } from '@urql/exchange-graphcache/extras'
import { Client, fetchExchange } from 'urql'

const cache = cacheExchange({
  resolvers: {
    Query: {
      todos: relayPagination(),
    },
  },
})

export const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cache, fetchExchange],
})
