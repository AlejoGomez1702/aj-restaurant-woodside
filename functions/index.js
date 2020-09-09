require('dotenv').config();

/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
// const express = require('express');
const stripe = require('stripe')(functions.config().stripe.secret);
const nodemailer = require('nodemailer');

// const app = express();

// Automatically allow cross-origin requests
// app.use(cors({ origin: true }));
 
/**
 * Pago con stripe.
 */
// exports.payWithStripe = functions.https.onRequest((request, response) => {
//     // Set your secret key: remember to change this to your live secret key in production
//     // See your keys here: https://dashboard.stripe.com/account/apikeys
//     // response.setHeader('Access-Control-Allow-Origin', '*');
//     /**********************************SOLUCIONAR CORS*************** */
//     let sendInfo = {
//         amount: 5000,
//         currency: 'usd',
//         source: 'tok_visa',
//         description: 'Payment of an order from the mobile application'
//         // source: request.body.token,
//     };

//     // let sendInfo = {
//     //     amount: 50,
//     //     currency: 'usd',
//     //     source: 'tok_visa',
//     //     description: 'Payment of an order from the mobile application'
//     //     // source: request.body.token,
//     // };

//     console.log('El body del request es**********: ');
//     console.log(request);

//     // eslint-disable-next-line promise/catch-or-return
//     stripe.charges.create(sendInfo).then((charge) => {
//         // asynchronously called
//         response.send(charge);
//     })
//     .catch(err =>{
//         console.log(err);
//     });

// });

/**
 * Envio de correos cada que se crea una nueva venta.
 */
exports.sendMail = functions.firestore.document('sales/{uid}').onCreate((snapshot, context) => {
    const sale = snapshot.data();

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });    

    // *********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE************//
    let msj = 'You’ve received the following order from ' + sale.user.names + ' '
                + sale.user.surnames + '\n';

    const productsList = sale.cart_list; // Listado de los productos 

    for (let i = 0; i < productsList.length; i++) 
    {
        const product = productsList[i];

        // if(product.type == 1)
        // {
            msj += product.quantity + 'X   ' + product.product.name + ' ===> ' + product.price_total + '\n';
            // Si el producto tiene observaciones.
            if(product.options.observations !== '')
            {
                msj += 'Observations:  ' + product.options.observations;
            }
        // }
    }

    // for(const product in productsList)
    // {
    //     msj += product.quantity + 'X   ' + 'product name' + ' = ' + product.price_total + '\n';
    //     // if(product.options.observations !== '')
    //     // {
    //     //     msj += 'Observations: ' + product.options.observations + '\n';
    //     // } 
    // }

    msj += 'Subtotal: ' + sale.subtotal + '\n';
    msj += 'Tax: ' + sale.tax_total + '\n';
    msj += 'Total: ' + sale.total + '\n';

    // *********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE************//

    var mailOptions = {
        from: 'La Perrada De Chalo',
        to: sale.user.email + ', perradachaloorders@gmail.com',
        subject: '[Prueba APP]Purchase completed successfully',
        text: msj,
        // template: 'index'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error){
            console.log(error);
            res.send(500, err.message);
        } else {
            console.log("Email sent");
            res.status(200).jsonp({message: 'Email Complete!'});
        }
    });


});


/**
 * Primero creo el pago en la base de datos y luego llamo la api de stripe.
 */
exports.payWithStripe = functions.firestore.document('payments/{uid}').onCreate((snapshot, context) => {
    const payment = snapshot.data();

    let sendInfo = {
        amount: payment.amount,
        currency: 'usd',
        source: 'tok_visa',
        description: 'Payment of an order from the mobile application'
    };

    stripe.charges.create(sendInfo).then((charge) => {
        response.send(charge);
    }).catch((error) => {
        console.log(error);
    }); 

});