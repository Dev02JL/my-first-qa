const request = require('supertest');
const app = require('./index');

describe('API Tests', () => {
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
      const validCredentials = {
        email: 'user@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(validCredentials)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('email', 'user@example.com');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token).toMatch(/^token_/);
    });

    it('devrait retourner 401 pour un mauvais mot de passe', async () => {
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

    it('devrait fonctionner avec un autre utilisateur valide', async () => {
      const validCredentials = {
        email: 'admin@test.com',
        password: 'admin456'
      };

      const response = await request(app)
        .post('/login')
        .send(validCredentials)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', 'Connexion réussie');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'admin@test.com');
    });
  });
}); 