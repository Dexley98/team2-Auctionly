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
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
// Just in case you need to route to stuff.
import * as ROUTES from '../../../constants/routes';

// add table to output firebase

class ReportLog extends Component {
  constructor(props){
    super(props);
    // this is a placeholder.
    this.state = {
      loading: false,
    };
  }

// goal: output every item with their bid list

componentDidMount(){
    this.setState({ loading: true });
    //let dbItemKey = this.props.match.params[0];

    this.props.firebase.db.ref('/items')
        .orderByChild("itemName")
        //.equalTo(dbItemKey)
        .on('value', snapshot => {
            const itemObject = snapshot.val();
            //console.log('item object ', itemObject["three"]);
           const keyList = Object.keys(itemObject);
          //  console.log('key ', keyList)
            //console.log('item to assign to state ', itemObject[keyList[0]])
            this.setState({
                item: itemObject,
                key: keyList,
                loading: false

            }); //console.log('key', this.state.key);
        });

//****************************************************************************************
// Ok, so my goal here was to read the item ID's which are in keyList into the next databse refrence bellow to pull the bid list.
// keyList appears undefined in this part of the fucntion though.
// I have tired including it in componentDidMount, excluding it. changing loading to false and then back to true for the db ref
// binding the state of key and so much more.

  console.log('key', this.state.key);
  this.props.firebase.db.ref(`/items/${this.state.key}/bidList`)
              .on('value', snapshot => {
                //  const itemObject = snapshot.val();

                  this.setState({
                   loading:false

                  });
              });
  }





render(){
  return(
    <h1>
      This is the Report Log Page.
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
)(ReportLog);
