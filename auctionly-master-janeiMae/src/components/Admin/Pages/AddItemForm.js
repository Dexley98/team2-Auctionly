import React from "react";
import { db } from "../../Firebase/firebase";

class AddItemForm extends React.Component {
  state = {
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
      db.ref("items").set({
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
export default AddItemForm;
