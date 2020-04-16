import React from 'react';
import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
    <button type="button" style={{position:"relative", textAlign:'center'}}onClick={
        firebase.doSignOut
    }>
        Sign Out
  </button>
);

export default withFirebase(SignOutButton);