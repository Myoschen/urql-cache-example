import { cacheExchange, type CacheExchangeOpts } from '@urql/exchange-graphcache'
import { relayPagination } from '@urql/exchange-graphcache/extras'
import { Client, fetchExchange } from 'urql'

const cacheOpts: Partial<CacheExchangeOpts> = {
  directives: {
    relayPagination: opts => relayPagination({ ...opts }),
  },
}

export const client = new Client({
  url: 'http://localhost:4000/graphql',
  exchanges: [cacheExchange(cacheOpts), fetchExchange],
})
