import * as admin from 'firebase-admin';

const serviceAccount = require('../../telcofusion-6194b-firebase-adminsdk-l8c4r-b8696d9ed3.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://telcofusion-6194b-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

export { db };
