const express = require('express');
const cros = require('cors')
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const authRoute = require('./routes/auth');
const eventRoutes = require('./routes/event');
const collabRoutes = require('./routes/collab');
const qnaRoutes = require('./routes/qna');
const dotenv = require("dotenv");
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cros());
app.use(express.json());
// Routes
app.use('/api/auth', authRoute);
app.use('/api/event', eventRoutes);
app.use('/api/collab', collabRoutes);
app.use('/api/qna', qnaRoutes);
// app.use('/uploads', express.static('uploads'));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/',( req,res)=>{
    res.send('server is ready');
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port:${PORT}`));
