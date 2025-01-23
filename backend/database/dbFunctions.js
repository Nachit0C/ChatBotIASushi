import { ordersModel } from './db.js';

export const createOrder = async ({direccion, orden, precioFinal}) => {
    try{
        const newOrder = new ordersModel({
            direccion,
            orden,
            precioFinal
        });
        const res = await newOrder.save();
        return res;
    } catch (error) {
        console.error(error);
    }
}

export const getData = async () => {
    const data = await ordersModel.find();
    return data;
};