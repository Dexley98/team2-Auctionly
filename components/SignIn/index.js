import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp/';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';



const SignInPage = () => (
    <div>
        <h1>SignIn</h1>
        <SignInForm />
        <SignInGoogle />
        <PasswordForgetLink />
        <SignUpLink />
    </div>
);

const INITIAL_STATE = {
    email: '',
    password: '',
    phoneNumber: '',
    error: null,
};

class SignInGoogleBase extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
        this.login = () => { this.props.firebase.auth.signInWithPopup(this.props.firebase.googleProvider) }
        this.logout = () => { this.props.firebase.auth.signOut() }
    }
    componentDidMount() {
        this.props.firebase.auth.onAuthStateChanged((user) => { this.setState({ user }) })
    }
    render() {
        let authButton = this.state.user ?
            <button onClick={this.logout}>Log Out</button> :
            <button onClick={this.login}>Sign In With Google</button>
        let uploader = this.state.user ?
            <preview /> :
            <h4>Log in to use photo-loader</h4>
        let userInfo = this.state.user ?
            <h5>Signed in using {this.state.user.email}</h5> :
            null
        return (
            <div>
                {userInfo}
                {authButton}
                {uploader}
            </div>
        )
    }
}


class SignInFromBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;
        const { phoneNumber} = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
                this.props.history.push(ROUTES.HOME);
            })
            .catch(error => {
                this.setState({ error });
            });
        this.props.firebase
            .doSignInWithPhoneNumber(phoneNumber)
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
        const { email, password, error, phoneNumber, appVerifier } = this.state;
        const isInvalid = password === '' || email === '';
        const noNumber = phoneNumber === '';
        return (
            <form onSubmit={this.onSubmit}>
                <input
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
                <input
                    name="password"
                    value={password}
                    onChange={this.onChange}
                    type="password"
                    placeholder="Password"
                />
                <button disabled={isInvalid} type="submit">
                    Sign In
                </button>
                <input
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={this.onChange}
                    type="text"
                    placeholder="PhoneNumber"
                />
                <button disabled={noNumber} type="submit">
                    Sign In With Phone Number
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

const SignInGoogle = compose(
    withRouter,
    withFirebase,
)(SignInGoogleBase);


export default SignInPage;
export { SignInForm, SignInGoogle };
