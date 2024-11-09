import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

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

const typeDefs = `#graphql

type Query {
  myTaskLists: [TaskList!]!
  getTaskList(id: ID!): TaskList!
  getToDo(id: ID!): ToDo!
}

type Mutation {
  singUp(input: SignUpInput): AuthUser!
  signIn(input: SingInInput): AuthUser!

  createTaskList(input: CreateTaskListInput): TaskList!
  updateTaskList(input: UpdateTaskListInput): TaskList!
  deleteTaskList(id: ID!): DeleteMessagesStatus
  addUserToTaskList(input: AddUserToTaskList): TaskList!

  createToDo(input: CreateToDoInput): ToDo!
  updateToDo(input: UpdateToDoInput): ToDo!
  deleteToDo(id: ID!): DeleteMessagesStatus
}

type DeleteMessagesStatus {
  message: String!
}

input CreateToDoInput {
  content: String!
  taskListId: ID!
}

input AddUserToTaskList {
  taskListId: ID!
  userId: ID!
}

input SignUpInput {
  email: String!
  password: String!
  name: String!
  avatar: String
}

input SingInInput {
  email: String!
  password: String!
}

input CreateTaskListInput {
  title: String!
}

input UpdateToDoInput {
  id: ID!
  content: String
  isCompleted: Boolean
}

input UpdateTaskListInput {
  id: ID!
  title: String!
  progress: Float
}

type AuthUser {
  user: User!
  token: String!
}

type User {
  id: ID!
  name: String!
  email: String!
  avatar: String
}

type TaskList {
  id: ID!
  createdAt: String!
  title: String!
  progress: Float!

  users: [User!]!
  todos: [ToDo!]!
}

type ToDo {
  id: ID!
  content: String!
  isCompleted: Boolean!

  taskList: TaskList!
}

`;

const resolvers = {
  Query: {
    myTaskLists: async (_, __, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      return await db
        .collection("TaskLists")
        .find({ userIds: user._id })
        .toArray();
    },

    getTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      // Fetch the task list with the provided ID
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task list not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      return taskList;
    },

    getToDo: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      // Fetch the task list with the provided ID
      const todo = await db
        .collection("ToDo")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!todo) {
        throw new Error("ToDo not found");
      }

      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: todo.taskListId });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task List not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      return todo;
    },
  },
  Mutation: {
    singUp: async (_, { input }, { db }) => {
      const { email, password, name, avatar } = input;

      // Check if the email already exists
      const existingUser = await db.collection("Users").findOne({ email });
      if (existingUser) {
        throw new Error("User already registered with this email address");
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password);
      const newUser = {
        email,
        password: hashedPassword,
        name,
        avatar,
      };

      // Insert the new user
      const result = await db.collection("Users").insertOne(newUser);

      // Construct the user object
      const user = {
        id: result.insertedId,
        ...newUser,
      };

      return {
        user,
        token: getToken(user),
      };
    },

    signIn: async (_, { input }, { db }) => {
      const { email, password } = input;
      const user = await db.collection("Users").findOne({ email });

      if (!user) {
        throw new Error("invalid credential!");
      }

      const isPasswordCorrect = bcrypt.compareSync(password, user.password);

      if (!isPasswordCorrect) {
        throw new Error("invalid credential!");
      }

      // user.id = user._id

      return {
        user,
        token: getToken(user),
      };
    },

    createTaskList: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      const { title } = input;

      const newTaskList = {
        title,
        createdAt: new Date().toISOString(),
        userIds: [user._id],
      };
      const result = await db.collection("TaskLists").insertOne(newTaskList);

      // Construct the task list object with the inserted ID
      const taskList = {
        id: result.insertedId,
        ...newTaskList,
      };

      return taskList;
    },

    updateTaskList: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      const { title, id, progress } = input;

      // Fetch the task list with the provided ID
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task list not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const result = await db.collection("TaskLists").updateOne(
        { _id: new ObjectId(String(id)) },
        {
          $set: {
            title,
            progress,
          },
        },
      );

      if (result.matchedCount === 0) {
        throw new Error("Task list not found or not updated");
      }

      // Fetch the updated document
      return await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(id)) });
    },

    deleteTaskList: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      // Fetch the task list with the provided ID
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task list not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const result = await db
        .collection("TaskLists")
        .deleteOne({ _id: new ObjectId(String(id)) });

      if (result.deletedCount === 0) {
        throw new Error("Task list not found or not updated");
      }

      return {
        message: "deleted",
      };
    },

    addUserToTaskList: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }
      const { taskListId, userId } = input;

      // Fetch the task list with the provided ID
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(taskListId)) });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task list not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const isNewUserInList = taskList.userIds.some((userId) =>
        userId.equals(userId),
      );
      if (isNewUserInList) {
        throw new Error("You already add this user to this Task");
      }

      const result = await db.collection("TaskLists").updateOne(
        { _id: new ObjectId(String(taskListId)) },
        {
          $push: {
            userIds: new ObjectId(String(userId)),
          },
        },
      );

      if (result.matchedCount === 0) {
        throw new Error("Task list not found or not updated");
      }

      // Fetch the updated document
      return await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(taskListId)) });
    },

    createToDo: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }
      const { taskListId, content } = input;

      // Fetch the task list with the provided ID
      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(taskListId)) });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task list not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const newToDo = {
        content,
        isCompleted: false,
        taskListId: taskList._id,
      };

      const result = await db.collection("ToDo").insertOne(newToDo);

      // Construct the task list object with the inserted ID
      const ToDo = {
        id: result.insertedId,
        ...newToDo,
        taskList,
      };

      return ToDo;
    },

    updateToDo: async (_, { input }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      const { content, id, isCompleted } = input;

      // Fetch the task list with the provided ID
      const todo = await db
        .collection("ToDo")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!todo) {
        throw new Error("ToDo not found");
      }

      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: todo.taskListId });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task List not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const result = await db.collection("ToDo").updateOne(
        { _id: new ObjectId(String(id)) },
        {
          $set: {
            content,
            isCompleted,
          },
        },
      );

      if (result.matchedCount === 0) {
        throw new Error("ToDo not found or not updated");
      }

      // Fetch the updated document
      return await db
        .collection("ToDo")
        .findOne({ _id: new ObjectId(String(id)) });
    },
    deleteToDo: async (_, { id }, { db, user }) => {
      if (!user) {
        throw new Error("Authentication Error");
      }

      // Fetch the task list with the provided ID
      const todo = await db
        .collection("ToDo")
        .findOne({ _id: new ObjectId(String(id)) });

      // Check if task list exists
      if (!todo) {
        throw new Error("ToDo not found");
      }

      const taskList = await db
        .collection("TaskLists")
        .findOne({ _id: todo.taskListId });

      // Check if task list exists
      if (!taskList) {
        throw new Error("Task List not found");
      }

      // Verify that the user is part of the task list's userIds
      const isUserInList = taskList.userIds.some((userId) =>
        userId.equals(user._id),
      );

      if (!isUserInList) {
        throw new Error(
          "Authorization Error: You do not have access to this task list",
        );
      }

      const result = await db
        .collection("ToDo")
        .deleteOne({ _id: new ObjectId(String(id)) });

      if (result.deletedCount === 0) {
        throw new Error("ToDo not found or not updated");
      }

      return {
        message: "deleted",
      };
    },
  },
  User: {
    id: ({ _id, id }) => _id || id,
  },
  ToDo: {
    id: ({ _id, id }) => _id || id,
    taskList: async ({ taskListId }, _, { db }) =>
      await db
        .collection("TaskLists")
        .findOne({ _id: new ObjectId(String(taskListId)) }),
  },
  TaskList: {
    id: ({ _id, id }) => _id || id,
    progress: async ({ _id }, _, { db }) => {
      const todos = await db
        .collection("ToDo")
        .find({ taskListId: new ObjectId(String(_id)) })
        .toArray();
      const completed = todos.filter((todo) => todo.isCompleted);

      if (todos.length === 0) {
        return 0;
      }
      return (100 * completed.length) / todos.length;
    },
    users: async ({ userIds }, _, { db }) => {
      // Use the $in operator to fetch all users with IDs in the userIds array
      return await db
        .collection("Users")
        .find({ _id: { $in: userIds } })
        .toArray();
    },
    todos: async ({ _id }, _, { db }) =>
      await db
        .collection("ToDo")
        .find({ taskListId: new ObjectId(String(_id)) })
        .toArray(),
  },
};

const client = new MongoClient(DB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Remove the client.close() in the finally block
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
