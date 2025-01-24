import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config();
const createExpressServer = () => {
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour parser les JSON
app.use(express.json());

// Route principale pour vérifier l'état du gateway
app.get("/", (req: Request, res: Response) => {
  res.send("Bienvenue sur l'API Gateway");
});

// Proxy vers le service Catégories
app.use(
  "/categories",
  createProxyMiddleware({
    target: process.env.CATEGORIES_SERVICE_URL || "http://localhost:4001",
    changeOrigin: true,
  })
);

// Proxy vers le service Produits
app.use(
  "/products",
  createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL || "http://localhost:4002",
    changeOrigin: true,
  })
);

// Proxy vers le service Panier
app.use(
  "/cart",
  createProxyMiddleware({
    target: process.env.CART_SERVICE_URL || "http://localhost:4003",
    changeOrigin: true,
  })
);

// Proxy vers le service Commandes
app.use(
  "/orders",
  createProxyMiddleware({
    target: process.env.ORDERS_SERVICE_URL || "http://localhost:4004",
    changeOrigin: true,
  })
);

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});

return app;
};
export default createExpressServer;
