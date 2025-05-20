Bitespeed Identity Reconciliation
This project is a backend service for Bitespeed's Identity Reconciliation Task. It provides an API to identify and consolidate contact information based on email and phone number, handling primary and secondary contacts with appropriate linking logic. The application is built using Node.js, TypeScript, Express, and Prisma, with a PostgreSQL database hosted on Neon. It is deployed on Render and accessible via a public endpoint.
Table of Contents

Project Overview
Features
Tech Stack
Getting Started
Prerequisites
Installation
Environment Variables
Database Setup
Running Locally


API Endpoint
Request Format
Response Format
Test Cases


Deployment
Documentation
Submission Details
License

Project Overview
The Bitespeed Identity Reconciliation service processes contact information (email and phone number) to:

Identify existing contacts in the database.
Create new contacts if no matches are found.
Link secondary contacts to primary contacts based on matching email or phone number.
Consolidate contact details, ensuring primary contacts are prioritized and duplicates are handled.

The service exposes a single POST /identify endpoint to handle these operations, returning a consolidated contact object with primary and secondary contact IDs, emails, and phone numbers.
Features

Contact Identification: Matches contacts by email or phone number.
Primary/Secondary Linking: Links new contacts as secondary to existing primary contacts or creates new primary contacts.
Consolidation Logic: Merges multiple primary contacts into one, converting others to secondary based on creation time.
Soft Deletion: Supports deletedAt for soft deletion of contacts.
Type-Safe Code: Built with TypeScript for robust type checking.
Scalable Database: Uses Neon PostgreSQL for reliable data storage.
Deployed Service: Hosted on Render for public access.

Tech Stack

Backend: Node.js, Express, TypeScript
Database: PostgreSQL (Neon)
ORM: Prisma
Deployment: Render
Tools: ts-node, Postman (for testing)

Getting Started
Prerequisites

Node.js: v20.18.0 or higher
npm: v10.x or higher
PostgreSQL: Neon account or local PostgreSQL instance
Git: For cloning the repository
Postman: For testing the API

Installation

Clone the Repository:
git clone https://github.com/ayush7662/BiteSpeed.git
cd BiteSpeed


Install Dependencies:
npm install



Environment Variables
Create a .env file in the project root with the following:
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
PORT=3000


Replace DATABASE_URL with your Neon PostgreSQL connection string (e.g., postgresql://neondb_owner:npg_dhXn4AuMW2RO@ep-yellow-firefly-a5djn58q-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require).
PORT defaults to 3000 unless specified.

Database Setup

Initialize Prisma:
npx prisma init


Ensure prisma/schema.prisma matches the provided schema (see Documentation).


Apply Migrations:
npx prisma migrate dev --name init


Creates the Contact table in the database.


Generate Prisma Client:
npx prisma generate



Running Locally

Start the Server:
npm run start


The server runs on http://localhost:3000.


Test the Endpoint:

Use Postman to send requests to http://localhost:3000/identify (see API Endpoint).



API Endpoint
The service exposes a single endpoint for contact identification and reconciliation.

URL: https://bitespeed-wl6u.onrender.com/identify (deployed) or http://localhost:3000/identify (local)
Method: POST
Content-Type: application/json

Request Format
{
  "email": "string | null",
  "phoneNumber": "string | null"
}


At least one of email or phoneNumber is required.
Both can be null or a string (e.g., "lorraine@hillvalley.edu", "123456").

Response Format
{
  "contact": {
    "primaryContatctId": number,
    "emails": string[],
    "phoneNumbers": string[],
    "secondaryContactIds": number[]
  }
}


primaryContatctId: ID of the primary contact.
emails: Array of unique emails, with the primary contact’s email first.
phoneNumbers: Array of unique phone numbers, with the primary contact’s phone number first.
secondaryContactIds: Array of secondary contact IDs linked to the primary contact.

Test Cases

New Contact:

Request:{
  "email": "lorraine@hillvalley.edu",
  "phoneNumber": "123456"
}


Response:{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}


Status: 200 OK


Existing Contact with New Email:

Request:{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}


Response:{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}


Status: 200 OK


Partial Input (Phone Only):

Request:{
  "email": null,
  "phoneNumber": "123456"
}


Response:{
  "contact": {
    "primaryContatctId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}


Status: 200 OK


Invalid Input:

Request:{
  "email": null,
  "phoneNumber": null
}


Response:{
  "error": "At least one of email or phoneNumber is required"
}


Status: 400 Bad Request



Deployment
The application is deployed on Render and accessible at:

Deployed URL: https://bitespeed-wl6u.onrender.com/identify

Deployment Steps

Push to GitHub:

Repository: https://github.com/ayush7662/BiteSpeed
All code, including README.md and DOCUMENTATION.md, is pushed to the main branch.


Render Configuration:

Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm run start
Environment Variables:DATABASE_URL=postgresql://neondb_owner:npg_dhXn4AuMW2RO@ep-yellow-firefly-a5djn58q-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
PORT=3000




Verification:

The endpoint is tested with Postman to ensure all test cases pass.
Database state is verified using Prisma Studio and psql.



Documentation
Additional details, including the database schema, code structure, and implementation logic, are available in:

DOCUMENTATION.md

Key highlights:

Database Schema: Defines the Contact model with fields like id, email, phoneNumber, linkedId, linkPrecedence, createdAt, updatedAt, and deletedAt.
Implementation: Uses Prisma for database operations, Express for routing, and TypeScript for type safety.
Error Handling: Validates input and handles database errors gracefully.

Submission Details
This project is submitted for the Bitespeed Identity Reconciliation Task:

GitHub Repository: https://github.com/ayush7662/BiteSpeed
Deployed Endpoint: https://bitespeed-wl6u.onrender.com/identify
Submission Form: Google Form

The application has been thoroughly tested locally and on Render, ensuring all test cases are met and the endpoint is publicly accessible.
License
This project is licensed under the ISC License.

