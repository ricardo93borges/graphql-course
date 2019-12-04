import { GraphQLServer } from "graphql-yoga";

/**
 * Scalar types: String, Boolean, Int, Float, ID
 * 
 */

 /**
  * Custom types: User, Product, etc
  */

  // Demo data
  const users = [{
      id: '1',
      name: 'Borges',
      email: 'mail@mail.com',
      age: 26
  },{
    id: '1',
    name: 'Silva',
    email: 'mail@mail.com',
    age: 26
},{
    id: '1',
    name: 'Ricardo',
    email: 'mail@mail.com',
    age: 26
}]

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String): String!
        add(numbers: [Float!]!): Float!
        grades: [Int]!
        me: User!
        users(query: String): [User]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if(!args.query)
                return users

            return users.filter(user => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        greeting(parent, args, context, info){
            return `Hello ${args.name ? args.name : ''}`
        },
        add(parent, args) {            
            return args.numbers.reduce((acc, value) => {
                return acc + value
            }, 0)
        },
        grades(parent, args, ctx, info){
            return [1,2,3]
        },
        me() {
            return {
                id: '1',
                name: 'Ricardo',
                email: 'ricardo93borges@gmail.com',
                age: null
            }
        },        
    }
}

const server = new GraphQLServer({typeDefs, resolvers})
server.start(()=> {
    console.log('Server is up')
})
