import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import accountRoutes from "./routes/accountRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import cors from 'cors';
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { typeDefs, resolvers } from "./graphql/schema.js";
import { authMiddleware } from "./middleware/auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200'], // Allow Angular dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'apollo-require-preflight']
}));
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();
  app.use("/api/accounts", accountRoutes);
  app.use("/api/loans", loanRoutes);
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        authMiddleware(req, res, () => {});
        return { user: req.user };
      },
    })
  );

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      const PORT = process.env.PORT || 4000;
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
      });
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });

};
startServer();
