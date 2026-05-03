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
      description:
        "Search RAG documents by query and summarize matching documents from the last given number of days.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The topic or text query to search and summarize.",
          },
          days: {
            type: "number",
            description:
              "Only summarize documents created in the last number of days. If not provided, use 30 days.",
          },
        },
        required: ["query"],
      },
    },
  },
];