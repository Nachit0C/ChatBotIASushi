import express from 'express';
import { createPedido } from '../controllers/pedidosController.js';
const pedidosRouter = express.Router();

pedidosRouter.post("/send-message", createPedido);

export default pedidosRouter;