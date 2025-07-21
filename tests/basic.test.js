const request = require('supertest');

// Définir l'environnement de test
process.env.NODE_ENV = 'test';

const app = require('../index');

describe('Basic Routes Tests', () => {
  describe('GET /', () => {
    it('devrait retourner un message de bienvenue', async () => {
      // Act
      const response = await request(app)
        .get('/')
        .expect(200);

      // Assert
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Bienvenue sur l\'API QA !');
    });

    it('devrait avoir le bon Content-Type', async () => {
      // Act
      const response = await request(app)
        .get('/')
        .expect(200);

      // Assert
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('devrait retourner une réponse JSON valide', async () => {
      // Act
      const response = await request(app)
        .get('/')
        .expect(200);

      // Assert
      expect(typeof response.body).toBe('object');
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });
}); 