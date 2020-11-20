require('dotenv').config();

/* eslint-disable promise/always-return */
const functions = require('firebase-functions');
// const express = require('express');
const stripe = require('stripe')(functions.config().stripe.secret);
const nodemailer = require('nodemailer'); 

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

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

    msj += 'Subtotal: ' + sale.subtotal + '\n';
    msj += 'Tax: ' + sale.tax_total + '\n';
    msj += 'Total: ' + sale.total + '\n';

    // *********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE*********MESSAGE************//

    var mailOptions = {
        from: 'Pollos Mario Woodside',
        to: sale.user.email + ', pollosmariowoodside@gmail.com',
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
