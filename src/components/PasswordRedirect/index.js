import React, {Component} from 'react';
import { compose } from 'recompose';

import {
    AuthUserContext,
    WithAuthorization,
    WithEmailVerification,
} from '../Session';

export class PasswordRedirect extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){
        setTimeout(() =>{
            console.log('redirecting...')
            this.props.firebase.doSignOut();
        }, 3000)
    }

    render() {
        return (
            <div>
                <h1>Your Password has been Changed!</h1>
                <p>You are being redirected to sign in now.</p>

            </div>
        )
    }
}




const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(PasswordRedirect);