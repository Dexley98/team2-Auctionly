import FirebaseContext, { withFirebase } from './context'
import Firebase from './firebase';
import * as auth from './auth'

export default Firebase;

export { FirebaseContext, withFirebase, auth };