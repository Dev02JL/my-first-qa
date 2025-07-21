const request = require('supertest');
const mongoose = require('mongoose');
const User = require('./models/User');
const app = require('./index');

describe('API Tests', () => {
  // Nettoyer la base de données avant chaque test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // Fermer la connexion après tous les tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // Test de la route de base
  describe('GET /', () => {
    it('devrait retourner un message de bienvenue', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Bienvenue sur l\'API QA !');
    });
  });

  // Tests pour la route /login
  describe('POST /login', () => {
    it('devrait retourner un token pour des identifiants valides', async () => {
      // Créer un utilisateur d'abord
      const userData = {
        email: 'user@example.com',
        password: 'password123'
      };
      
      await User.create(userData);

      const response = await request(app)
        .post('/login')
        .send(userData)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'user@example.com');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token).toMatch(/^token_/);
    });

    it('devrait retourner 401 pour un mauvais mot de passe', async () => {
      // Créer un utilisateur d'abord
      await User.create({
        email: 'user@example.com',
        password: 'password123'
      });

      const invalidCredentials = {
        email: 'user@example.com',
        password: 'mauvais_mot_de_passe'
      };

      const response = await request(app)
        .post('/login')
        .send(invalidCredentials)
        .expect(401);
      
      expect(response.body).toHaveProperty('error', 'Mot de passe incorrect');
    });

    it('devrait retourner 404 pour un email inconnu', async () => {
      const unknownEmail = {
        email: 'inconnu@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(unknownEmail)
        .expect(404);
      
      expect(response.body).toHaveProperty('error', 'Utilisateur non trouvé');
    });

    it('devrait retourner 400 pour des champs manquants', async () => {
      const missingFields = {
        email: 'user@example.com'
        // password manquant
      };

      const response = await request(app)
        .post('/login')
        .send(missingFields)
        .expect(400);
      
      expect(response.body).toHaveProperty('error', 'Email et mot de passe sont requis');
    });
  });

  // Tests pour la création d'utilisateurs
  describe('POST /users', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);
      
      expect(response.body).toHaveProperty('message', 'Utilisateur créé avec succès');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
    });

    it('devrait retourner 409 pour un email déjà existant', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123'
      };

      // Créer l'utilisateur une première fois
      await User.create(userData);

      // Essayer de créer le même utilisateur
      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(409);
      
      expect(response.body).toHaveProperty('error', 'Un utilisateur avec cet email existe déjà');
    });
  });

  // Tests pour la récupération des utilisateurs
  describe('GET /users', () => {
    it('devrait retourner la liste des utilisateurs', async () => {
      // Créer quelques utilisateurs
      await User.create([
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' }
      ]);

      const response = await request(app)
        .get('/users')
        .expect(200);
      
      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(2);
      expect(response.body.users[0]).toHaveProperty('email');
      expect(response.body.users[0]).not.toHaveProperty('password'); // Le mot de passe ne doit pas être retourné
    });
  });
}); 