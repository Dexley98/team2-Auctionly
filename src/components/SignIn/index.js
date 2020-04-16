import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import GoogleButton from 'react-google-button'
import PropTypes from 'prop-types';
import './index.scss'

const SignInPage = () => (
    <div className="sign-in-wrapper">
        <h1> Sign In</h1>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
        <SignInWithGoogle />
    </div>
);


const propTypes = {
    children: PropTypes.node.isRequired,
    contentCenter: PropTypes.bool
};

const defaultProps = {
    contentCenter: false
};

const Layout = ({ children, contentCenter }) => {
    return (
        <section>
            <header>
                <h1> or </h1>
            </header>
            <main className={contentCenter ? 'content-center' : ''}>{children}</main>
        </section>
    );
};

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

// use this to reset state after successful sign in
const INITIAL_STATE = {
    email: '',
    password: '',
    phoneNumber: '',
    error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = " An account with an E-Mail address to this social account already exists.";


class SignInWithGoogleBase extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    onSubmit = event => {

        event.preventDefault();

        const roles = {};
        roles[ROLES.USER] = ROLES.USER;

        this.props.firebase
            .doSignInWithGoogle()
            .then(socialAuthUser => {
                // Create a user in your Firebase Realtime Database too
                return this.props.firebase
                    .user(socialAuthUser.user.uid)
                    .set({
                        username: socialAuthUser.user.displayName,
                        email: socialAuthUser.user.email,
                        roles
                    });
            })
            .then(() => {
                this.setState({ error: null });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
                    error.message = ERROR_MSG_ACCOUNT_EXISTS;
                }
                this.setState({ error });
            });

        
    };

    render() {
        const { error } = this.state;
        return (
            <Layout contentCenter={true}>
                <form onClick={this.onSubmit}>
                    <GoogleButton onClick={() => { }}/>
                    {error && <p>{error.message}</p>}
                </form>
            </Layout>
        );
        
    }
}

class SignInFromBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });
        
        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error} = this.state;
        const isInvalid = password === '' || email === '';
 
        return (
            <form className="sign-in-form" onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <br />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <br />
                <br />
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
      
                {error && <p>{error.message}</p>}
            </form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFromBase);

const SignInWithGoogle = compose(
    withRouter,
    withFirebase,
)(SignInWithGoogleBase);

export default SignInPage;

export { SignInForm, SignInWithGoogleBase };