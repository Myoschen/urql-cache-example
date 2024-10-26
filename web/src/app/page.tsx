'use client'

import { type FormEvent, useState } from 'react'
import { useClient, useQuery } from 'urql'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type FragmentType, graphql, useFragment } from '@/gql'
import type { TodoConnectionQueryVariables } from '@/gql/graphql'

const TodoFragment = graphql(`
  fragment TodoItem on Todo {
    id
    text
  }  
`)

const TodoConnection = graphql(`
  query TodoConnection($first: Int, $last: Int, $after: String, $before: String) {
    todos(first: $first, last: $last, after: $after, before: $before) @_relayPagination {
      edges {
        cursor
        node {
          ...TodoItem
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

const AddTodo = graphql(`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      ...TodoItem
    }
  }
`)

const UpdateTodo = graphql(`
  mutation UpdateTodo($id: ID!, $text: String!) {
    updateTodo(id: $id, text: $text) {
      ...TodoItem
    }
  }
`)

const DeleteTodo = graphql(`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`)

export default function Home() {
  const client = useClient()
  const [openAdd, setOpenAdd] = useState<boolean>(false)
  const [openUpdate, setOpenUpdate] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [variables, setVariables] = useState<TodoConnectionQueryVariables>({ first: 5 })
  const [query, execute] = useQuery({ query: TodoConnection, variables })
  const fragments = query.data?.todos?.edges?.map(({ node }) => node) ?? []
  const pageInfo = query.data?.todos?.pageInfo

  const handleMore = () => {
    const { endCursor, hasNextPage } = pageInfo ?? {}
    if (hasNextPage && endCursor) setVariables({ first: 5, after: endCursor })
  }

  const handleAdd = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const text = formData.get('text') as string | null
    if (!text) return
    await client.mutation(AddTodo, { text }).toPromise()
    setOpenAdd(false)
  }

  const handleUpdate = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const id = formData.get('id') as string | null
    const text = formData.get('text') as string | null
    if (!id || !text) return
    await client.mutation(UpdateTodo, { id, text }).toPromise()
    setOpenUpdate(false)
  }

  const handleDelete = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const formData = new FormData(ev.currentTarget)
    const id = formData.get('id') as string | null
    if (!id) return
    await client.mutation(DeleteTodo, { id }).toPromise()
    setOpenDelete(false)
  }

  const handleExecute = () => {
    execute({ requestPolicy: 'cache-and-network' })
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <main className="flex min-h-screen items-center justify-center py-16">
      {/* list */}
      <ul className="space-y-4">
        {fragments.map((fragment, index) => (
          <TodoItem key={index} fragment={fragment} />
        ))}
      </ul>

      {/* floating bar */}
      <div className="fixed bottom-4 mx-auto flex items-center gap-x-1 rounded-lg border bg-background p-1">
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
          onClick={handleExecute}
        >
          Execute
        </Button>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild={true}>
            <Button variant="ghost" size="sm">
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Add Todo</DialogTitle>
              <DialogDescription>Create a new todo. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleAdd}>
              <div className="grid gap-y-2">
                <Label htmlFor="text">Text</Label>
                <Input id="text" name="text" />
              </div>
              <DialogFooter>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openUpdate} onOpenChange={setOpenUpdate}>
          <DialogTrigger asChild={true}>
            <Button variant="ghost" size="sm">
              Update
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Update Todo</DialogTitle>
              <DialogDescription>Make changes to todo. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div className="grid gap-y-2">
                <Label htmlFor="id">ID</Label>
                <Input id="id" name="id" />
                <Label htmlFor="text">Text</Label>
                <Input id="text" name="text" />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild={true}>
            <Button variant="ghost" size="sm">
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Todo</DialogTitle>
              <DialogDescription>Delete a todo. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleDelete}>
              <div className="grid gap-y-2">
                <Label htmlFor="id">ID</Label>
                <Input id="id" name="id" />
              </div>
              <DialogFooter>
                <Button type="submit">Delete</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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

function TodoItem({ fragment }: { fragment: FragmentType<typeof TodoFragment> }) {
  const todo = useFragment(TodoFragment, fragment)

  return (
    <li className="flex flex-col border-b pb-2 last:border-none">
      <span className="text-xs">{todo.id}</span>
      <span className="text-sm font-light text-muted-foreground">{todo.text}</span>
    </li>
  )
}
