# 🏥 Projet Healthcare

Ce projet est une application web axée sur le domaine de la santé, construite avec **NextJs**, gérée avec **npm** ou **bun**, et utilisant **PostgreSQL** comme base de données.

---

## 🚀 Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [npm](https://www.npmjs.com/) **ou** [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/) (v13 ou supérieur)
- Un éditeur de texte (recommandé : [VS Code](https://code.visualstudio.com/))

## 🌐 Accéder à l'application en ligne

L'application est disponible en ligne à l'adresse suivante :  
[https://health-care-five-sepia.vercel.app/](https://health-care-five-sepia.vercel.app/)



## ⚙️ Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/pasternak-karmel/healthcare.git
   ```
   cd healthcare
2. **Installer les dépendances avec npm :**
	 ```bash
   npm install
   ou
   bun install
   ```
3. **Configuration de l’environnement**
	```bash
	cp .env.example .env
	```

Modifiez les valeurs selon votre environnement, notamment la chaîne de connexion PostgreSQL (`DATABASE_URL`).
4. **🛠️ Génération du schéma de la base de données**
Pour générer les fichiers du schéma à partir des modèles :

```bash
npm run generate
npm run migrate
```
5.**🧪 Lancer le serveur de développement**
```bash
npm run dev
```
6.**🌐 Ouvrir dans le navigateur**
Ouvrez votre navigateur à l'adresse suivante ou similaire:  
[http://localhost:3000](http://localhost:3000)

## 🔐 Variables d'environnement à configurer

Vous devez définir les variables suivantes dans votre fichier `.env` pour faire fonctionner correctement l'application :

| Variable                      | Description                                            |
|-------------------------------|--------------------------------------------------------|
| `BETTER_AUTH_SECRET`           | Clé secrète pour l'authentification                    |
| `BETTER_AUTH_URL`              | URL de base de votre application                       |
| **Database**                   | Configuration de la base de données                    |
| `DB_HOST`                      | Hôte de la base de données (par défaut `localhost`)     |
| `DB_USER`                      | Utilisateur de la base de données                      |
| `DB_PASS`                      | Mot de passe de l'utilisateur de la base de données    |
| `DB_NAME`                      | Nom de la base de données                              |
| `DB_PORT`                      | Port de la base de données (par défaut `3306` pour MySQL ou `5432` pour PostgreSQL) |
| `DATABASE_URL`                 | URL de connexion à la base de données (PostgreSQL, MySQL) |
| **Redis**                       | Configuration de Redis                                 |
| `UPSTASH_REDIS_REST_URL`       | URL du service Redis (Upstash)                         |
| `UPSTASH_REDIS_REST_TOKEN`     | Jeton d'authentification pour Redis                    |
| **Google OAuth**               | Configuration OAuth Google                             |
| `AUTH_GOOGLE_SECRET`           | Clé secrète pour l'authentification OAuth Google       |
| `AUTH_GOOGLE_ID`               | ID de client pour l'authentification Google            |
| **Mailing/Notifications**      | Configuration pour l'envoi d'emails                    |
| `RESEND_API_KEY`               | Clé API pour Resend (service d'emailing)               |
| **Gemini API**                 | Configuration de l'API Gemini                          |
| `GEMINI_API_URL`               | URL de l'API Gemini                                    |

