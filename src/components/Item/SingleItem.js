import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SingleItem.css' ;

export default class SingleItem extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        if(!this.props.cartItem && !this.props.dynamicItem){
            if(this.props.activeLink){
                return(
                    <div id={this.props.itemId} className="single-item-wrapper">
                        <Link className="single-item-link" to={`item/${this.props.itemId}`}>
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
        // dynamic item 
        else if(!this.props.cartItem && this.props.dynamicItem){
            return(
                <div className="dynamic-item-wrapper">
                    <div className="dynamic-item-image-wrapper">
                        <img className="dynamic-item-image" src={this.props.imageUrl} width="200px" height="200px" alt={this.props.itemName} />
                    </div>
                    <div className="dynamic-item-info-wrapper">
                        <h2>{this.props.itemName}</h2>
                        <p>{this.props.itemDescription}</p>
                        <p>Current Minimum Bid: ${this.props.highestBid}</p>
                        <p>Buy it now price: ${this.props.buyItNow}</p>
                    </div>
                    <div className="dynamic-item-bid-forms">
                        <form className="bid-form" onSubmit={this.props.handleBidFunction}>
                            $<input type="number" step="5" min={Number(this.props.highestBid) + 5} id="bidInput" required onChange={this.props.bidChangeHandlerFunction}></input>
                            <input type="submit" value="Bid"/> 
                        </form>

                        <form className="buyout-form" onSubmit={this.props.handleBuyoutFunction}>
                            <input type ="submit" value="Buyout"/>
                        </form>
                    </div>
                </div>
            )
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
                            <button onClick = {this.props.checkoutHandlerFunction}>Checkout</button>
                        }
                    </div>
                </div>
            )
        }
        
    }
}
