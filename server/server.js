const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(cors({
  origin:'http://localhost:4200'
}))



// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/BankServer',{
    useNewUrlParser:true , //to avoid warnings
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your MongoDB schema
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
  });
  
// Create a model based on the schema
const Items = mongoose.model('Items', itemSchema);

// Route for getting items
app.get('/api/items', async (req, res) => {
  try {
    const items = await Items.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for adding items
app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  console.log('Received POST request to /api/items');
  try {
    const createdItem = await Items.create(newItem);
    res.json({ message: 'Item added successfully', item: createdItem });
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});