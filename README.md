# AI Learning

This repository documents my practical AI learning path.

## Week 1 — OpenAI API Hello World

In this week I created a basic Node.js project that connects to the OpenAI API and sends a first request to an AI model.

## What I did

- Created an OpenAI API key
- Stored the key safely in a `.env` file
- Installed the `openai` and `dotenv` packages
- Created a basic test file
- Sent a request to the OpenAI API
- Printed the AI response in the terminal

## How to run

1. Install dependencies:

npm install

2. Create a `.env` file in the project root:

OPENAI_API_KEY=your_api_key_here

3. Run the Week 1 test:

node .\week-01-openai-api\test.js

## Example output

AI is technology that lets computers do tasks that usually need human intelligence, like understanding language, recognizing images, and making decisions.

## Project structure

AiLearning/
├─ week-01-openai-api/
│  └─ test.js
├─ .env
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md

## Security notes

- The `.env` file contains the API key and must not be committed to GitHub.
- The `.gitignore` file should include:

.env
node_modules

## Current status

Week 1 basic API connection is working successfully.

## Completed

- API key created
- Environment variable configured
- Dependencies installed
- Test file created
- OpenAI API request sent successfully
- AI response received in the terminal

## Next steps

- Upload the project to GitHub
- Add a screenshot of the successful run
- Continue to Week 2: building a real Express API endpoint

## Week 2 — Express AI API Endpoint

In this week I built a real Express API endpoint that receives text, sends it to the OpenAI API, and returns a JSON response.

## What I built

- Express server running on port 3000
- GET `/` health endpoint
- POST `/api/analyze` endpoint
- JSON request body support
- Input validation for empty text
- OpenAI API call from the backend
- JSON response with input, result, and tokens_used
- Basic error handling

## How to run Week 2

Start the server:

node .\week-02-express-api\server.js

Send a valid request from PowerShell:

$body = @{
  text = "AI can help developers build products faster."
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

Test validation with empty text:

$body = @{
  text = ""
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/analyze" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

Expected validation response:

{"error":"text is required"}

## Week 2 status

Completed:

- Installed Express
- Created `server.js`
- Built a basic Express server on port 3000
- Added POST `/api/analyze`
- Received JSON in the format `{ text: "..." }`
- Validated that text is not empty
- Sent text to OpenAI
- Returned JSON response
- Returned `tokens_used`
- Tested valid request
- Tested empty text error handling