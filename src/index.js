import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { Resolver as resolvers } from "./generated/graphql";
import fs from "fs"; // Import generated code

const schema = fs.readFileSync("./mapping/base.graphql", {
  encoding: "utf-8",
  flag: "r",
});
const typeDefs = gql`
  ${schema}
`;

dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7 days",
  });
};

const getUserFromToken = async (token, db) => {
  if (!token) {
    return null;
  }
  const tokenData = jwt.verify(token, JWT_SECRET);

  if (!tokenData?.id) {
    return null;
  }

  const obj = new ObjectId(String(tokenData.id)); // Ensure tokenData.id is a string

  return await db.collection("Users").findOne({ _id: obj });
};

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
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
    const db = client.db(DB_NAME);

    // The ApolloServer constructor requires your schema and resolvers.
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });

    // Pass context via startStandaloneServer, so it’s available in resolvers
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => {
        const user = await getUserFromToken(req.headers.authorization, db);
        return {
          db,
          user,
        };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

// Call the run function without closing the client
run().catch(console.dir);
