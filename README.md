# Course-Connect
Course Connect is a task management and study buddy system designed for university students. This guide provides instructions for setting up the project, managing branches, merging updates, and testing.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Cloning the Repository

Each team member must clone the repo to thier local machine 

# Clone the repository

git clone https://github.com/CourseConnect-TUDublin/Course-Connect.git

# Navigate into the project directory 

cd Course-connect

# Checkout the development branch

git checkout dev

## Keeping Your Repo Updated

before working on any task, always pull the latest changes:

git pull origin dev --rebase

## Branching Strategy 
 
 We follow a structured branch workflow:

 # Main Branches

 main → Production-ready, stable code (protected)

dev → Integration branch (new features merged here before going to main)

# Feature Branches

Each team member works in separate feature branches based on their tasks

# Create a new feature branch

git checkout -b feature/your-feature-name

# Assigned Branches

Ian or Dylan -> feature/timetable-api
Ian or Dylan -> feature/timetable-ui
Toju -> feature/task-management

Push your feature branch to GitHub

"git push origin feature/your-feature-name"

## Weekly Integrating & Merging 

Each Friday, all features branches must be merged into dev

# Steps to Merge a feature Branch into dev

1. Ensure you're on dev and pull the latest changes:

"git checkout dev"
"git pull origin dev --rebase"

2. Switch to your feature branch:

"git checkout feature/your-feature-name"

3. Merge dev into your branch to avoid conflicts:

"git merge dev"

4. Resolve conflicts (if any), then push your    changes:

"git push origin feature/your-feature-name"

5. Create a Pull Request (PR) to merge into dev.

6. Review and merge into dev.

## Running the Project

# Frontend(Next.js)

npm install  # Install dependencies
npm run dev  # Start the Next.js server

The frontend runs on: http://localhost:3000

# Backend(Node.js + Express + MongoDB)

cd backend
npm install  # Install dependencies
npm run dev  # Start the backend server

The backend runs on: http://localhost:5000

## Testing Setupp

# Running Tests

npm test

If you don’t have tests yet, update package.json: "test": "echo \"No tests defined\" && exit 0"

# Linting
 
 To check for code errors:

 npm run lint

 To auto-fix issues:

 npm run lint --fix

 ## Branch Protection Rules

To maintain project stability, I have enforced branch protection rules on main and dev. This means:

All merges must go through a Pull Request.

At least one approval is required before merging.

You cannot push directly to main or dev.

All branches must be up to date before merging.

# How to Work With Protected Branches

1. Always create a feature branch before working (feature/your-feature-name).

2. After completing your work, create a Pull Request to merge into dev.

3. At least one team member must approve before merging.

4. Ensure you pull the latest dev updates before merging.

5. Merge your PR only after checks pass.

These rules ensure smooth collaboration and avoid broken code in important branches.

 ## Troubleshooting

 Git Push Rejected? Run git pull origin dev --rebase before pushing.

ESLint Errors? Run npm run lint --fix.

Backend Not Running? Check your .env file and MongoDB connection.

## Final Notes

tick to your assigned feature branch.

Merge into dev weekly.

Keep your repo updated before making changes.

Follow this guide for a smooth workflow!