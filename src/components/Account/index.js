import React from 'react';
import { compose } from 'recompose';

import PasswordChangeForm from '../PasswordChange';
import {
    AuthUserContext,
    WithAuthorization,
    WithEmailVerification,
} from '../Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <h1>Welcome {authUser.username}</h1>
                <h2>{authUser.email}</h2>
                <br>
                </br>
                <br>
                </br>
                <p>Reset password:</p>
                <PasswordChangeForm />
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(AccountPage);