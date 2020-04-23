import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './SingleItem.css' ;

export default class SingleItem extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        // Single item render
        if(!this.props.cartItem && !this.props.dynamicItem){
            //If the link is active, display page with an active link
            if(this.props.activeLink){
                return(
                    <Link className="single-item-link" to={`item/${this.props.itemId}`}>
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
                    </Link>
                )
            }
            // Display page without link
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
                    <br />

                    <div className="dynamic-item-bid-forms">
                        <form className="bid-form" onSubmit={this.props.handleBidFunction}style={{textAlign:"center"}}>
                            <br />
                            <input type="number" step="5" min={Number(this.props.highestBid) + 5} id="bidInput" style={{textAlign:"center"}}placeholder="Amount, in $5 increments"required onChange={this.props.bidChangeHandlerFunction}></input>

                            <input type="submit" value="Bid" style={{width:"14%",textAlign:"center"}}/> 
                        </form>
                        <br />
                        <form className="buyout-form" onSubmit={this.props.handleBuyoutFunction} style={{textAlign:"center"}}>
                            <input type ="submit" value="Buyout" style={{width: '14%',textAlign:"center"}}/>
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
                            <button onClick = {this.props.checkoutHandlerFunction} style={{width:"100%"}}>Checkout</button>
                        }
                    </div>
                </div>
            )
        }
        
    }
}
