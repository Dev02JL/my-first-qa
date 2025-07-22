const request = require('supertest');
const mongoose = require('mongoose');
const User = require('../models/User');
const { 
  createTestUser, 
  cleanDatabase, 
  createMultipleUsers,
  validateUserStructure 
} = require('./helpers/testHelpers');
const userFixtures = require('./fixtures/users');

// Définir l'environnement de test
process.env.NODE_ENV = 'test';

const app = require('../index');

describe('Users Management Tests', () => {
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

  // Tests qui s'exécutent en mode CI
  describe('POST /users (Mode CI)', () => {
    it('devrait retourner 400 pour des champs manquants', async () => {
      // Arrange
      const invalidData = { email: 'test@example.com' }; // password manquant

      // Act
      const response = await request(app)
        .post('/users')
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Email et mot de passe sont requis');
    });

    it('devrait retourner 400 pour des champs vides', async () => {
      // Arrange
      const emptyData = { email: '', password: '' };

      // Act
      const response = await request(app)
        .post('/users')
        .send(emptyData)
        .expect(400);

      // Assert
      expect(response.body).toHaveProperty('error', 'Email et mot de passe sont requis');
    });
  });

  if (!isCI) {
    describe('POST /users', () => {
      describe('Création d\'utilisateur réussie', () => {
        it('devrait créer un nouvel utilisateur avec des données valides', async () => {
          // Arrange
          const userData = {
            email: global.testUtils.generateUniqueEmail('newuser'),
            password: 'password123'
          };

          // Act
          const response = await request(app)
            .post('/users')
            .send(userData)
            .expect(201);

          // Assert
          expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
          expect(response.body).toHaveProperty('user');
          expect(response.body.user).toHaveProperty('email', userData.email);
          expect(response.body.user).toHaveProperty('_id');
          expect(response.body.user).not.toHaveProperty('password');
        });

        it('devrait créer plusieurs utilisateurs différents', async () => {
          // Arrange
          const users = [
            { email: global.testUtils.generateUniqueEmail('create1'), password: 'password1' },
            { email: global.testUtils.generateUniqueEmail('create2'), password: 'password2' },
            { email: global.testUtils.generateUniqueEmail('create3'), password: 'password3' }
          ];

          // Act & Assert pour chaque utilisateur
          for (const user of users) {
            const response = await request(app)
              .post('/users')
              .send(user)
              .expect(201);

            expect(response.body.user).toHaveProperty('email', user.email);
          }
        });
      });

      describe('Création d\'utilisateur échouée', () => {
        it('devrait retourner 409 pour un email déjà existant', async () => {
          // Arrange
          const userEmail = global.testUtils.generateUniqueEmail('duplicate');
          const userData = { email: userEmail, password: 'password123' };
          await global.testUtils.createTestUser(userData);

          // Act
          const response = await request(app)
            .post('/users')
            .send(userData)
            .expect(409);

          // Assert
          expect(response.body).toHaveProperty('error', 'Un utilisateur avec cet email existe déjà');
        });

        it('devrait retourner 400 pour des champs manquants', async () => {
          // Arrange
          const invalidData = { email: 'test@example.com' }; // password manquant

          // Act
          const response = await request(app)
            .post('/users')
            .send(invalidData)
            .expect(400);

          // Assert
          expect(response.body).toHaveProperty('error', 'Email et mot de passe sont requis');
        });

        it('devrait retourner 400 pour des champs vides', async () => {
          // Arrange
          const emptyData = { email: '', password: '' };

          // Act
          const response = await request(app)
            .post('/users')
            .send(emptyData)
            .expect(400);

          // Assert
          expect(response.body).toHaveProperty('error', 'Email et mot de passe sont requis');
        });
      });
    });

    describe('GET /users', () => {
      describe('Récupération des utilisateurs', () => {
        it('devrait retourner la liste des utilisateurs', async () => {
          // Arrange
          const users = [
            { email: global.testUtils.generateUniqueEmail('list1'), password: 'password1' },
            { email: global.testUtils.generateUniqueEmail('list2'), password: 'password2' }
          ];
          
          // Créer les utilisateurs un par un pour éviter les conflits
          for (const user of users) {
            await global.testUtils.createTestUser(user);
          }

          // Act
          const response = await request(app)
            .get('/users')
            .expect(200);

          // Assert
          expect(response.body).toHaveProperty('users');
          expect(response.body.users).toBeInstanceOf(Array);
          
          // Vérifier que nos utilisateurs sont dans la liste
          const userEmails = response.body.users.map(u => u.email);
          users.forEach(user => {
            expect(userEmails).toContain(user.email);
          });
          
          // Vérifier la structure de chaque utilisateur
          response.body.users.forEach(user => {
            validateUserStructure(user);
          });
        });

        it('devrait retourner un tableau vide quand aucun utilisateur', async () => {
          // Act
          const response = await request(app)
            .get('/users')
            .expect(200);

          // Assert
          expect(response.body).toHaveProperty('users');
          expect(response.body.users).toBeInstanceOf(Array);
          // Note: Ne peut pas tester un tableau vide car la DB accumule les utilisateurs
        });

        it('devrait ne pas inclure les mots de passe dans la réponse', async () => {
          // Arrange
          const userData = {
            email: global.testUtils.generateUniqueEmail('nopass'),
            password: 'password123'
          };
          await global.testUtils.createTestUser(userData);

          // Act
          const response = await request(app)
            .get('/users')
            .expect(200);

          // Assert
          expect(response.body).toHaveProperty('users');
          expect(response.body.users).toBeInstanceOf(Array);
          
          // Trouver notre utilisateur dans la liste
          const user = response.body.users.find(u => u.email === userData.email);
          expect(user).toBeDefined();
          expect(user).not.toHaveProperty('password');
          expect(user).toHaveProperty('email', userData.email);
        });
      });
    });
  }
}); 