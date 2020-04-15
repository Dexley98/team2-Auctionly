import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

// for formating of higher order components
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
    <div>
        <h1>SignUp</h1>
        <SignUpForm />
        <RedirectLinkToSignIn />
    </div>
);

// use this to reset state after successful sign up.
const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    phoneNumber: '',
    isAdmin: false,
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.`;

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }


    onSubmit = event => {
        const { username, email, passwordOne, phoneNumber } = this.state;
        const roles = {};

        roles[ROLES.USER] = ROLES.USER;

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                // Create a user in your Firebase realtime database
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        phoneNumber,
                        email,
                        roles,
                    });
            })
            .then(() => {
                // send email to user based on provided email verification.
                return this.props.firebase.doSendEmailVerification();
            })
            .then(() => {
                // after user is created reset state of form back to empty fields
                this.setState({ ...INITIAL_STATE });
                // send user to home route after successfully authenticated.
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }

                this.setState({ error });
            });

        event.preventDefault();

    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    onChangeCheckbox = event => {
        this.setState({ [event.target.name]: event.target.checked });
    };

    render() {
        const {
            username,
            phoneNumber,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        /*******************************************************************************
        *  POTENTIAL REVISION: Maybe we move this function to a ../utils/file.js.
        * We should do this later toincrease security by inforcing stricter password rules.
        *******************************************************************************/
        // variables 
        var specialChar = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
        var number = /^[0-9]+$/;
        var letters = /^[A-Za-z]+$/;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '' ||
            username.includes(specialChar) ||
            !(passwordOne.includes(specialChar)) ||
            !(passwordOne.includes(number));


        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="username"
                    value={username}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Full Name"
                />
                <br />
                <input
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Phone Number"
                />
                <br />
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <br />
                <input
                    name="passwordOne"
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Confirm Password"
                />
                <br />
                <br />
                <button disabled={isInvalid} type="submit">
                    Sign Up
                    </button>

                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

const RedirectLinkToSignIn = () => (
    <p>
        <Link to={ROUTES.SIGN_IN}>Go back to sign in page</Link>
    </p>
);

// passes in router and firebase instance to SignUpFormBase
const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };
