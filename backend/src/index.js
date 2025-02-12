require('dotenv').config();
const express = require('express');
const connectDB = require('./lib/db');
const cors = require('cors');
const booksRouter = require('./routes/books');  // Import the books route file
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use environment variable for Stripe secret key
const app = express();

// Connect to MongoDB
connectDB().catch(err => console.error('Failed to connect to MongoDB:', err));

const YOUR_DOMAIN = 'http://localhost:5173';

// Update the CORS configuration to allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.0.104:5173',
  // add any other origins you need
];

// Update CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

const PORT = process.env.PORT || 5001;

// Use the books router
app.use('/api/books', booksRouter);  // Mount the books router at '/api'

// Stripe-related routes
app.post('/create-checkout-session', async (req, res) => {
  console.log('Received request to /create-checkout-session');
  const { cartItems } = req.body; // Get cart items from request body
  console.log('Cart Items:', cartItems);
  
  try {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Invalid cart items provided.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'npr',
          product_data: {
            name: item.title,
            images: [item.imageUrl],
          },
          unit_amount: item.price * 100, // Stripe expects amount in cents
        },
        quantity: item.quantity,
      })),
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    // Return the session URL directly
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Ensure the backend server is running and accessible.
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});