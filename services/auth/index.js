const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); 

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Auth service running on ${PORT}`));