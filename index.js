const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Base de données utilisateurs en mémoire (pour la démo)
const users = [
  {
    email: 'user@example.com',
    password: 'password123'
  },
  {
    email: 'admin@test.com',
    password: 'admin456'
  }
];

// Fonction pour générer un token simple (pour la démo)
function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API QA !' });
});

// Route de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email et mot de passe sont requis'
    });
  }
  
  // Recherche de l'utilisateur par email
  const user = users.find(u => u.email === email);
  
  // Email inconnu → 404
  if (!user) {
    return res.status(404).json({
      error: 'Utilisateur non trouvé'
    });
  }
  
  // Vérification du mot de passe
  if (user.password !== password) {
    // Mauvais mot de passe → 401
    return res.status(401).json({
      error: 'Mot de passe incorrect'
    });
  }
  
  // Email + mot de passe valides → retourne un token
  const token = generateToken();
  
  res.json({
    message: 'Connexion réussie',
    token: token,
    user: {
      email: user.email
    }
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

module.exports = app; 