/***********************************************************
               Account Page
               Shows Username, email and phonenumber
               Change password
 **********************************************************/
import React from 'react';
import { compose } from 'recompose';
import './index.css' ;

// add Nav from 04/15/2020
import Navigation from '../Navigation';

import PasswordChangeForm from '../PasswordChange';
import {
    AuthUserContext,
    WithAuthorization,
    WithEmailVerification,
} from '../Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <>
                <Navigation />
                {/* <hr /> */}
                <div className="account-page-wrapper">
                    <h1>Welcome {authUser.username}</h1>
                    <h2>{authUser.email}</h2>
                    <p>Reset password:</p>
                    <PasswordChangeForm />
                </div>
            </>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(AccountPage);
