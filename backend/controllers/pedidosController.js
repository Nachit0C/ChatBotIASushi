import { chatbotBienvenida, chatbotDireccion, chatbotOrden } from '../services/ia.js';
import { createOrder } from '../database/dbFunctions.js';
import { menuSinSeparacion } from '../menu.js';
import { string } from 'cohere-ai/core/schemas/index.js';

let newOrder = {
    direccion: "",
    orden: [],
    precioFinal: 0,
};
let status = "BIENVENIDA";

function updatePrecio() {
    const nuevoPrecioFinal = newOrder.orden.reduce((acc, { producto, cantidad }) => {
        const precio = menuSinSeparacion[producto] || 0;
        return acc + precio * cantidad;
    }, 0);

    newOrder.precioFinal = nuevoPrecioFinal;
}

function orderToAPI({action}) {
    let stringToReturn = "";
    if(action === "ORDEN" || action === "ADD_SUBSTRACT"){
        stringToReturn = `Su pedido actual es:\n`;
        newOrder.orden.forEach((orden) => {
            stringToReturn += `${orden.producto} x${orden.cantidad},\n`;
        });
        stringToReturn += `Precio parcial: $${newOrder.precioFinal}\nDesea agregar o quitar productos a su pedido? O desea confirmarlo?`;
    }
    if(action === "ORDEN_CONFIRMAD"){
        stringToReturn = `Pedido confirmado!\nSu pedido es:\n`;
        newOrder.orden.forEach((orden) => {
            stringToReturn += `${orden.producto} x${orden.cantidad}\n`;
        });
        stringToReturn += `Precio total: $${newOrder.precioFinal}\nSu pedido está en camino, llegará entre 30 y 45 minutos.`;
    }
    if(action === "ORDEN_CANCELAD"){
        stringToReturn = `Pedido cancelado.\nSi desea realizar un nuevo pedido, indique de nuevo su dirección por favor.`;
    }
    return stringToReturn;
}

async function orderHandler({responseOrden}){
    const action = responseOrden.slice(0, responseOrden.indexOf("\n"));
    const payload = responseOrden.slice(responseOrden.indexOf("\n") + 1);

    switch (action) {
        case "ORDEN":
            const ordenesArray = payload.split("|").map((orden) => {
                const [producto, cantidad] = orden.trim().split(";");
                return {
                    producto: producto.trim(),
                    cantidad: parseInt(cantidad, 10),
                };
            });
            
            const precioParcial = ordenesArray.reduce((acc, orden) => {
                const precio = menuSinSeparacion[orden.producto] || 0;
                return acc + precio * orden.cantidad;
            }, 0);
    
            newOrder = {
                ...newOrder,
                orden: ordenesArray,
                precioFinal: precioParcial,
            };
            console.log("return:", {response: responseOrden, pedido: newOrder, precioParcial});
            return{
                response: orderToAPI({action}),
                pedido: newOrder,
                precioParcial,
            };
            /*res.json({
                response: responseOrden,
                pedido: newOrder,
                precioParcial,
            });*/

        case "ADD_SUBSTRACT":
            const [addProducts, subtractProducts] = payload.split("#");

            const parseProducts = (productos) => {
                if (productos === "NONE") return [];
                return productos.split("|").map((item) => {
                    const [producto, cantidad] = item.split(";");
                    
                    return {
                    producto: producto.trim(),
                    cantidad: parseInt(cantidad, 10),
                    }
                });
            };
        
            const productsToAdd = parseProducts(addProducts);
            const productsToSubtract = parseProducts(subtractProducts);

            const addProductsToOrder = (productos, orden) => {
                productos.forEach(({ producto, cantidad }) => {
                    const index = orden.findIndex(item => item.producto === producto);
                    if (index !== -1) {
                        orden[index].cantidad += cantidad;
                    } else {
                        orden.push({ producto, cantidad });
                    }
                });
            };
            
            const subtractProductsFromOrder = (productos, orden) => {
                productos.forEach(({ producto, cantidad }) => {
                    const index = orden.findIndex(item => item.producto === producto);
                    if (index !== -1) {
                        orden[index].cantidad -= cantidad;
                        
                        if (orden[index].cantidad <= 0) {
                            orden.splice(index, 1);
                        }
                    }
                });
            };
            
            addProductsToOrder(productsToAdd, newOrder.orden);
            subtractProductsFromOrder(productsToSubtract, newOrder.orden);

            updatePrecio();

            console.log("return:", {response: responseOrden, pedido: newOrder});
            return{
                response: orderToAPI({action}),
                pedido: newOrder,
            };
            /*res.json({
                response: responseOrden,
                pedido: pedidoNuevo,
            });*/

        case "ORDEN_CONFIRMAD":
            // Guardar pedido en MongoDB
            createOrder(newOrder);
            status = 'BIENVENIDA'
            console.log("return:", {response: responseOrden, pedido: newOrder});
            return{ response: orderToAPI({action}), pedido: newOrder };

        case "ORDEN_CANCELAD":
            status = 'BIENVENIDA'
            newOrder = { direccion: "", orden: [], precioFinal: 0 };
            //res.json({ response: responseOrden, pedido: pedidoNuevo });
            console.log("return:", {response: responseOrden, pedido: newOrder});
            return {response: orderToAPI({action}), pedido: newOrder};

        default:
            console.log("return:", {response: responseOrden});
            return {response: responseOrden};
            //res.json({ response: responseOrden });
    }
}

function direccionHandler ({responseDireccion}){
    if( responseDireccion.slice(0, responseDireccion.indexOf("\n")) === "DIRECCION_CONFIRMADA"){
        status = "PEDIDO";
        newOrder = {}
        const direccionRecibida = responseDireccion.slice(responseDireccion.indexOf("\n")+1).replace("|", ", ");
        newOrder = {
            direccion: direccionRecibida,
            orden: [],
            precioFinal: 0
        };
        console.log("return:", {response: responseDireccion, pedido: newOrder});
        return{response: "Por favor, nombre los productos que quiere ordenar como aparecen en el menú con sus respectivas cantidades"};
    }
    console.log("return:", {response: responseDireccion});
    return {response: responseDireccion};
}

function bienvenidaHandler({responseBievenida}){
    if(responseBievenida === "_TO_DIRECCION_"){
        status = "DIRECCION";
        return{response: "Por favor ingrese el nombre de la calle y el número de su dirección."};
    }
    return {response: responseBievenida};
}

export const createPedido = async (req, res) => {
    const {message} = req.body;
    console.log("message:", message, "status:", status);
    try{
        switch(status){
            case "BIENVENIDA":
                const responseBievenida = await chatbotBienvenida({request: message});
                console.log("responseBievenida:", responseBievenida);
                res.json(bienvenidaHandler({responseBievenida}));
                break;

            case "DIRECCION":
                const responseDireccion = await chatbotDireccion({request: message});
                console.log("responseDireccion:", responseDireccion);
                res.json(direccionHandler({responseDireccion}));
                break;

            case "PEDIDO":
                const responseOrden = await chatbotOrden({request: message});
                console.log("responseOrden:", responseOrden);
                const handlerResponse = await orderHandler({responseOrden});
                console.log("handlerResponse:", handlerResponse);
                res.json(handlerResponse);
                break;
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};