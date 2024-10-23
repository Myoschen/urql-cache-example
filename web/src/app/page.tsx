'use client'

import { useState } from 'react'
import { useQuery } from 'urql'

import { Button } from '@/components/ui/button'
import { graphql } from '@/gql'
import type { TodoConnectionQueryVariables } from '@/gql/graphql'

const TodoConnection = graphql(`
  query TodoConnection ($first: Int, $last: Int, $after: String, $before: String) {
    todos(first: $first, last: $last, after: $after, before: $before) {
      edges {
        cursor
        node {
          id
          text
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

export default function Home() {
  const [variables, setVariables] = useState<TodoConnectionQueryVariables>({ first: 5 })
  const [query] = useQuery({ query: TodoConnection, variables })
  const todos = query.data?.todos?.edges?.map(({ node }) => node) ?? []
  const pageInfo = query.data?.todos?.pageInfo

  const handleReload = () => {
    window.location.reload()
  }

  const handleMore = () => {
    console.log(pageInfo)
    const { endCursor, hasNextPage } = pageInfo ?? {}
    if (hasNextPage && endCursor) setVariables({ first: 5, after: endCursor })
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center">
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="text-sm font-light text-muted-foreground"
          >
            {todo.text}
          </li>
        ))}
      </ul>

      {/* floating bar */}
      <div className="absolute bottom-4 mx-auto flex items-center gap-x-1 rounded-lg border bg-background p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMore}
        >
          Load More
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReload}
        >
          Reload
        </Button>
      </div>
    </main>
  )
}
