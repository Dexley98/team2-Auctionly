import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const LandingPage = () => (
    <div className="landing-wrapper">
        <h1> Welcome to Auctionly </h1>  
        <SignInWithGoogle />
    </div>
);

class RedirectToSignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    
    onSubmit = event => {
        this.props.history.push(ROUTES.SIGN_IN);
        event.preventDefault();
    };

    render() {
        //const { email, password, error } = this.state;
        //const isInvalid = password === '' || email === '';

        return (
            <form className="landing-form" onSubmit={this.onSubmit}>
                <button>Sign In</button>
            </form>
        );
    }
}

const SignInWithGoogle = compose(
    withRouter,
    withFirebase,
)(RedirectToSignIn);

export default LandingPage;