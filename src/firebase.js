import firebase from 'firebase/app';
import 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyCBW7WI-4E5YbYZOpCy_OyhLa4psMERbnc',
  authDomain: 'foot-mints-on-the-proon-1.firebaseapp.com',
  databaseURL: 'https://foot-mints-on-the-proon-1.firebaseio.com',
  projectId: 'foot-mints-on-the-proon-1',
  storageBucket: 'foot-mints-on-the-proon-1.appspot.com',
  messagingSenderId: '507894112460',
  appId: '1:507894112460:web:c48082c52007820bbee269',
  measurementId: 'G-3LM69ZCFQG',
};

firebase.initializeApp(firebaseConfig);

// eslint-disable-next-line import/prefer-default-export
export const analytics = firebase.analytics();
