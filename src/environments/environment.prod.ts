import { Credentials } from './credentials';


export const environment = {
  production: true,
  firebase: {
    apiKey: Credentials.firebase.apiKey,
    authDomain: Credentials.firebase.authDomain,
    databaseURL: Credentials.firebase.databaseURL,
    projectId: Credentials.firebase.projectId,
    storageBucket: Credentials.firebase.storageBucket,
    messagingSenderId: Credentials.firebase.messagingSenderId,
    appId: Credentials.firebase.appId
  }
};
