/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Renamed to index.js 
 * Moved to /components/Admin/AddItemForm/index.js 
 * changed db reference to this.props.firebase.db (could move in an api to firebase.js)
 * 
 **************************************************************************************/

import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
// Just in case you need to route to stuff.
import * as ROUTES from '../../../constants/routes';


const INITIAL_STATE = {
    available: true,
    name: '',
    description: '',
    startPrice: '',
    buyItNow: '',
    imageUrl: '',
    bidList: {},

};

class AddItemForm extends Component {
  constructor(props) {
      super(props);

      this.state = { ...INITIAL_STATE };
    }

    ////componentDidMount() {
    ////    db.ref('/items').on('value', querySnapShot => {
    ////        let items = querySnapShot.val() ? querySnapShot.val() : {};
    ////        let itemsList = { ...items};
    ////        this.setState({
    ////            itemName,
    ////            itemDescription,
    ////            startPrice,
    ////            buyPrice,
    ////            itemImage,
    ////        });
    ////    });
    ////}

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };


    onSubmit = event => {

        const { available, name, description, startPrice, buyItNow, imageUrl } = this.state;
        const bidList = {};
        bidList["Initial"] = 0;

            this.props.firebase.db
                .ref('/items').push({
                    available,
                    name,
                    description,
                    startPrice,
                    buyItNow,
                    imageUrl,
                    bidList,
                })
                .then(() => {
                    // after item is created reset state of form back to empty fields
                    this.setState({ ...INITIAL_STATE });
                })
        event.preventDefault();
  }

  render() {
      const {
          name,
          description,
          startPrice,
          buyItNow,
          imageUrl,

          itemNameError,
          itemDescriptionError,
          startPriceError,
          buyPriceError,
      } = this.state;

      return (
          <form onSubmit={this.onSubmit}>
              <nav>
                  <ul>
                      <li>
                          <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                      </li>
                  </ul>
              </nav>

        <input
               name="name"
               placeholder="Item Name"
               value={name}
               onChange={this.onChange}
               type="text"
        />
        
        <br />
        <input
               name="description"
               placeholder="Item Description"
               value={description}
               onChange={this.onChange}
               type="text"
        />
        
        <br />
        <input
               name="startPrice"
               type="currecny"
               placeholder="Starting Bid Price"
               value={startPrice}
               onChange={this.onChange}
        />
        
        <br />
        <input
               name="buyItNow"
               type="currency"
               placeholder="Buy Now Price"
               value={buyItNow}
               onChange={this.onChange}
        />
         
         <br/>
        <br/>
        <input
               name="imageUrl"
               type="file"
               value={imageUrl}
               onChange={this.onChange}
        />
              <br />
              <button type="submit">Submit</button>

              
          </form>
          
    );
  }
}

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(AddItemForm);
