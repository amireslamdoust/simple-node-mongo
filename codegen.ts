import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/mapping/**/*.graphql", // Your GraphQL schema file
  generates: {
    "src/lib/types.generated.ts": {
      plugins: [
        "typescript", // Generates TypeScript types
        "typescript-resolvers", // Generates resolver skeletons
        "typescript-mongodb", // For MongoDB types (if you're using MongoDB)
        "typescript-document-nodes", // For operations and document nodes
      ],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
