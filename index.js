const express = require('express');
const connectDB = require('./config/database');
const authController = require('./controllers/authController');

const app = express();
const port = process.env.PORT || 3001;

// Connexion à MongoDB
connectDB();

// Configuration CORS pour permettre les requêtes depuis le frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware pour parser le JSON
app.use(express.json());

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API QA !' });
});

// Routes d'authentification
app.post('/login', authController.login);
app.post('/users', authController.createUser);
app.get('/users', authController.getUsers);

// Démarrer le serveur seulement si on n'est pas en mode test
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
  });
}

module.exports = app; 