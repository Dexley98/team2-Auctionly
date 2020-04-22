const functions = require('firebase-functions');


var stripe = require('stripe')('sk_test_3ylFfZ8lM7Yv36r1FUXZlsoG00pWujDn1A');


exports.checkout = functions.https.onCall( async(data, context) => {
    const input = data.text.split("!")

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          name: input[0],
          description: input[2],
          images: [input[3]],
          amount: input[1] * 100,
          currency: 'usd',
          quantity: 1,
        }],
        success_url: 'https://auctionly-141e3.firebaseapp.com/home',
        cancel_url: 'https://auctionly-141e3.firebaseapp.com/home',
      });
    
      return session.id;

});


exports.helloWorld = functions.https.onCall((data, context) => {
  return "hello world!";
});
