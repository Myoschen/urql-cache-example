/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  fragment TodoItem on Todo {\n    id\n    text\n  }  \n": types.TodoItemFragmentDoc,
    "\n  query TodoConnection ($first: Int, $last: Int, $after: String, $before: String) {\n    todos(first: $first, last: $last, after: $after, before: $before) {\n      edges {\n        cursor\n        node {\n          ...TodoItem\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n": types.TodoConnectionDocument,
    "\n  mutation AddTodo ($text: String!) {\n    addTodo(text: $text) {\n      ...TodoItem\n    }\n  }\n": types.AddTodoDocument,
    "\n  mutation UpdateTodo ($id: ID!, $text: String!) {\n    updateTodo(id: $id, text: $text) {\n      ...TodoItem\n    }\n  }\n": types.UpdateTodoDocument,
    "\n  mutation DeleteTodo ($id: ID!) {\n    deleteTodo(id: $id)\n  }\n": types.DeleteTodoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TodoItem on Todo {\n    id\n    text\n  }  \n"): (typeof documents)["\n  fragment TodoItem on Todo {\n    id\n    text\n  }  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TodoConnection ($first: Int, $last: Int, $after: String, $before: String) {\n    todos(first: $first, last: $last, after: $after, before: $before) {\n      edges {\n        cursor\n        node {\n          ...TodoItem\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query TodoConnection ($first: Int, $last: Int, $after: String, $before: String) {\n    todos(first: $first, last: $last, after: $after, before: $before) {\n      edges {\n        cursor\n        node {\n          ...TodoItem\n        }\n      }\n      pageInfo {\n        startCursor\n        endCursor\n        hasNextPage\n        hasPreviousPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddTodo ($text: String!) {\n    addTodo(text: $text) {\n      ...TodoItem\n    }\n  }\n"): (typeof documents)["\n  mutation AddTodo ($text: String!) {\n    addTodo(text: $text) {\n      ...TodoItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTodo ($id: ID!, $text: String!) {\n    updateTodo(id: $id, text: $text) {\n      ...TodoItem\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTodo ($id: ID!, $text: String!) {\n    updateTodo(id: $id, text: $text) {\n      ...TodoItem\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTodo ($id: ID!) {\n    deleteTodo(id: $id)\n  }\n"): (typeof documents)["\n  mutation DeleteTodo ($id: ID!) {\n    deleteTodo(id: $id)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;