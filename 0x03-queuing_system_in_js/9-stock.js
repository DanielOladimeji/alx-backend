const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const redisClient = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Create express app
const app = express();
app.use(express.json());

// Array of products
const listProducts = [
  {
    itemId: 1,
    itemName: 'Suitcase 250',
    price: 50,
    initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

// Function to get item by ID
function getItemById(id) {
  return listProducts.find((item) => item.itemId === id);
}

// Route to get list of products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Function to reserve stock by ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Function to get current reserved stock by ID
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return reservedStock ? parseInt(reservedStock) : 0;
}

// Route to get product details
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (item) {
    const reservedStock = await getCurrentReservedStockById(itemId);
    const currentQuantity = item.initialAvailableQuantity - reservedStock;
    res.json({
      itemId: item.itemId,
      itemName: item.itemName,
      price: item.price,
      initialAvailableQuantity: item.initialAvailableQuantity,
      currentQuantity: currentQuantity,
    });
  } else {
    res.json({ status: 'Product not found' });
  }
});

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);
  if (item) {
    const reservedStock = await getCurrentReservedStockById(itemId);
    if (reservedStock < item.initialAvailableQuantity) {
      await reserveStockById(itemId, reservedStock + 1);
      res.json({ status: 'Reservation confirmed', itemId: itemId });
    } else {
      res.json({ status: 'Not enough stock available', itemId: itemId });
    }
  } else {
    res.json({ status: 'Product not found' });
  }
});

// Start server
app.listen(1245, () => {
  console.log('Server is listening on port 1245');
});
