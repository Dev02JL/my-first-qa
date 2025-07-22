const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

// Utilisateurs de test à créer
const testUsers = [
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
  },
  {
    email: 'demo@test.com',
    password: 'demo123'
  }
];

async function createTestUsers() {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    console.log('🔗 Connexion à MongoDB établie');
    
    // Supprimer les utilisateurs existants (optionnel)
    await User.deleteMany({});
    console.log('🗑️  Base de données nettoyée');
    
    // Créer les utilisateurs de test
    const createdUsers = await User.create(testUsers);
    
    console.log('✅ Utilisateurs de test créés avec succès :');
    createdUsers.forEach(user => {
      console.log(`   📧 ${user.email} - Mot de passe: ${user.password}`);
    });
    
    console.log('\n🎯 Vous pouvez maintenant tester la connexion avec :');
    console.log('   Frontend: http://localhost:3000');
    console.log('   Backend: http://localhost:3001');
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('🔌 Connexion MongoDB fermée');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des utilisateurs:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
createTestUsers(); 