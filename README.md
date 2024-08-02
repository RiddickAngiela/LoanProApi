# Loan App Backend

This is the backend for a loan application built using Node.js, Express, and Sequelize. The backend supports various functionalities including database management, API development, file handling, data validation, user management, and more.

## Table of Contents
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Additional Features](#additional-features)
- [Project Submission](#project-submission)

## Features
- **Database Connection**: Connects to a relational database (e.g., MySQL, PostgreSQL) with migration support.
- **Database Management**: Handles relations between tables and supports complex join queries.
- **API Development**: CRUD operations for records.
- **File Handling**: Utility for document, image, and file uploads with image resizing functionality.
- **Data Import**: Reads and validates data from Excel files.
- **Data Validation**: Validates required fields, phone numbers, email addresses, and file uploads.
- **User Management**: Self-registration, login, password encryption, JWT tokens, and admin roles.
- **Security**: Secures private endpoints with authorization.
- **Document Generation**: Creates PDFs from HTML with embedded images.
- **Excel Export**: Generates Excel files with app data.
- **Additional Features**: File zipping, charts in PDFs, and API documentation.

## Requirements
- **Database Connection**
  - Connect to a relational database.
  - Support migrations for schema changes.
- **Database Management**
  - Implement table relations.
  - Support complex join queries.
- **API Development**
  - CRUD operations: Create, Read, Update, Delete.
- **File Handling**
  - Upload documents, images, and files.
  - Resize images to specified dimensions.
- **Data Import**
  - Read data from Excel files.
  - Validate data before database insertion.
- **Data Validation**
  - Validate required fields, phone numbers, email addresses, and file uploads.
- **User Management**
  - Self-registration, login with email and password.
  - Modern password encryption.
  - JWT token generation.
  - Admin roles with permissions.
- **Security**
  - Secure private endpoints.
  - Allow access to login and registration APIs without authorization.
- **Document Generation**
  - Create PDFs from HTML with embedded images.
- **Excel Export**
  - Generate Excel files with app data.
- **Additional Features**
  - File zipping.
  - Charts in PDFs.
  - API documentation.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/loan-app-backend.git
   cd loan-app-backend


## File Structure
loan-app-backend/
├── src/
│   ├── controllers/       # Controllers for handling API requests
│   ├── middlewares/       # Middleware functions for authentication and authorization
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── uploads/           # File upload handling
│   ├── utilities/         # Utility functions
│   ├── views/             # Views for document generation
│   ├── app.js             # Main application file
│   ├── config.js          # Configuration settings
│   └── server.js          # Server setup and initialization
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project metadata and dependencies
├── README.md              # This README file
└── sequelize-config.js    # Sequelize configuration file
