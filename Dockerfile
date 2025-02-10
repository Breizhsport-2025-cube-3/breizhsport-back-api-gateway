# syntax=docker/dockerfile:1

# Étape 1 : Utiliser une image Node.js légère comme base
FROM node:22.11.0-alpine

# Étape 2 : Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Étape 3 : Copier les fichiers package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Étape 4 : Installer toutes les dépendances (y compris les devDependencies pour nodemon)
RUN npm install

# Étape 5 : Copier le reste des fichiers source dans le conteneur
COPY . .

# Étape 6 : Exposer le port sur lequel ton API Gateway fonctionne
EXPOSE 3000

# Étape 7 : Lancer l'application en mode développement avec nodemon
CMD ["npm", "run", "dev"]
