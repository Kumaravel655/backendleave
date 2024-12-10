const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');



const app = express();
app.use(cors());
app.use(bodyParser.json());

// Path to the JSON file for users
const usersFilePath = path.join(__dirname, 'users.json');

// Utility function to read users from JSON file
const readUsersFromFile = () => {
  if (!fs.existsSync(usersFilePath)) {
    return []; // Return an empty array if file doesn't exist
  }
  const data = fs.readFileSync(usersFilePath, 'utf-8');
  return JSON.parse(data || '[]');
};

// Utility function to write users to JSON file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
};

// Login API
app.post('/api/login', (req, res) => {
  console.log('Request body:', req.body);  // Check if the body is received correctly
  const { email, password } = req.body;
  
  // Simulate login logic
  if (email === 'test@example.com' && password === 'password123') {
    return res.status(200).json({ message: 'Login successful!' });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});
// Signup API
app.post('/api/signup', (req, res) => {
  const { email, password, confirmPassword } = req.body;
  const users = readUsersFromFile();

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  users.push({ email, password }); // Hash the password for security in production
  writeUsersToFile(users);

  res.status(201).json({ message: 'User registered successfully!' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
