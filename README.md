# DevVault

DevVault is a comprehensive full-stack web application designed for developers to share, discover, and collaborate on resources, tutorials, discussions, and more. It features a user-friendly interface for browsing and contributing content, along with an admin panel for managing the platform.

## Features

### User Features
- **User Authentication**: Sign up, sign in, and manage user profiles.
- **Resource Sharing**: Add, browse, and upvote resources categorized by topics.
- **Discussions**: Create and participate in community discussions with replies.
- **Tutorials**: Write and read tutorials contributed by users.
- **Feature Suggestions**: Suggest new features and vote on existing ones.
- **Issue Reporting**: Report bugs or issues and track their status.
- **Documentation Improvements**: Suggest improvements to documentation.
- **Bookmarks**: Save favorite resources and content.
- **Leaderboards**: View top contributors and active users.
- **Content Reporting**: Report inappropriate content for moderation.

### Admin Features
- **Dashboard**: Overview of platform statistics and analytics.
- **User Management**: View and manage user accounts.
- **Content Moderation**: Approve, reject, or manage resources, discussions, tutorials, etc.
- **Reports Management**: Handle content reports and issues.
- **Analytics**: Detailed insights into platform usage.

## Tech Stack

### Frontend
- **React**: Component-based UI library.
- **Vite**: Fast build tool and development server.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Router**: Client-side routing.
- **Lucide React**: Icon library.
- **Recharts**: Chart library for analytics.

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for APIs.
- **MongoDB**: NoSQL database with Mongoose ODM.
- **JWT**: JSON Web Tokens for authentication.
- **bcryptjs**: Password hashing.
- **CORS**: Cross-origin resource sharing.

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)
- npm or yarn

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/devvault.git
   cd devvault
   ```

2. **Install server dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**:
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables**:
   - Create a `.env` file in the `server` directory with the following:
     ```
     PORT=5300
     MONGO_URI=mongodb://localhost:27017/devvault  # or your MongoDB URI
     JWT_SECRET=your_jwt_secret_key
     ```
   - Adjust the MongoDB URI if using a cloud service.

5. **Seed the database (optional)**:
   - Run the seed script to populate initial data:
     ```bash
     cd server
     node seed.js
     ```

## Usage

### Running the Application

1. **Start the backend server**:
   ```bash
   cd server
   npm start  # or npm run dev for development
   ```
   The server will run on `http://localhost:5300`.

2. **Start the frontend client**:
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (default Vite port).

3. **Access the application**:
   - Open your browser and navigate to `http://localhost:5173` for the frontend.
   - The backend API is available at `http://localhost:5300/api`.

### API Endpoints

The backend provides RESTful APIs for various functionalities. Key endpoints include:

- **Authentication**: `/api/auth` (login, register, etc.)
- **Resources**: `/api/resources` (CRUD operations)
- **Discussions**: `/api/discussions`
- **Tutorials**: `/api/tutorials`
- **Feature Suggestions**: `/api/feature-suggestions`
- **Issues**: `/api/issues`
- **Admin**: `/api/admin` (protected routes)

Refer to the route files in `server/routes/` for detailed endpoints.

## Project Structure

```
devvault/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── api/           # API service functions
│   │   └── assets/        # Images and icons
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── server.js          # Main server file
│   ├── seed.js            # Database seeding script
│   └── package.json
└── README.md              # This file
```

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes tests where applicable.

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the maintainers.
