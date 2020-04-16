import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class SingleItem extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        if(!this.props.cartItem){
            if(this.props.activeLink){
                return(
                    <div id={this.props.itemId} className="single-item-wrapper">
                        <Link to={`item/${this.props.itemId}`}>
                        <div className="item-image-wrapper">
                            <img className="item-image" src={this.props.imageUrl} width="200px" height = "200px" alt={this.props.itemName}/>
                        </div>
                        <div className="item-info-wrapper">
                            <h2>{this.props.itemName}</h2>
                            <p>Buy Now: ${parseInt(this.props.buyItNow, 10).toFixed(2)}</p>
                            <p>Starting Price: ${parseInt(this.props.startPrice, 10).toFixed(2)}</p>
                            <p>{this.props.itemDescription}</p>
                        </div>
                        </Link>
                    </div>
                )
            }
            else{
                return (
                    <div id={this.props.itemId} className="single-item-wrapper">
                        <div className="item-image-wrapper">
                            <img className="item-image" src={this.props.imageUrl} width="200px" height = "200px" alt={this.props.itemName}/>
                        </div>
                        <div className="item-info-wrapper">
                            <h2>{this.props.itemName}</h2>
                            <p>Buy Now: ${parseInt(this.props.buyItNow, 10).toFixed(2)}</p>
                            <p>Starting Price: ${parseInt(this.props.startPrice, 10).toFixed(2)}</p>
                            <p>{this.props.itemDescription}</p>
                        </div>
                    </div>
                )
            }
            
        }
        // if this is a cart page item.
        else{
            return(
                <div className="cart-item-wrapper">
                    <div className="cart-item-image-wrapper">
                        <img className="cart-item-image" src={this.props.imageUrl} width="200px" height="200px" alt={this.props.itemName} />
                    </div>
                    <div className="cart-item-info-wrapper">
                        <h2>{this.props.itemName}</h2>
                        <p>Your bid: ${this.props.userBid}</p>
                        <p>Current Leading Bid: ${this.props.highestBid}</p>
                        {this.props.isLeadingBidMssg !== undefined && 
                            <p>{this.props.isLeadingBidMssg}</p>
                        }
                        <p>{this.props.itemDescription}</p>
                        {this.props.isCheckoutAvailable &&
                            <button onClick = {this.props.clickHandlerFunction}>Checkout</button>
                        }
                    </div>
                </div>
            )
        }
        
    }
}
