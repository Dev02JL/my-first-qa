const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    const { email, password } = req.body;
    
    // Vérification des champs requis
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe sont requis'
      });
    }
    
    // Appel du service d'authentification
    const result = await authService.authenticateUser(email, password);
    
    // Retour de la réponse appropriée
    return res.status(result.statusCode).json(
      result.success ? result.data : { error: result.error }
    );
  }

  async createUser(req, res) {
    const { email, password } = req.body;
    
    // Vérification des champs requis
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe sont requis'
      });
    }
    
    // Appel du service de création d'utilisateur
    const result = await authService.createUser(email, password);
    
    // Retour de la réponse appropriée
    return res.status(result.success ? 201 : result.statusCode).json(
      result.success ? result.data : { error: result.error }
    );
  }

  async getUsers(req, res) {
    // Appel du service pour récupérer tous les utilisateurs
    const result = await authService.getAllUsers();
    
    // Retour de la réponse appropriée
    return res.status(result.success ? 200 : result.statusCode).json(
      result.success ? { users: result.data } : { error: result.error }
    );
  }
}

module.exports = new AuthController(); 