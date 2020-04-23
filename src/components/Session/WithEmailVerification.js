/*******************************************************************
           Send Email verification to user after sign up
 *******************************************************************/
import React from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const needsEmailVerification = authUser =>
    authUser &&
    !authUser.emailVerified &&
    authUser.providerData
        .map(provider => provider.providerId)
        .includes('password');

const withEmailVerification = Component => {
    class WithEmailVerification extends React.Component {
        constructor(props) {
            super(props);
            this.state = { isSent: false };
        }
        
        //send email verification
        onSendEmailVerification = () => {
            this.props.firebase
                .doSendEmailVerification()
                .then(() => this.setState({ isSent: true }));
        }

        render() {
            return (
                <AuthUserContext.Consumer>
                    {authUser =>
                        //checks if user needs to be verified
                        needsEmailVerification(authUser) ? (
                            <div>
                                {this.state.isSent ? (
                                    <p>
                                        E-Mail confirmation sent: Check you E-Mails (Spam
                                        folder included) for a confirmation E-Mail.
                                        Refresh this page once you confirmed your E-Mail.
                                    </p>
                                    ) : (
                                    <p>
                                        Verify your E-Mail: Check your E-Mails (Spam folder
                                            included) for a confirmation E-Mail or send
                                            another confirmation E-Mail.
                                    </p>
                                 )}
                                <button
                                    type="button"
                                    onClick={this.onSendEmailVerification}
                                    disabled={this.state.isSent}
                                >
                                    Send confirmation E-Mail
                                </button>
                            </div>
                            ) : (
                              <Component {...this.props} />
                            )
                    }
                </AuthUserContext.Consumer>
            );
        }
    }
    return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
