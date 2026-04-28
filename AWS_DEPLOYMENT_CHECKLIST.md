# AWS Deployment Checklist

This checklist describes the future AWS deployment steps for the AI Learning project.

## Target Architecture

React Frontend
→ S3
→ CloudFront
→ Node.js Backend on EC2
→ RDS PostgreSQL
→ CloudWatch Logs
→ GitHub Actions CI/CD

---

## 1. AWS Account Preparation

- Create or use an existing AWS account
- Choose region: `eu-central-1`
- Enable MFA on the root account
- Create an IAM user or role for deployment
- Configure least-privilege permissions
- Create an AWS Budget Alert
- Create a billing alarm or cost notification

---

## 2. Frontend Deployment — S3 + CloudFront

### S3

- Create S3 bucket for frontend hosting
- Bucket name example: `chani-ai-learning-frontend`
- Block public access depending on CloudFront setup
- Upload React build output from `ai-frontend/dist`
- Enable static website hosting only if needed
- Configure bucket policy or CloudFront OAC

### Build command

```bash
cd ai-frontend
npm run build
### Upload command

```bash
aws s3 sync dist/ s3://chani-ai-learning-frontend --delete
```

### CloudFront

- Create CloudFront distribution
- Origin points to S3 bucket
- Configure default root object: `index.html`
- Configure SPA fallback to `index.html`
- Add custom domain later if needed
- Add SSL certificate later if using a domain

---

## 3. Backend Deployment — EC2

### EC2 Instance

- Create EC2 instance
- Recommended for learning: `t3.micro` or similar small instance
- Use Amazon Linux or Ubuntu
- Open required inbound ports:
  - SSH: 22
  - Backend API: 3000/3003/3004 or one unified production port
  - HTTP: 80 if using reverse proxy
  - HTTPS: 443 if using SSL

### Server setup

- SSH into EC2
- Install Node.js 20
- Install Git
- Clone repository
- Install dependencies
- Create production `.env`
- Start backend with PM2

### Example commands

```bash
git clone https://github.com/chanirotenberg/ai-learning.git
cd ai-learning
npm install
npm install -g pm2
pm2 start week-04-production-quality/server.js --name ai-backend
pm2 save
pm2 startup
```

---

## 4. Database Deployment — RDS PostgreSQL

- Create RDS PostgreSQL instance
- Use small/free-tier compatible instance where possible
- Create database name, user, and password
- Configure security group to allow EC2 access
- Do not expose RDS publicly unless necessary
- Copy schema from local PostgreSQL
- Migrate or seed initial data
- Update backend `DATABASE_URL`

### Production DATABASE_URL format

```env
DATABASE_URL=postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/DB_NAME
```

---

## 5. Environment Variables

### Backend production env

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://USER:PASSWORD@RDS_ENDPOINT:5432/DB_NAME
PORT=3000
NODE_ENV=production
OPENAI_MODEL=gpt-4.1-mini
```

### Frontend production env

```env
VITE_API_BASE_URL=https://your-backend-domain
VITE_CHAT_API_BASE_URL=https://your-backend-domain
VITE_SUMMARIES_API_BASE_URL=https://your-backend-domain
```

Future improvement:

- Use one unified backend API base URL
- Serve all backend routes from one production Express server

---

## 6. GitHub Actions Deployment

### Required GitHub Secrets

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_FRONTEND_BUCKET`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`
- `OPENAI_API_KEY`
- `DATABASE_URL`

### Future workflow behavior

Push to `main`
→ Run CI
→ Build frontend
→ Upload `ai-frontend/dist` to S3
→ Invalidate CloudFront cache
→ SSH into EC2
→ Pull latest code
→ Install dependencies
→ Restart PM2 process

---

## 7. CloudWatch Logging

- Install or configure CloudWatch agent on EC2
- Forward backend logs to CloudWatch
- Create log group for backend
- Create alarms for errors
- Create alarms for high latency if needed
- Monitor API failures and usage

---

## 8. Security Checklist

- `.env` is not committed
- API keys are not committed
- Database passwords are not committed
- GitHub Secrets are used for CI/CD
- RDS is not publicly open unless required
- EC2 security group allows only necessary ports
- IAM permissions are limited
- AWS Budget Alerts are enabled
- CloudFront uses HTTPS

---

## 9. Production Testing Checklist

After deployment:

- Frontend URL opens successfully
- AI Analyzer works from production frontend
- Chat With History works from production frontend
- All Summaries page works from production frontend
- Backend health endpoint works
- PostgreSQL RDS connection works
- OpenAI API calls work
- Error handling works
- Logs are visible
- CI/CD deploy runs successfully
- No secrets appear in logs or GitHub

---

## 10. Estimated AWS Services

- S3
- CloudFront
- EC2
- RDS PostgreSQL
- CloudWatch
- IAM
- GitHub Actions

---

## Final Deployment Goal

A production-like full stack AI application:

- React frontend hosted on S3 + CloudFront
- Node.js backend running on EC2
- PostgreSQL database running on RDS
- Logs available in CloudWatch
- CI/CD automated with GitHub Actions