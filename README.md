# Shopping List File Manager & REST API

This project implements a basic **File Manager** and a **REST API** for managing a shopping list using **Node.js**. The File Manager leverages Node.js' file system capabilities to store shopping list data in JSON format, while the REST API exposes CRUD operations to manage the shopping list via HTTP endpoints.

## Features

### File Manager
- **Create Directory**: A directory (`data/`) is created to store the JSON file.
- **Create JSON File**: Initializes an empty `shopping-list.json` file inside the directory to store shopping list items.
- **Read JSON File**: Reads and parses the shopping list data from the JSON file.
- **Write JSON File**: Updates the JSON file with new shopping list data.

### Shopping List API
This API provides CRUD operations for managing the shopping list.

| Method | Endpoint              | Description                            |
|--------|-----------------------|----------------------------------------|
| GET    | `/shopping-list`       | Fetch all items in the shopping list   |
| POST   | `/shopping-list`       | Add a new item to the shopping list    |
| PUT    | `/shopping-list/{id}`  | Update an existing item by ID          |
| DELETE | `/shopping-list/{id}`  | Delete an item from the list by ID     |

### Error Handling & Validation
- Handles missing or invalid data (e.g., when required fields are not provided).
- Sends appropriate HTTP status codes (e.g., `400` for invalid data, `404` for not found).

## Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/shopping-list-api.git
    cd shopping-list-api
    ```

2. Install dependencies (if any):
    ```bash
    npm install
    ```

### Running the Application
1. Start the server:
    ```bash
    node server.js
    ```

2. The server will run at `http://localhost:3000`.

## API Endpoints

### 1. Fetch All Shopping List Items (GET)
- **Endpoint**: `/shopping-list`
- **Description**: Retrieves the entire shopping list from the JSON file.
- **Response**:
  - `200 OK`: Returns the list of items.

### 2. Add a New Item to the Shopping List (POST)
- **Endpoint**: `/shopping-list`
- **Description**: Adds a new item to the shopping list.
- **Request Body** (JSON):
    ```json
    {
      "name": "Apples",
      "quantity": 5
    }
    ```
- **Response**:
  - `201 Created`: Returns the newly created item.
  - `400 Bad Request`: If the `name` field is missing.

### 3. Update a Shopping List Item (PUT)
- **Endpoint**: `/shopping-list/{id}`
- **Description**: Updates an existing item in the shopping list.
- **Request Body** (JSON):
    ```json
    {
      "name": "Oranges",
      "quantity": 10
    }
    ```
- **Response**:
  - `200 OK`: Returns the updated item.
  - `404 Not Found`: If the item with the specified ID does not exist.

### 4. Delete a Shopping List Item (DELETE)
- **Endpoint**: `/shopping-list/{id}`
- **Description**: Deletes a shopping list item by its ID.
- **Response**:
  - `204 No Content`: If the deletion was successful.
  - `404 Not Found`: If the item with the specified ID does not exist.

## Testing with Postman
You can use [Postman](https://www.postman.com/) to test the API:
1. **GET** `/shopping-list` to view all shopping list items.
2. **POST** `/shopping-list` with a JSON body to add a new item.
3. **PUT** `/shopping-list/{id}` with a JSON body to update an item by its ID.
4. **DELETE** `/shopping-list/{id}` to delete an item by its ID.

## Project Structure
```bash
├── data
│   └── shopping-list.json   
├── server.js                 
└── README.md                
