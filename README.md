# ExpenseTrackerApp

A full-stack application designed to track and manage expenses effectively. The project is split into two main folders: `backend` and `frontend`. It includes user authentication, expense management, a leaderboard, and reporting features.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Future Improvements](#future-improvements)

---

## Features
- **Authentication**: Secure signup and login functionality using password hashing with bcrypt.
- **Expense Management**: Add, update, and delete expenses.
- **Leaderboard**: Displays top spenders with pagination.
- **Report Generation**: Provides detailed expense reports.
- **Forgot Password**: A feature to securely reset user passwords.
- **Responsive Design**: User-friendly interface designed with HTML, CSS, and JavaScript.
- **Chatbot Integration**: A simple chatbot at the corner of the application to enhance user interaction.
- **Premium Features**: Integration with Razorpay to unlock premium functionalities.

---

## Folder Structure

### Main Folder: `ExpenseTrackerApp`

#### 1. `backend`
- **controller**: Contains logic for handling user and expense-related operations.
- **middleware**: Includes authentication and error-handling logic.
- **model**: Defines database models using Sequelize for ORM.
- **route**: Handles API routing for different functionalities.
- **util**: Includes utility functions (e.g., token management).

#### 2. `frontend`
- **HTML**: Includes `expense.html`, `login.html`, `signup.html`, `leaderboard.html`, and `report.html`.
- **CSS**: Styling for each of the HTML pages.
- **JavaScript**: Logic for handling user interactions and API calls for `expense.js`, `leaderboard.js`, etc.

---

## Tech Stack
### Frontend
- HTML, CSS, JavaScript

### Backend
- Node.js, Express.js
- MySQL (using Sequelize ORM)
- Bcrypt for password hashing
- Razorpay for premium features (planned)

---

## Setup and Installation

### Prerequisites
- Node.js and npm installed
- MySQL installed and running

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ExpenseTrackerApp
   ```

2. Install dependencies:
   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     No additional setup required (HTML, CSS, and JS files).

3. Set up the database:
   - Create a MySQL database.
   - Update the database configuration in `backend/config/config.json`.

4. Run the backend server:
   ```bash
   cd backend
   npm start
   ```

5. Open the frontend:
   - Use a live server to open `frontend/expense.html` in your browser.

---

## Usage
1. Signup for a new account or login with existing credentials.
2. Add, update, or delete expenses.
3. View the leaderboard to see the top spenders.
4. Generate reports for your expenses.
5. Use the 'Forgot Password' feature if needed.
6. Interact with the chatbot for a more engaging experience.
7. Unlock premium features using Razorpay.

---

## Future Improvements

- Enhance the design for better user experience.
- Optimize backend for scalability.
- Add comprehensive test cases.
- use the sendinblue and nodemailer to send the reset password mail to user mail account.

---
