/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Added auctionData API
 **************************************************************************************/


import app from 'firebase/app';

// import package from Firebase API responsible for all the authentication.
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

//graps firebase keys from an .env file
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,

};

class Firebase {

    constructor() {
        app.initializeApp(config);

        // instatiate package from Firebase API responsible for all the authentication.
        this.auth = app.auth();
        this.db = app.database();
        this.storage = app.storage();
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.func = app.functions()

    }

    // Auth Api

    // Firebase API Endpoint creates user with email and password provided. 
    doCreateUserWithEmailAndPassword = (email, password) =>
        this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithPhoneNumber = (phoneNumber, appVerifier) =>
        this.auth.signInWithPhoneNumber(phoneNumber, appVerifier);

    
    // Firebase API Endpont logs user in with provided email and password. 
    doSignInWithEmailAndPassword = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
    
    //Firebase API Endpont sign in with Google
    doSignInWithGoogle = () =>
        this.auth.signInWithPopup(this.googleProvider);
    
    //Firebase API Endpont sends email verification after sign up using email and password
    doSendEmailVerification = () =>
        this.auth.currentUser.sendEmailVerification({
            url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
        });
    
    //Firebase API Endpont sign out
    doSignOut = () => this.auth.signOut();

    //Firebase API Endpont send password change email when forgot
    doPasswordReset = email =>
        this.auth.sendPasswordResetEmail(email);
    
    //Firebase API Endpont rest password when logged in
    doPasswordUpdate = password =>
        this.auth.currentUser.updatePassword(password);

    // *** User API ***
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // *** Item API ***
    item = uid => this.db.ref(`items/${uid}`);
    items = () => this.db.ref('items');
    func = () => this.functions();


    // *** Auction Data API ***
    auctionData = () => this.db.ref('auctionData');
   
    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
        this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.user(authUser.uid)
                    .once('value')
                    .then(snapshot => {
                        const dbUser = snapshot.val();

                        // default empty roles
                        if (!dbUser.roles) {
                            dbUser.roles = {};
                        }
                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser,
                        };

                        next(authUser);
                    });
            } else {
                fallback();
            }
        });


}

export default Firebase;
