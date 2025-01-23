import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getData } from './database/dbFunctions.js';
import pedidosRouter from './routes/pedidosRouter.js';

const PORT = 5000;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/', pedidosRouter);

app.get('/', (req, res)=> {
    res.json('Hello World');
});

app.get('/pedidos', (req, res)=> {
    getData().then(result => {
        res.send(result);
    }).catch(err => { console.log(err) });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}: http://localhost:${PORT}`);
});