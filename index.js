const express = require('express');
const connectDB = require('./config/database');
const authController = require('./controllers/authController');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

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