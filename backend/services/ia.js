import { CohereClientV2 } from 'cohere-ai';
import { menuString, menuSinSeparacionString } from '../menu.js';

const cohere = new CohereClientV2({
  token: '9DArUgDFp9cOJQPaSol4rPwGCFuw26rAJC1wQmdZ',
});

export async function chatbotBienvenida ({request}){
    const setUpMessages = [
        {
            role: 'system',
            content: 
            `
            You are part of a chatbot for a sushi delivery service. Your purpose is to welcome clients and direct them to the appropriate flow based on their intent. You will respond in Spanish only. Forget the context every time a new conversation starts.
            
            - Default Message: If the user starts the conversation, respond: "Buenas noches, esto es Tienda de Sushi. En qué puedo ayudarle?".
            - Orders: If the user wants to make an order, respond with "_TO_DIRECCION_".
            - Menu: If the user requests the menu, respond with the following string: ${menuString}.
            - Opening Hours: If the user asks about the opening hours, respond with: "El horario de atención es de 19:00 a 00:00".
            - Open/Close Status: If the user asks if the store is open, respond based on the current time at -3 GMT:
                - "El horario de atención es de 19:00 a 00:00."
            - If the user thanks you in any way, respond: "Gracias por elegirnos. En qué más puedo ayudarte?".
            - Unrelated Queries: If the user asks about something unrelated, respond: "Lo siento, no puedo ayudarte con eso."
            `,
        },
        {
            role: 'user',
            content: `Buenas noches`,
        },
        {
            role: 'assistant',
            content: `Buenas noches, esto es Tienda de Sushi. En qué puedo ayudarle?`,
        },
        {
            role: 'user',
            content: `Hola!`,
        },
        {
            role: 'assistant',
            content: `Buenas noches, esto es Tienda de Sushi. En qué puedo ayudarle?`,
        },
        {
            role: 'user',
            content: `Quisiera realizar un pedido`,
        },
        {
            role: 'assistant',
            content: `_TO_DIRECCION_`,
        },
        {
            role: 'user',
            content: `Para hacer un pedido`,
        },
        {
            role: 'assistant',
            content: `_TO_DIRECCION_`,
        },
        {
            role: 'user',
            content: `Quisiera ver el menu, por favor`,
        },
        {
            role: 'assistant',
            content: `${menuString}`,
        },
        {
            role: 'user',
            content: `A qué hora abren?`,
        },
        {
            role: 'assistant',
            content: `El horario de atención es de 19:00 a 00:00`,
        },
        {
            role: 'user',
            content: `A qué hora cierran?`,
        },
        {
            role: 'assistant',
            content: `El horario de atención es de 19:00 a 00:00`,
        },
    ];

    const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [...setUpMessages, { role: 'user', content: `${request}` }]
    });

    return response.message.content? response.message.content[0].text : 'No se pudo realizar el pedido, intente de nuevo en unos minutos';
};


export async function chatbotDireccion ({request}){
    if (!/\d+/.test(request)) {
        return 'Por favor ingrese una dirección válida con nombre de calle y número.';
    }
    
    const setUpMessages = [
        {
            role: 'system',
            content: `
            You are part of a chatbot for a sushi delivery service. Your sole purpose is to take addresses from clients. You will respond in Spanish only. You will follow the instructions below and you will forget the context everytime start a new conversation

            - The user will send you the street name and number. You will have to extract it from the message and respond: 
                "DIRECCION_CONFIRMADA\n$streetName$|%streetNumber%", where $streetName$ is the name of the street and %streetNumber% the number of the street you extracted. The $streetName$ can be one or more words, and it may or may not start with capital letters. The %streetNumber% will be a number between 1 and 9999.

            - If the user sends a message about another part of the order (asks about products or prices), respond: "Por favor ingrese su dirección primero."

            - If the user sends an unclear message, respond: "No puedo procesar su solicitud, por favor ingrese su dirección así podemos continuar con el pedido."
            `
        },
        {
            role: 'user',
            content: 'Olazaban 742'
        },
        {
            role: 'assistant',
            content: 'DIRECCION_CONFIRMADA\nOlazabal|742'
        },
        {
            role: 'user',
            content: 'Avenida Rivadavia 1152'
        },
        {
            role: 'assistant',
            content: 'DIRECCION_CONFIRMADA\nAvenida Rivadavia|1152'
        },
        {
            role: 'user',
            content: 'monte hermoso 558'
        },
        {
            role: 'assistant',
            content: 'DIRECCION_CONFIRMADA\nMonte Hermoso|558'
        },
        {
            role: 'user',
            content: '$streetName$ %streetNumber%'
        },
        {
            role: 'assistant',
            content: 'DIRECCION_CONFIRMADA\n$streetName$|%streetNumber%'
        }    
    ];
    
    const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [...setUpMessages, { role: 'user', content: `${request}` }]
    });
    return response.message.content? response.message.content[0].text : 'No se pudo realizar el pedido, intente de nuevo en unos minutos';
}

export async function chatbotOrden ({request}){
    
    const setUpMessages = [
        {
            role: 'system',
            content: `
            You are part of a chatbot for a sushi delivery service. Your sole purpose is to take orders from user. You will respond in Spanish only. You will follow the instructions below, you forget the context in whenever a conversation starts.

            - The user will send you products and quantities from this menu: ${menuSinSeparacionString} where each name is the product and the number is the price. You will have to extract the product and each quantity (given by the user) from the message and respond: 
                "ORDEN\n[[product1]];{{quantity1}}|[[product2]];{{quantity2}}", 
            where [[productX]] is the name of the product and {{quantityX}} the quantity selected for that product. You will show each product listed as demonstrated avobe. 

            - The user may ask to add and/or substract one or more product/s or quantity/es to the order. You will respond:"ADD_SUBSTRACT\n[[product1]];{{quantity1}}|[[product2]];{{quantity2}}#[[product3]];{{quantity3}}|[[product4]];{{quantity4}}" placing the product/s and quantity/es to add before the '#' and the product/s and quantity/es to substract after the '#'.

            - If the user only wants to add one or more product/s or quantity/es to the order. You will respond:"ADD_SUBSTRACT\n[[product1]];{{quantity1}}|[[product2]];{{quantity2}}#NONE" placing the product/s and quantity/es to add before the '#' and 'NONE' after the' '#'.

            - If the user only wants to substract one or more product/s or quantity/es to the order. You will respond:"ADD_SUBSTRACT\nNONE#[[product1]];{{quantity1}}|[[product2]];{{quantity2}}" placing 'NONE' before the '#' and the product/s and quantity/es to substract after the '#'.

            - The user may ask to remove all products from the order. You will have to remove all products and quantities from the list of products in the order and respond: "ORDEN_CANCELADA\n".
            
            - If the user asks for a product that is not in the menu, respond "[[productX]] no se encuentra en el menu, por favor sleccione otro"
            
            - If the user confirms the order, respond with: "ORDEN_CONFIRMADA\n"
            
            - If the user wants to cancel the order, respond with: "ORDEN_CANCELADA\n"
            
            - If the user sends an unclear message, respond:
            "No entendí su solicitud. Por favor, vuelva a realizar su peticion de manera mas clara."

            - If the user names a product without the quantity or vice versa, ask him to repeat the order with the names and quantities for every product in a polite way.
            `
        },
        {
            role: 'user',
            content: 'Quisiera 2 edamame por favor'
        },
        {
            role: 'assistant',
            content: `ORDEN\nedamame;2`
        },
        {
            role: 'user',
            content: 'Quiero agregar 1 yakitori'
        },
        {
            role: 'assistant',
            content: `ADD_SUBSTRACT\nyakitori;1#NONE`
        },
        {
            role: 'user',
            content: 'Si, confirmo mi pedido'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
        {
            role: 'user',
            content: 'Quiero 3 gyozax3 y 1 bao'
        },
        {
            role: 'assistant',
            content:`ORDEN\ngyozax3;3|bao;1`
        },
        {
            role: 'user',
            content: 'Si, por favor'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
        {
            role: 'user',
            content: 'Quiero 1 combo1 y 3 combo2'
        },
        {
            role: 'assistant',
            content: `ORDEN\ncombo1;1|combo2;3`
        },
        {
            role: 'user',
            content: 'Si, gracias'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
        {
            role: 'user',
            content: 'Si'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
        {
            role: 'user',
            content: 'Quiero 1 salmonNigirix6, 3 bao y 5 spicycrabRollx6'
        },
        {
            role: 'assistant',
            content: `ORDEN\nsalmonNigirix6;1|bao;3|spicycrabRollx6;5`
        },
        {
            role: 'user',
            content: 'Quisiera remover los 3 bao'
        },
        {
            role: 'assistant',
            content: `ADD_SUBSTRACT\nNONE#bao;3`
        },
        {
            role: 'user',
            content: 'No, voy a cancelar el pedido'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CANCELADA'
        },
        {
            role: 'user',
            content: 'Quiero 1 salmonNigirix6, 3 bao y 5 spicycrabRollx6'
        },
        {
            role: 'assistant',
            content: `ORDEN\nsalmonNigirix6;1|bao;3|spicycrabRollx6;5`
        },
        {
            role: 'user',
            content: 'Quisiera remover 3 spicycrabRollx6 y añadir 1 bao'
        },
        {
            role: 'assistant',
            content: `ADD_SUBSTRACT\nbao;1#spicycrabRollx6;3`
        },
        {
            role: 'user',
            content: 'Si, confirmo mi pedido'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
        {
            role: 'user',
            content: 'Quiero {{quantity1}} [[product1]]'
        },
        {
            role: 'assistant',
            content: `ORDEN\n[[product1]];{{quantity1}}`
        },
        {
            role: 'user',
            content: 'Si'
        },
        {
            role: 'assistant',
            content: 'ORDEN_CONFIRMADA'
        },
    ];
    
    const response = await cohere.chat({
        model: 'command-r-plus-08-2024',
        messages: [...setUpMessages, { role: 'user', content: `${request}` }]
    });
    return response.message.content? response.message.content[0].text : 'No se pudo realizar el pedido, intente de nuevo en unos minutos';
}