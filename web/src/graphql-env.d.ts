/* eslint-disable */
/* prettier-ignore */

export type introspection_types = {
    'Boolean': unknown;
    'ID': unknown;
    'Int': unknown;
    'Mutation': { kind: 'OBJECT'; name: 'Mutation'; fields: { 'addTodo': { name: 'addTodo'; type: { kind: 'OBJECT'; name: 'Todo'; ofType: null; } }; 'deleteTodo': { name: 'deleteTodo'; type: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; } }; 'updateTodo': { name: 'updateTodo'; type: { kind: 'OBJECT'; name: 'Todo'; ofType: null; } }; }; };
    'PageInfo': { kind: 'OBJECT'; name: 'PageInfo'; fields: { 'endCursor': { name: 'endCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; 'hasNextPage': { name: 'hasNextPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'hasPreviousPage': { name: 'hasPreviousPage'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'Boolean'; ofType: null; }; } }; 'startCursor': { name: 'startCursor'; type: { kind: 'SCALAR'; name: 'String'; ofType: null; } }; }; };
    'Query': { kind: 'OBJECT'; name: 'Query'; fields: { 'todos': { name: 'todos'; type: { kind: 'OBJECT'; name: 'TodoConnection'; ofType: null; } }; }; };
    'String': unknown;
    'Todo': { kind: 'OBJECT'; name: 'Todo'; fields: { 'createdAt': { name: 'createdAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'id': { name: 'id'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'ID'; ofType: null; }; } }; 'text': { name: 'text'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'updatedAt': { name: 'updatedAt'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; }; };
    'TodoConnection': { kind: 'OBJECT'; name: 'TodoConnection'; fields: { 'edges': { name: 'edges'; type: { kind: 'LIST'; name: never; ofType: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'TodoEdge'; ofType: null; }; }; } }; 'pageInfo': { name: 'pageInfo'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'PageInfo'; ofType: null; }; } }; }; };
    'TodoEdge': { kind: 'OBJECT'; name: 'TodoEdge'; fields: { 'cursor': { name: 'cursor'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'SCALAR'; name: 'String'; ofType: null; }; } }; 'node': { name: 'node'; type: { kind: 'NON_NULL'; name: never; ofType: { kind: 'OBJECT'; name: 'Todo'; ofType: null; }; } }; }; };
};

/** An IntrospectionQuery representation of your schema.
 *
 * @remarks
 * This is an introspection of your schema saved as a file by GraphQLSP.
 * It will automatically be used by `gql.tada` to infer the types of your GraphQL documents.
 * If you need to reuse this data or update your `scalars`, update `tadaOutputLocation` to
 * instead save to a .ts instead of a .d.ts file.
 */
export type introspection = {
  name: never;
  query: 'Query';
  mutation: 'Mutation';
  subscription: never;
  types: introspection_types;
};

import * as gqlTada from 'gql.tada';

declare module 'gql.tada' {
  interface setupSchema {
    introspection: introspection
  }
}