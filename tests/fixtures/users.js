// Fixtures pour les utilisateurs de test
const userFixtures = {
  // Utilisateurs valides
  validUsers: [
    {
      email: 'user1@example.com',
      password: 'password123'
    },
    {
      email: 'user2@example.com',
      password: 'password456'
    },
    {
      email: 'admin@test.com',
      password: 'admin789'
    }
  ],

  // Utilisateurs invalides
  invalidUsers: [
    {
      email: 'invalid-email',
      password: 'password123'
    },
    {
      email: 'user@example.com',
      password: '' // Mot de passe vide
    },
    {
      email: '', // Email vide
      password: 'password123'
    }
  ],

  // Données de test pour login
  loginCredentials: {
    valid: {
      email: 'user1@example.com',
      password: 'password123'
    },
    invalidPassword: {
      email: 'user1@example.com',
      password: 'wrongpassword'
    },
    unknownUser: {
      email: 'unknown@example.com',
      password: 'password123'
    },
    missingFields: {
      email: 'user@example.com'
      // password manquant
    },
    emptyFields: {
      email: '',
      password: ''
    }
  },

  // Données pour création d'utilisateur
  createUserData: {
    valid: {
      email: 'newuser@example.com',
      password: 'newpassword123'
    },
    duplicateEmail: {
      email: 'existing@example.com',
      password: 'password123'
    },
    invalidEmail: {
      email: 'not-an-email',
      password: 'password123'
    }
  }
};

module.exports = userFixtures; 