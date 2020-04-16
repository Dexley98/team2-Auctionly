import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';

import { withFirebase } from '../Firebase';
const INITIAL_STATE = {
    passwordOne: '',
    passwordTwo: '',
    error: null,
    passwordChanged: null
};

class PasswordChangeForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }
    onSubmit = event => {
        event.preventDefault();
        const { passwordOne } = this.state;
        this.props.firebase
            .doPasswordUpdate(passwordOne)
            .then(() => {
                this.setState({ passwordChanged: true });
            })
            .catch(error => {
                this.setState({ error });
            });
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { passwordOne, passwordTwo, error } = this.state;
        const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

        if(this.state.passwordChanged === true) {
            return <Redirect to="/account/password-changed/" />
        }
        else{
            return (
                <div className="account-page-form-wrapper">
                    <form className="account-page-form" onSubmit={this.onSubmit}>
                        <input
                            name="passwordOne"
                            value={passwordOne}
                            onChange={this.onChange}
                            type="password"
                            placeholder="New Password"
                        />
                        <input
                            name="passwordTwo"
                            value={passwordTwo}
                            onChange={this.onChange}
                            type="password"
                            placeholder="Confirm New Password"
                        />
                        <button disabled={isInvalid} type="submit">
                            Reset My Password
                        </button>
                        {error && <p>{error.message}</p>}
                    </form>
                </div>
            ); 
        }
    }
}
export default withFirebase(PasswordChangeForm);