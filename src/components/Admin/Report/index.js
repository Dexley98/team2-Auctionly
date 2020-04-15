/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Renamed to index.js 
 * Moved to /components/Admin/Report/index.js
 * Added in Scaffolding to make db functions work
 **************************************************************************************/


import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';

// add table to output firebase

class WinnerLog extends Component {
  constructor(props){
    super(props);
    // this is a placeholder.
    this.state = {
      loading: false,
    };
  }

  render(){
    return(
      <h1>
        This is the Winner Log Page.
      </h1>
    )
  }
  
}

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(WinnerLog);