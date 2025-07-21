const User = require('../models/User');

// Fonction pour générer un token simple (pour la démo)
function generateToken() {
  return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

class AuthService {
  async authenticateUser(email, password) {
    try {
      // Recherche de l'utilisateur par email
      const user = await User.findOne({ email: email.toLowerCase() });
      
      // Email inconnu → 404
      if (!user) {
        return {
          success: false,
          statusCode: 404,
          error: 'Utilisateur non trouvé'
        };
      }
      
      // Vérification du mot de passe
      if (user.password !== password) {
        // Mauvais mot de passe → 401
        return {
          success: false,
          statusCode: 401,
          error: 'Mot de passe incorrect'
        };
      }
      
      // Email + mot de passe valides → retourne un token
      const token = generateToken();
      
      return {
        success: true,
        statusCode: 200,
        data: {
          message: 'Connexion réussie',
          token: token,
          user: {
            email: user.email,
            _id: user._id
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        error: 'Erreur interne du serveur'
      };
    }
  }

  async createUser(email, password) {
    try {
      const user = new User({
        email: email.toLowerCase(),
        password: password
      });
      
      await user.save();
      
      return {
        success: true,
        data: {
          message: 'Utilisateur créé avec succès',
          user: {
            email: user.email,
            _id: user._id
          }
        }
      };
    } catch (error) {
      if (error.code === 11000) {
        return {
          success: false,
          statusCode: 409,
          error: 'Un utilisateur avec cet email existe déjà'
        };
      }
      
      return {
        success: false,
        statusCode: 500,
        error: 'Erreur lors de la création de l\'utilisateur'
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find({}, { password: 0 }); // Exclure le mot de passe
      return {
        success: true,
        data: users
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        error: 'Erreur lors de la récupération des utilisateurs'
      };
    }
  }
}

module.exports = new AuthService(); 