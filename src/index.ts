import createExpressServer from "./server";
import helmet from "helmet";
import permissionsPolicy from "permissions-policy";

const app = createExpressServer();
const port = process.env.PORT || 3000;

// Middlewares de sécurité avec Helmet
app.use(helmet());
app.use(
  permissionsPolicy({
    features: {
      fullscreen: ["self"],
      geolocation: ["none"],
      camera: ["none"],
      microphone: ["none"],
      payment: ["none"],
    },
  })
);

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

app.use(helmet.frameguard({ action: "deny" }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(helmet.noSniff());
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// Lancer le serveur API Gateway
app.listen(port, () => {
  console.log(`Serveur API Gateway démarré sur http://localhost:${port}`);
});
