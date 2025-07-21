const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const { 
  testUsers, 
  createTestUser, 
  cleanDatabase, 
  validateLoginResponse, 
  validateErrorResponse 
} = require('./helpers/testHelpers');
const userFixtures = require('./fixtures/users');

// Définir l'environnement de test
process.env.NODE_ENV = 'test';

const app = require('../index');

describe('Authentication Tests', () => {
  // Vérifier si on est en mode CI
  const isCI = process.env.CI === 'true';

  // Pas de nettoyage automatique pour éviter les conflits
  beforeEach(async () => {
    // Attendre un peu entre les tests
    await global.testUtils.wait(100);
  });

  // Fermer la connexion après tous les tests (seulement si pas en CI)
  afterAll(async () => {
    if (!isCI && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  });

  describe('POST /login', () => {
    if (!isCI) {
      describe('Login réussi', () => {
        it('devrait retourner un token pour des identifiants valides', async () => {
          // Arrange
          const userData = {
            email: global.testUtils.generateUniqueEmail('login'),
            password: 'password123'
          };
          await global.testUtils.createTestUser(userData);

          // Act
          const response = await request(app)
            .post('/login')
            .send(userData)
            .expect(200);

          // Assert
          validateLoginResponse(response, userData.email);
        });

        it('devrait fonctionner avec différents utilisateurs', async () => {
          // Arrange
          const users = [
            { email: global.testUtils.generateUniqueEmail('user1'), password: 'password1' },
            { email: global.testUtils.generateUniqueEmail('user2'), password: 'password2' },
            { email: global.testUtils.generateUniqueEmail('user3'), password: 'password3' }
          ];
          
          // Créer les utilisateurs un par un pour éviter les conflits
          for (const user of users) {
            await global.testUtils.createTestUser(user);
          }

          // Act & Assert pour chaque utilisateur
          for (const user of users) {
            const response = await request(app)
              .post('/login')
              .send(user)
              .expect(200);

            validateLoginResponse(response, user.email);
          }
        });
      });

      describe('Login échoué', () => {
        // Pas de beforeEach pour éviter les conflits

        it('devrait retourner 401 pour un mauvais mot de passe', async () => {
          // Arrange
          const userEmail = global.testUtils.generateUniqueEmail('wrongpass');
          const userData = { email: userEmail, password: 'correctpassword' };
          await global.testUtils.createTestUser(userData);
          const invalidCredentials = { email: userEmail, password: 'wrongpassword' };

          // Act
          const response = await request(app)
            .post('/login')
            .send(invalidCredentials)
            .expect(401);

          // Assert
          validateErrorResponse(response, 401, 'Mot de passe incorrect');
        });

        it('devrait retourner 404 pour un email inconnu', async () => {
          // Arrange
          const unknownUser = {
            email: global.testUtils.generateUniqueEmail('unknown'),
            password: 'password123'
          };

          // Act
          const response = await request(app)
            .post('/login')
            .send(unknownUser)
            .expect(404);

          // Assert
          validateErrorResponse(response, 404, 'Utilisateur non trouvé');
        });
      });

      describe('Validation des entrées', () => {
        it('devrait retourner 400 pour des champs manquants', async () => {
          // Arrange
          const missingFields = { email: 'test@example.com' }; // password manquant

          // Act
          const response = await request(app)
            .post('/login')
            .send(missingFields)
            .expect(400);

          // Assert
          validateErrorResponse(response, 400, 'Email et mot de passe sont requis');
        });

        it('devrait retourner 400 pour des champs vides', async () => {
          // Arrange
          const emptyFields = { email: '', password: '' };

          // Act
          const response = await request(app)
            .post('/login')
            .send(emptyFields)
            .expect(400);

          // Assert
          validateErrorResponse(response, 400, 'Email et mot de passe sont requis');
        });
      });
    } else {
      // Tests simplifiés pour le mode CI
      describe('POST /login (Mode CI)', () => {
        it('devrait retourner 400 pour des champs manquants', async () => {
          const missingFields = { email: 'test@example.com' }; // password manquant

          const response = await request(app)
            .post('/login')
            .send(missingFields)
            .expect(400);

          validateErrorResponse(response, 400, 'Email et mot de passe sont requis');
        });
      });
    }
  });
}); 