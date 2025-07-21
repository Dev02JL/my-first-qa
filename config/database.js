const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Vérifier si on est en mode CI (GitHub Actions)
    if (process.env.CI) {
      console.log('Mode CI détecté - Connexion MongoDB ignorée');
      return;
    }

    const conn = await mongoose.connect('mongodb+srv://dev02:MotPasse123@cluster0.nicl2sv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error.message);
    
    // En mode développement, on peut continuer sans MongoDB
    if (process.env.NODE_ENV === 'development') {
      console.log('Mode développement - Continuation sans MongoDB');
      return;
    }
    
    // En production ou autres environnements, on arrête
    process.exit(1);
  }
};

module.exports = connectDB; 