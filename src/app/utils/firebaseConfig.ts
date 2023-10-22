import * as admin from 'firebase-admin';

const serviceAccount = require('../../serviceAccount.json');
try{
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://telcofusion-6194b-default-rtdb.firebaseio.com'
    });
}catch(e){
    console.log(e)
}

const db = admin.firestore();


export { db };
