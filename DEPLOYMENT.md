# Deployment Plan

This document describes the future deployment plan for the AI Learning project.

## Target Architecture

React Frontend
→ S3 + CloudFront
→ Node.js Backend
→ EC2
→ RDS PostgreSQL
→ CloudWatch Logs

## Current Status

The project currently runs locally.

Completed locally:

- OpenAI API integration
- Express backend endpoints
- PostgreSQL local database
- AI document summarization
- Chat with history
- React frontend
- Summaries list and search
- Production-quality backend improvements
- Environment-based configuration
- Logging and error handling

## Future AWS Deployment Plan

### Frontend

The React frontend is located in:

ai-frontend/

Build command:

npm run build

Build output:

ai-frontend/dist

Future deployment target:

S3 + CloudFront

### Backend

The backend will run on:

EC2

The backend should be started with PM2.

Example:

pm2 start server.js --name ai-backend

### Database

Local PostgreSQL will be replaced with:

Amazon RDS PostgreSQL

Production DATABASE_URL format:

postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/DB_NAME

### Logs

Local logs will later be replaced or forwarded to:

CloudWatch Logs

### CI/CD

Future GitHub Actions workflow:

Push to main
→ Build frontend
→ Upload frontend dist to S3
→ SSH into EC2
→ Pull latest backend code
→ Install dependencies
→ Restart backend with PM2

## Required Production Environment Variables

Backend:

OPENAI_API_KEY
DATABASE_URL
PORT
NODE_ENV
OPENAI_MODEL

Frontend:

VITE_API_BASE_URL

## Security Notes

- Never commit `.env`
- Never commit API keys
- Never commit database passwords
- Use GitHub Secrets for CI/CD
- Use AWS IAM permissions with least privilege
- Configure AWS Budget Alerts before deployment

## Estimated AWS Services

- S3
- CloudFront
- EC2
- RDS PostgreSQL
- CloudWatch
- GitHub Actions