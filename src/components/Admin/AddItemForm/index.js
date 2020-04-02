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

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
// Just in case you need to route to stuff.
  //import * as ROUTES from '../../../constants/routes';

class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      available: true,
      bidList: {
        uid: 0,
      },
      buyItNow: 0,
      description: "",
      imageUrl: "",
      name: "",
      startPrice: 0,

      itemNameError: "",
      itemDescriptionError: "",
      startPriceError: "",
      buyPriceError: ""
    };

    this.change = this.change.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  change(e){
    console.log('e.target.name', e.target.name);
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(this.state);
  };

  validate = () => {
    let itemNameError = "";
    let itemDescriptionError = "";
    let startPriceError = "";
    let buyPriceError = "";


    /* I couldn't figure this out. 
    if (!this.setState.name.includes("[a-z]")) {
      itemNameError = "Invalid characters";
    } */ 

    if (itemNameError) {
      this.setState({ itemNameError });
      return false;
    }

    if (this.setState.startPrice.includes()) {
      startPriceError = "Only numeric value allowed";
    }

    if (startPriceError) {
      this.setState({ startPriceError });
      return false;
    }
  };

  onSubmit(e){
    e.preventDefault();
    // const isValid = this.validate();
    if (true) {
      // get a key for a new post.
      let newItemKey = this.props.firebase.db.ref().child("itemss").push().key;
      console.log('new item key', newItemKey);

      let item = {};
      item[newItemKey] = this.state;
      console.log(item);
      this.props.firebase.db.ref().set({item});
      // alert item add sucessful
    } else {
      console.log("invalid attempt");
    }
  };

  render() {
    return (
      <form>
        <input
          name="name"
          placeholder="Item Name"
          value={this.state.name}
          onChange={this.change}
        />
        <div style={{ color: "red" }}>{this.state.itemNameError}</div>
        <br />
        <input
          name="description"
          placeholder="Item Description"
          value={this.state.description}
          onChange={this.change}
        />
        <div style={{ color: "red" }}>{this.state.itemDescriptionError}</div>
        <br />
        <input
          name="startPrice"
          type="currency"
          placeholder="Starting Bid Price"
          value={this.state.startPrice}
          onChange={this.change}
        />
        <div style={{ color: "red" }}>{this.state.startPriceError}</div>
        <br />
        <input
          name="buyItNow"
          type="currency"
          placeholder="Buy Now Price"
          value={this.state.buyItNow}
          onChange={this.change}
        />
        <div style={{ color: "red" }}>{this.state.buyPriceError}</div>
        <br />
        <input
          name="imageUrl"
          type="file"
          value={this.state.imageUrl}
          onChange={this.change}
        />
        <br />
        <button onClick={this.onSubmit}>Submit</button>
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
