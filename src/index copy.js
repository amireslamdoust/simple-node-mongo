import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const { DB_URI, DB_NAME } = process.env;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
  Query: {
    books: (root, args, context) => {
      console.log(context); // Should log the context object with db
      return books;
    },
  },
};

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db(DB_NAME);

    // The ApolloServer constructor requires your schema and resolvers.
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Pass context via startStandaloneServer, so it’s available in resolvers
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async () => ({
        db,
      }),
    });

    console.log(`🚀  Server ready at: ${url}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
