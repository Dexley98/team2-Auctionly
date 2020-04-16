import React from 'react';

const FirebaseContext = React.createContext(null);


// higher order component to simplify logic of adding in firebase instance to other components? 
export const withFirebase = Component => props => (
    <FirebaseContext.Consumer>
        {firebase => <Component {...props} firebase={firebase} />}
    </FirebaseContext.Consumer>
);

export default FirebaseContext;