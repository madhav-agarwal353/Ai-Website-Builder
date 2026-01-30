import express, { Request, Response } from 'express';
import 'dotenv/config'
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth.js';
const app = express();
const port = 3000;

const corsoptions = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
}

app.use(cors(corsoptions))
app.all('/api/auth/{*any}', toNodeHandler(auth));
app.get('/', (req: Request, res: Response) => {
    res.send('Sender is Live!');
})
app.listen(port, () => {
    console.log(port)
})
