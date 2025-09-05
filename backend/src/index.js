import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@as-integrations/express5';


dotenv.config();  

const app = express();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

const typeDefs = `
    type Query{
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello Banking App Backend!',
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const startServer = async () => {
    await server.start();
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(server)
    ); 

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
} 
startServer();