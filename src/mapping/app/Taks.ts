import { ObjectId } from "mongodb";

// function getTaskList = async (_, { id }, { db, user }) => {
//   if (!user) {
//     throw new Error("Authentication Error");
//   }
//
//   // Fetch the task list with the provided ID
//   const taskList = await db
//     .collection("TaskLists")
//     .findOne({ _id: new ObjectId(String(id)) });
//
//   // Check if task list exists
//   if (!taskList) {
//     throw new Error("Task list not found");
//   }
//
//   // Verify that the user is part of the task list's userIds
//   const isUserInList = taskList.userIds.some((userId) =>
//     userId.equals(user._id),
//   );
//
//   if (!isUserInList) {
//     throw new Error(
//       "Authorization Error: You do not have access to this task list",
//     );
//   }
//
//   return taskList;
// },
