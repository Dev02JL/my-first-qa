# Projet QA - API Node.js avec MongoDB

**Développé par : Jean-Louis Nguyen**  
**Date : Juillet 2025**

## 🎯 **Présentation du projet**

### **Architecture :**
```
Frontend (QANuxt) ←→ Backend (QA) ←→ MongoDB Atlas
     Port: 3000         Port: 3001
```

### **Technologies :**
- **Backend** : Node.js + Express + MongoDB
- **Frontend** : Nuxt.js + Vue.js + Tailwind CSS
- **Tests** : Jest + Supertest
- **CI/CD** : GitHub Actions

### **Fonctionnalité principale :**
- **Route `/login`** : Authentification utilisateur
- **Interface** : Page de connexion avec formulaire email/password
- **Gestion des états** : Messages de succès et d'erreur

### **Types de tests implémentés :**
- ✅ **Tests unitaires** : Services et contrôleurs
- ✅ **Tests d'intégration** : API endpoints
- ✅ **Tests de validation** : Champs requis
- ✅ **Tests de gestion d'erreurs** : 401, 404, 400

---

Ce projet est une API REST avec authentification construite avec Node.js, Express, MongoDB, Jest et Supertest.

## 📁 **Structure des fichiers**

### **Routes et contrôleurs :**
- **Point d'entrée** : `index.js` - Configuration Express et routes principales
- **Route `/login`** : `controllers/authController.js` - Gestion de l'authentification
- **Route `/users`** : `controllers/authController.js` - Gestion des utilisateurs

### **Logique métier :**
- **Service d'authentification** : `services/authService.js` - Logique de connexion
- **Modèle utilisateur** : `models/User.js` - Schéma MongoDB

### **Tests :**
- **Tests d'authentification** : `tests/auth.test.js` - Tests de la route `/login`
- **Tests de gestion utilisateurs** : `tests/users.test.js` - Tests des routes `/users`
- **Tests de base** : `tests/basic.test.js` - Tests des routes de base
- **Configuration des tests** : `tests/setup.js` - Setup global des tests
- **Helpers de test** : `tests/helpers/testHelpers.js` - Fonctions utilitaires
- **Fixtures** : `tests/fixtures/users.js` - Données de test

### **Configuration :**
- **Base de données** : `config/database.js` - Connexion MongoDB
- **CI/CD** : `.github/workflows/ci.yml` - Pipeline GitHub Actions

### **Scripts utilitaires :**
- **Création d'utilisateurs de test** : `scripts/createTestUsers.js`

## 🚀 Fonctionnalités

- **Authentification** : Route `/login` avec gestion des tokens
- **Gestion des utilisateurs** : CRUD avec MongoDB
- **Tests automatisés** : Jest + Supertest
- **CI/CD** : GitHub Actions configuré
- **Configuration CORS** : Pour permettre les requêtes cross-origin

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB Atlas (ou MongoDB local)
- Git

## 🛠️ Installation

```bash
# Cloner le repository
git clone git@github.com:Dev02JL/my-first-qa.git
cd QA

# Installer les dépendances
npm install
```

## 🔧 Configuration

1. **Variables d'environnement** (optionnel) :
   ```bash
   # Créer un fichier .env
   MONGODB_URI=mongodb+srv://dev02:MotPasse123@cluster0.nicl2sv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   PORT=3001
   ```

## 🚀 Scripts disponibles

### Démarrer le serveur
```bash
npm start
```

### Démarrer en mode développement
```bash
npm run dev
```

### Lancer les tests
```bash
npm test
```

### Lancer les tests en mode watch
```bash
npm run test:watch
```

### Lancer les tests avec couverture
```bash
npm run test:coverage
```

### Créer les utilisateurs de test
```bash
npm run create-users
```

## 📡 Endpoints disponibles

### GET /
Retourne un message de bienvenue.

### POST /login
Authentification utilisateur.

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponses :**
- **200** : Connexion réussie avec token
- **401** : Mot de passe incorrect
- **404** : Utilisateur non trouvé
- **400** : Champs manquants

### POST /users
Créer un nouvel utilisateur.

**Corps de la requête :**
```json
{
  "email": "newuser@example.com",
  "password": "password123"
}
```

### GET /users
Récupérer la liste des utilisateurs (sans mots de passe).

## 🧪 Tests

Le projet inclut des tests automatisés couvrant :

- ✅ **Login réussi** : Retourne un token
- ✅ **Mot de passe incorrect** : Retourne 401
- ✅ **Utilisateur inconnu** : Retourne 404
- ✅ **Création d'utilisateur** : POST /users
- ✅ **Liste des utilisateurs** : GET /users

### Lancer les tests
```bash
npm test
```

### Cas testés

| Test | Description | Résultat attendu |
|------|-------------|------------------|
| **Login réussi** | Connexion avec identifiants valides | Token + message de succès |
| **Mot de passe incorrect** | Connexion avec mauvais mot de passe | Erreur 401 |
| **Utilisateur inconnu** | Connexion avec email inexistant | Erreur 404 |
| **Champs manquants** | Connexion sans email/password | Erreur 400 |
| **Création utilisateur** | POST /users avec données valides | Utilisateur créé |
| **Liste utilisateurs** | GET /users | Liste des utilisateurs |

## 🏗️ Architecture

```
QA/
├── .github/workflows/    # GitHub Actions
├── config/               # Configuration
│   └── database.js
├── controllers/          # Contrôleurs HTTP
│   └── authController.js
├── models/              # Modèles MongoDB
│   └── User.js
├── scripts/             # Scripts utilitaires
│   └── createTestUsers.js
├── services/            # Logique métier
│   └── authService.js
├── tests/               # Tests automatisés
│   ├── auth.test.js
│   ├── basic.test.js
│   ├── users.test.js
│   ├── fixtures/
│   ├── helpers/
│   └── setup.js
├── index.js             # Point d'entrée
└── package.json
```

## 🔄 CI/CD avec GitHub Actions

Le projet inclut un workflow GitHub Actions qui :

1. **Installation** : Installe les dépendances
2. **Exécution des tests** : Lance les tests sur Node.js 18 et 20
3. **Audit de sécurité** : Vérifie les vulnérabilités
4. **Linting** : Vérifie la qualité du code

### Workflow déclenché sur :
- Push sur `main` ou `master`
- Pull Request vers `main` ou `master`

## 📦 Déploiement

### 1. Pousser sur GitHub
```bash
git add .
git commit -m "Initial commit with CI/CD"
git push origin main
```

### 2. Vérifier GitHub Actions
- Aller sur votre repository GitHub
- Onglet "Actions"
- Vérifier que tous les jobs passent ✅

## 🔐 Sécurité

- Mots de passe stockés en clair (pour la démo)
- Tokens générés localement
- Validation des entrées utilisateur
- Gestion des erreurs appropriée
- Configuration CORS pour le frontend

## 📝 TODO

- [ ] Ajouter le hachage des mots de passe (bcrypt)
- [ ] Implémenter JWT pour les tokens
- [ ] Ajouter la validation des emails
- [ ] Implémenter la récupération de mot de passe
- [ ] Ajouter des tests de performance
- [ ] Configurer le déploiement automatique

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. 