import { Resolvers } from "../../lib/types.generated";

const resolvers: Resolvers = {
  Query: {
    // Auto-generated query resolvers
    getTaskList: async (_, { id }, { db }) => {
      return db.collection("TaskLists").findOne({ _id: id });
    },
    myTaskLists: async (_, __, { db }) => {
      return db.collection("TaskLists").find().toArray();
    },
  },
  Mutation: {
    // Auto-generated mutation resolvers
    createTaskList: async (_, { input }, { db }) => {
      const result = await db.collection("TaskLists").insertOne(input);
      return result.ops[0];
    },
    // More mutation resolvers...
  },
  // More resolvers for other types...
};
