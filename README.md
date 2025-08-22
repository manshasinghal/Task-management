Task-Management Application
Welcome to the Task-Management Application! This is a full-stack project with a Node.js/Express backend and a React frontend. It's designed to help teams organize and manage tasks with different levels of access for administrators, managers, and standard users.

🚀 Getting Started
To get the application up and running on your local machine, follow these simple steps.

🖥️ Backend Setup (Node.js/Express)
Navigate to the backend directory in your terminal.
cd backend
Install the necessary dependencies.
npm install
Create a .env file in the backend directory and add your database and server configurations. Replace the placeholder values with your own.

Code snippet

PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="a_very_secure_secret_key"
Start the backend server.


npm start
The server will be live at http://localhost:5000.

🌐 Frontend Setup (React)
Open a new terminal and navigate to the frontend directory.



cd frontend
Install the frontend dependencies.



npm install
Create a .env file in the frontend folder to point the React app to your backend API.


REACT_APP_API_URL="http://localhost:5000/api"
Launch the React development server.



npm start
The application will automatically open in your default browser at http://localhost:3000.

🔑 Sample User Credentials
You can use these pre-defined accounts to log in and test the different functionalities and permissions for each user role.

Admin
Email: admin@example.com

Password: AdminPass123

Role: The Admin has full control over the application. They can manage all users, projects, and tasks.

Manager
Email: manager@example.com

Password: ManagerPass123

Role: A Manager can create and assign tasks, oversee project progress, and manage users within their assigned projects.

User
Email: user@example.com

Password: UserPass123

Role: A standard User can view and update tasks that have been assigned to them. They can also create personal tasks for themselves.
