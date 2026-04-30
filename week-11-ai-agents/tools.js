export const tools = [
  {
    type: "function",
    function: {
      name: "get_document_count",
      description: "Get the total number of RAG documents stored in the database.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_documents",
      description: "Search RAG documents by a text query.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The text query to search for in the documents.",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "summarize_documents",
      description: "Search RAG documents by query and summarize the matching documents.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic or text query to search and summarize.",
          },
        },
        required: ["query"],
      },
    },
  },
];