import Firebase from './index';
import app from 'firebase/app';

export const getAuth = () => {
    return app.auth();
};

export const githubOAuth = () => {
    return new Firebase.firebase_.auth.GithubAuthProvider();
};

export const twitterOAuth = () => {
    return new Firebase.firebase_.auth.TwitterAuthProvider();
};

export const facebookOAuth = () => {
    return new Firebase.firebase_.auth.FacebookAuthProvider();
};

export const googleOAuth = () => {
    return new app.auth.GoogleAuthProvider();
};