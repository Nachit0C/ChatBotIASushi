import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/MongoDB1';

mongoose.connect(url)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));


const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const orderSchema = new mongoose.Schema({
    producto: { type: String, required: true },
    cantidad: { type: Number, required: true, min: 1 },
}, { _id: false });

const ordersSchema = new mongoose.Schema({
    numeroPedido: { type: Number },
    direccion: { type: String, required: true },
    orden: { type: [orderSchema], required: true }, // Aquí directamente utilizas productoSchema
    precioFinal: { type: Number, required: true },
}, { versionKey: false });

ordersSchema.plugin(AutoIncrement, { inc_field: 'numeroPedido', id: '_id' });

// Exportar el modelo
export const ordersModel = mongoose.model('Pedidos', ordersSchema);