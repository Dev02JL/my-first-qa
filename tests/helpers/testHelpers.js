const User = require('../../models/User');

// Fixtures pour les tests
const testUsers = {
  validUser: {
    email: 'test@example.com',
    password: 'password123'
  },
  adminUser: {
    email: 'admin@test.com',
    password: 'admin456'
  },
  invalidUser: {
    email: 'invalid@example.com',
    password: 'wrongpassword'
  }
};

// Helper pour créer un utilisateur de test
const createTestUser = async (userData = testUsers.validUser) => {
  return await User.create(userData);
};

// Helper pour nettoyer la base de données
const cleanDatabase = async () => {
  try {
    await User.deleteMany({});
    // Attendre un peu pour s'assurer que la suppression est terminée
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.log('Erreur lors du nettoyage de la base de données:', error.message);
  }
};

// Helper pour créer plusieurs utilisateurs
const createMultipleUsers = async (users = [testUsers.validUser, testUsers.adminUser]) => {
  return await User.create(users);
};

// Helper pour valider la structure d'une réponse de login
const validateLoginResponse = (response, expectedEmail) => {
  expect(response.body).toHaveProperty('message', 'Connexion réussie');
  expect(response.body).toHaveProperty('token');
  expect(response.body).toHaveProperty('user');
  expect(response.body.user).toHaveProperty('email', expectedEmail);
  expect(typeof response.body.token).toBe('string');
  expect(response.body.token).toMatch(/^token_/);
};

// Helper pour valider une réponse d'erreur
const validateErrorResponse = (response, expectedStatus, expectedError) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('error', expectedError);
};

// Helper pour valider la structure d'un utilisateur (sans mot de passe)
const validateUserStructure = (user) => {
  expect(user).toHaveProperty('_id');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('createdAt');
  expect(user).not.toHaveProperty('password');
};

module.exports = {
  testUsers,
  createTestUser,
  cleanDatabase,
  createMultipleUsers,
  validateLoginResponse,
  validateErrorResponse,
  validateUserStructure
}; 