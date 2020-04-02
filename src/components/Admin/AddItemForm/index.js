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
import * as ROUTES from '../../../constants/routes';

class AddItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: "",
      itemDescription: "",
      startPrice: "",
      buyPrice: "",
      itemImage: "",

      itemNameError: "",
      itemDescriptionError: "",
      startPriceError: "",
      buyPriceError: ""
    };
  }

  change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  validate = () => {
    let itemNameError = "";
    let itemDescriptionError = "";
    let startPriceError = "";
    let buyPriceError = "";

    if (!this.setState.itemName.includes("[a-z]")) {
      itemNameError = "Invalid characters";
    }

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

  onSubmit = e => {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.props.firebase.db.ref("items").set({
        itemName: this.itemName.state,
        itemDescription: this.itemDescription.state,
        startPrice: this.startPrice.state,
        buyPrice: this.buyPrice.state,
        itemImage: this.itemImage.state
      });
      // alert item add sucessful
    } else {
      console.log("invalid attempt");
    }
  };

  render() {
    return (
      <form>
        <input
          name="itemName"
          placeholder="Item Name"
          value={this.state.itemName}
          onChange={e => this.change(e)}
        />
        <div style={{ color: "red" }}>{this.state.itemNameError}</div>
        <br />
        <input
          name="itemDescription"
          placeholder="Item Description"
          value={this.state.itemDescription}
          onChange={e => this.change(e)}
        />
        <div style={{ color: "red" }}>{this.state.itemDescriptionError}</div>
        <br />
        <input
          name="startPrice"
          type="currecny"
          placeholder="Starting Bid Price"
          value={this.state.startPrice}
          onChange={e => this.change(e)}
        />
        <div style={{ color: "red" }}>{this.state.startPriceError}</div>
        <br />
        <input
          name="buyPrice"
          type="currency"
          placeholder="Buy Now Price"
          value={this.state.buyPrice}
          onChange={e => this.change(e)}
        />
        <div style={{ color: "red" }}>{this.state.buyPriceError}</div>
        <br />
        <input
          name="itemImage"
          type="file"
          value={this.state.itemImage}
          onChange={e => this.change(e)}
        />
        <br />
        <button onClick={() => this.onSubmit()}>Submit</button>
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
