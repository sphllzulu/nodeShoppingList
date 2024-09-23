const fs = require('fs');
const path = require('path');
const http = require('http');

const PORT = 3000;

const DATA_DIR = path.join(__dirname, 'data');
// a folder called data is created if it doesn't exist, and a shopping-list.json file is initialized to store the shopping list.
const SHOPPING_LIST_FILE = path.join(DATA_DIR, 'shopping-list.json');

// checks if a directory called data exists, if not it creates a directory using mkdirSync
function createDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
    console.log('Data directory created.');
  }
}

// this function checks to see if the json file exists, if not it will be created using writeFileSync
function createJSONFile() {
  if (!fs.existsSync(SHOPPING_LIST_FILE)) {
    fs.writeFileSync(SHOPPING_LIST_FILE, JSON.stringify([]));
    console.log('Shopping list JSON file created.');
  }
}
// this file reads the contents of the shopping-list.json file, and it is decoded from binary using utf8
function readJSONFile() {
  return JSON.parse(fs.readFileSync(SHOPPING_LIST_FILE, 'utf8'));
}

// The data is converted to a JSON string using JSON.stringify(data, null, 2). The null, 2 part is for formatting, making the JSON more readable by indenting with 2 spaces.
// the string is then written to the file with writeFileSync
function writeJSONFile(data) {
  fs.writeFileSync(SHOPPING_LIST_FILE, JSON.stringify(data, null, 2));
}

// API Helper functions
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function getRequestData(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

// CRUD operations
function getShoppingList(res) {
  const shoppingList = readJSONFile();
  sendResponse(res, 200, shoppingList);
}

function addShoppingListItem(req, res) {
  getRequestData(req)
    .then(item => {
      if (!item.name) {
        sendResponse(res, 400, { error: 'Item name is required' });
        return;
      }
      const shoppingList = readJSONFile();
      const newItem = { id: Date.now(), name: item.name, quantity: item.quantity || 1 };
      shoppingList.push(newItem);
      writeJSONFile(shoppingList);
      sendResponse(res, 201, newItem);
    })
    .catch(error => {
      sendResponse(res, 400, { error: 'Invalid JSON data' });
    });
}


function updateShoppingListItem(req, res) {
  const urlParts = req.url.split('/');
  const id = parseInt(urlParts[urlParts.length - 1]);
  
  getRequestData(req)
    .then(updatedItem => {
      const shoppingList = readJSONFile();
      const index = shoppingList.findIndex(item => item.id === id);
      if (index === -1) {
        sendResponse(res, 404, { error: 'Item not found' });
        return;
      }
      shoppingList[index] = { ...shoppingList[index], ...updatedItem };
      writeJSONFile(shoppingList);
      sendResponse(res, 200, shoppingList[index]);
    })
    .catch(error => {
      sendResponse(res, 400, { error: 'Invalid JSON data' });
    });
}

function deleteShoppingListItem(req, res) {
  const urlParts = req.url.split('/');
  const id = parseInt(urlParts[urlParts.length - 1]);
  
  const shoppingList = readJSONFile();
  const updatedList = shoppingList.filter(item => item.id !== id);
  
  if (updatedList.length === shoppingList.length) {
    sendResponse(res, 404, { error: 'Item not found' });
    return;
  }
  
  writeJSONFile(updatedList);
  sendResponse(res, 204);
}

// Create server and handle requests
const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/shopping-list' && method === 'GET') {
    getShoppingList(res);
  } else if (url === '/shopping-list' && method === 'POST') {
    addShoppingListItem(req, res);
  } else if (url.startsWith('/shopping-list/') && method === 'PUT') {
    updateShoppingListItem(req, res);
  } else if (url.startsWith('/shopping-list/') && method === 'DELETE') {
    deleteShoppingListItem(req, res);
  } else {
    sendResponse(res, 404, { error: 'Not Found' });
  }
});


createDirectory();
createJSONFile();

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});