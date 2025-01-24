import createExpressServer from "./server";
import helmet from "helmet";
import permissionsPolicy from "permissions-policy";

const sequelize = require('./config/database'); 

const app = createExpressServer();
const port = process.env.PORT;

// Ajoutez Helmet pour les autres en-têtes de sécurité
app.use(helmet());

// Ajoutez la politique Permissions Policy
app.use(
  permissionsPolicy({
    features: {
      fullscreen: ['self'], // Corrigé : pas de guillemets
      geolocation: ['none'], // Désactive la géolocalisation
      camera: ['none'], // Désactive la caméra
      microphone: ['none'], // Désactive le microphone
      payment: ['none'], // Désactive les APIs de paiement
    },
  })
);

// Configuration des autres options Helmet
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "https:"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
    },
  })
);

app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(helmet.noSniff());
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Synchronisation de la base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée');
    app.listen(port, () => {
      console.log(`Serveur démarré sur http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error('Erreur lors de la synchronisation de la base de données :', err);
  });