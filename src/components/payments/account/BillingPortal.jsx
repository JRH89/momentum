const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret);

admin.initializeApp();

exports.createBillingPortal = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to create a billing portal session.');
    }

    const uid = context.auth.uid;
    const user = await admin.firestore().collection('users').doc(uid).get();

    if (!user.exists) {
        throw new functions.https.HttpsError('not-found', 'User record not found.');
    }

    const customerId = user.data().stripeCustomerId;

    try {
        // Determine the return URL with fallback
        const baseReturnUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const returnUrl = `${baseReturnUrl}/Dashboard/account`;

        console.log("Base Return URL:", baseReturnUrl);
        console.log("Return URL:", returnUrl);

        // Create a billing portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return { url: session.url };
    } catch (error) {
        throw new functions.https.HttpsError('internal', 'Unable to create billing portal session.', error);
    }
});
