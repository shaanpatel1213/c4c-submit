
# Partner Organizations Dashboard

## High-Level Overview
### This application is an interactive dashboard for managing partner organizations of Code4Community. It allows users to view, add, and delete partner information. The application includes several bonus features like searching for organizations, editing information, implementing authorization, and ensuring data persistence.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) (version 6.x or higher)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/shaanpatel1213/c4c-submit
   cd c4c-submit
   

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application
1. Start the application:
   ```sh
   npm run dev
   ```
2. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard.


## Design Decisions
- **Component-Based Architecture:** The application uses a component-based architecture to ensure modularity and reusability of components.
- **Data Persistence:** Data is saved to a local JSON file to ensure it persists even when the app is restarted.
- **Authorization Middleware:** A basic authorization middleware checks for a hardcoded token (Bearer secret-token) in the Authorization header to protect certain routes.
- **RESTful API Endpoints**: The server provides several RESTful endpoints:
    - **GET /partners**: Retrieves the list of all partner organizations.
    - **POST /partners**: Adds a new partner organization. This route is protected by the authorization middleware.
    - **PUT /partners/:id**: Updates an existing partner organization. This route is protected by the authorization middleware.
    - **DELETE /partners/:id**: Deletes a partner organization. This route is protected by the authorization middleware.
- **Data Saving Function**: A utility function `saveDataToFile` is used to write the partner data back to the JSON file whenever there are changes.
- **Search Functionality**: A GET route (`/search`) is implemented to allow searching for partners by name and active status.

## Reflection
### Learning and Improvements
This project was a valuable learning experience, particularly in integrating state management and I also learned a lot about REST APIs and how to connect a frontend UI to the backend. This included understanding the principles of RESTful design, setting up routes in Express, and making HTTP requests from the frontend to interact with the backend.

### Time Constraints
With more time, I would have focused on adding a user authentication feature, including a login page and storing hashed login credentials in a database. This would enhance the security of the application by ensuring that only authorized users can access and modify partner information. Additionally, storing partner data and user credentials in a database would improve data management and scalability.

### Challenges
Ensuring data persistence was a significant challenge. I chose to use a local JSON file for simplicity, but in a production environment, a more robust solution like Firebase or SQLite would be more appropriate.

### Bonus Features
- **Search Functionality:** Users can search for specific organizations by title or active status.
- **Edit Organization Information:** Users can directly edit an organization's title or description.
- **Authorization:** Implemented JWT-based authorization to control access to the application.
- **Data Persistence:** Data is saved to a local JSON file to ensure persistence across restarts.


If you have any questions or run into issues, please feel free to open an issue or contact me at [patel.shaan@northeastern.edu](mailto:patel.shaan@northeastern.edu).

Thank you for reviewing my project!


