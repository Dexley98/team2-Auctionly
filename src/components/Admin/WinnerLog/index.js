/***************************************************************************************
 * Title: Refactoring Changes.
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Renamed to index.js
 * Moved to /components/Admin/WinnerLog/index.js
 * Added in Scaffolding to make db functions work.
 **************************************************************************************/


import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
// Just in case you need to route to stuff.
import * as ROUTES from '../../../constants/routes';

// add table to output firebase

class WinnerLog extends Component {
  constructor(props){
    super(props);
    // this is a placeholder.
    this.state = {
      loading: false,
    };
  }
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

// this should pull all the values
    console.log('key', this.state.key);
    this.props.firebase.db.ref(`/items/${this.state.key}/bidList`)
                .on('value', snapshot => {
                  //  const bidAmount = snapshot.val(); // uncomment this

                    this.setState({
                        loading: false,
                        //winners: 0,
                        // bids: bidAmount
                    });
                });
    }

    // const bidValue = (this.state.bids);
    // bidValue.sort(function(a, b){return a-b});  // sorts the values

    // for (int i = 0; i < 3; i++){
    // winners.concat(bidValue[i]); // pushes top three bids into array.
//  }


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
