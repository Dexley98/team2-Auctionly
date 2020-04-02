/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Got rid of non-used packages.
 ***************************************************************************************/

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './components/App';

// provide a firebase instance to entire application
import Firebase, { FirebaseContext } from './components/Firebase';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root'),
);
serviceWorker.unregister();
