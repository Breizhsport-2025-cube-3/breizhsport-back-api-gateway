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

  app.get("/", (req: Request, res: Response) => {
    res.send("API Gateway en ligne");
  });

  const services = [
    { route: "/categories", target: process.env.CATEGORIES_SERVICE_URL },
    { route: "/products", target: process.env.PRODUCT_SERVICE_URL },
  ];

  services.forEach(({ route, target }) => {
    if (target) {
      app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
    }
  });

  // Proxy pour le service Panier.
  app.use(
    "/cart",
    createProxyMiddleware({
      target: process.env.CART_SERVICE_URL,
      changeOrigin: true,
      pathRewrite: { "^/cart": "/cart" },
      onProxyReq: (proxyReq, req) => {
        if ((req.method === "POST" || req.method === "PUT" || req.method === "DELETE") && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader("Content-Type", "application/json");
          proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      onError: (err, req, res) => {
        console.error(`[API Gateway] ❌ Erreur proxy /cart : ${err.message}`);
        res.status(502).json({ message: "Erreur de proxy, impossible de joindre le microservice Cart." });
      },
    })
  );
  

  return app;
};

export default createExpressServer;
