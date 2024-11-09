import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { getUserFromToken } from "./utils/getUserFromToken" // Import generated code
import { resolvers } from "./lambda/resolvers" // Import generated code
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb"
import dotenv from "dotenv"
import gql from "graphql-tag"
import { fileURLToPath } from "url"

import * as path from "path"
import * as fs from "fs"

// Convert `import.meta.url` to a file path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const schemaPath = path.join(__dirname, "mapping", "base.graphql")

console.log(schemaPath)

const schema = fs.readFileSync(schemaPath, {
  encoding: "utf-8",
  flag: "r",
})

const typeDefs = gql`
  ${schema}
`

//
// const schema = fs.readFileSync("./mapping/base.graphql", {
//   encoding: "utf-8",
//   flag: "r",
// });
//
// const typeDefs = gql`
//   ${schema}
// `;

const { DB_URI, DB_NAME } = process.env

const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server
    await client.connect()
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    )
    const db = client.db(DB_NAME)

    // The ApolloServer constructor requires your schema and resolvers.
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    // Pass context via startStandaloneServer, so it’s available in resolvers
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => {
        const user = await getUserFromToken(req.headers.authorization, db)
        return {
          db,
          user,
        }
      },
    })

    console.log(`🚀  Server ready at: ${url}`)
  } catch (error) {
    console.error("Error starting server:", error)
  }
}

// Call the run function without closing the client
run().catch(console.dir)
