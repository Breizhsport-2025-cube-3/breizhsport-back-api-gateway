import express, { Application, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const createExpressServer = (): Application => {
  const app: Application = express();

  app.use(cors({ origin: "http://localhost:4200", methods: ["GET", "POST", "PUT", "DELETE"] }));
  app.use(express.json());

  // Vérification de l'état de l'API Gateway
  app.get("/", (req: Request, res: Response) => {
    res.send("API Gateway en ligne");
  });

  // Liste des services à proxifier
  const services = [
    { route: "/categories", target: process.env.CATEGORIES_SERVICE_URL },
    { route: "/products", target: process.env.PRODUCT_SERVICE_URL },
    { route: "/orders", target: process.env.ORDERS_SERVICE_URL },
  ];

  services.forEach(({ route, target }) => {
    if (target) {
      app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
    }
  });

  // Proxy vers le service Panier (Cart)
  app.use(
    "/cart",
    createProxyMiddleware({
      target: process.env.CART_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { "^/cart": "/cart" },
      onProxyReq: (proxyReq, req) => {
        if (req.method === "POST" && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
    })
  );

  return app;
};

export default createExpressServer;
