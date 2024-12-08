<a name="top"></a>

# News App

## Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Dependencies](#-dependencies)
- [Contacts](#-contacts)

## Overview

The News App is a full-stack application that provides users with the latest news stories from around the world in real-time. It aggregates articles from various news sources, allowing users to browse news by category, search for specific topics, and read detailed articles. Registered users can bookmark articles for later reading and receive personalized content.

## Features

- **Latest News Feed**: Stay updated with the most recent news articles globally.
- **Category Browsing**: Explore news articles grouped by categories like Business, Technology, Sports, Health, etc.
- **Infinite Scroll**: Seamlessly load more articles as you scroll down.
- **Search Functionality**: Search for articles by keywords or titles using the search bar.
- **User Authentication**: Secure sign-up and login system with email verification.
- **Bookmarking**: Logged-in users can bookmark articles to read later.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Installation

1. Clone the Repository

```
git clone https://github.com/FilipSantic/news-app.git
cd news-app
```

2. Backend Setup (Server)

Navigate to the server directory, install dependencies, and configure environment variables:

```
cd server
npm install
```

Create a .env file in the server directory with the following content:

```
.env file is sent through email for security reasons
```

Start the backend server:

```
npm start
```

3. Frontend Setup (Client)

Open a new terminal window, navigate to the client directory, and install dependencies:

```
cd client
npm install
```

Start the frontend development server:

```
npm start
```

## Dependencies

### Typescript

Enhanced code quality and maintainability in comparison to plain Javascript - used for frontend and backend.

1. Backend dependencies

### Axios

HTTP Request client which was used for communicating to News API service. Used mostly for easier transformation of JSON data.

### Bcrypt

Used for strong password protection because it creates unique salt to each password, and thus it's harder to crack. Widely trusted in the industry for password hashing.

### Colors

Personal preference to style console output. Used only for enhancing and readability, doesn't affect application logic.

### Cors

This package is used for preventing unauthorized domains from accessing server resources. If frontend and backend are hosted on different domains, then it's essential.

### Dotenv

Used for loading environment variables from .env file. Used for storing sensitive information for security reasons.

### Express

Node.js web framework used for simple process of building robust APIs and web applications. Used for HTTP requests, routing and middleware.

### JSON Web Token

Used for authentication and authorization tokens between client and server.

### Mongoose

Library for MongoDB and Node.js. Simplifies interaction with MongoDB (which is used as the database to this project) through CRUD operations.

### Morgan

Used for logging middleware with more details. Useful for monitoring API activity.

### Nodemailer

Used for easier email sending.

2. Frontend dependencies

### Axios

Used as HTTP client to backend server.

### Formik

Simplifies form management (used for sign in and sign up forms). Reduces the need of manual validation of input field.

### jwt-decode

Used for decoding JWT tokens for authentication and authorization. Extracts token and expiration time.

### React icons

Collection of icons used for better styling of the application. In this case, Font Awesome icons are used.

### React-Infinite-Scroll-Component

Latest News component is built using React-Infinite-Scroll-Component which helps automatically load additional content when user reaches the end of the current content.

### react-router-dom

Used for easier navigation through the application without reloading the page. Easier implementation of protected routes.

### Sass

Scripting language used for CSS extensions. Advanced features which are not available in vanilla CSS are used. Easier to manage and update. This is the part which could be even more simplified by reusing existing code.

### Yup

Schema builder for value parsing and validation, used together with Formik for easier management of input fields.

## Contacts

For any additional questions, feel free to contact me via email:

```
filip.santic.95@gmail.com
```

[Back to top](#top)
