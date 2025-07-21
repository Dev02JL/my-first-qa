// Configuration globale pour les tests
process.env.NODE_ENV = 'test';

// Augmenter le timeout pour les tests
jest.setTimeout(15000);

// Supprimer les logs de console pendant les tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  // Supprimer les logs pendant les tests
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  // Restaurer les logs après les tests
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Configuration globale pour les tests
global.testUtils = {
  // Attendre que les opérations asynchrones se terminent
  wait: (ms = 100) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Générer un email unique pour éviter les conflits
  generateUniqueEmail: (prefix = 'test') => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    return `${prefix}_${timestamp}_${random}@test.com`;
  },
  
  // Créer un utilisateur de test avec email unique
  createTestUser: async (userData = {}) => {
    const User = require('../models/User');
    
    try {
      // Générer un email unique si pas fourni
      const testUserData = {
        email: userData.email || global.testUtils.generateUniqueEmail(),
        password: userData.password || 'password123',
        ...userData
      };
      
      const user = await User.create(testUserData);
      // Attendre un peu pour s'assurer que l'utilisateur est bien créé
      await global.testUtils.wait(200);
      return user;
    } catch (error) {
      console.log('Erreur lors de la création de l\'utilisateur:', error.message);
      throw error;
    }
  }
}; 