import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccount.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telcofusion-6194b-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

export { db };
