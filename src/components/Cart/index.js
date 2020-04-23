
import React, { Component } from 'react';

// add nav Dom Exley 04/15/2020
import Navigation from '../Navigation';

import SingleItem from '../Item/SingleItem';

import { compose } from 'recompose';
import { WithAuthorization, WithEmailVerification } from '../Session';


// commented these out for warning in browser
//import { renderIntoDocument, act } from 'react-dom/test-utils';
//import CheckoutButton from '../Checkout/CheckoutButton.js'

// commented these out for warning in browser
//import { renderIntoDocument, act } from 'react-dom/test-utils';
//import CheckoutButton from '../Checkout/CheckoutButton.js'



class CartPage extends Component{

    constructor(props) {
        super(props);
       this.state = {
            loading: true,
            item: {},
            // key: "",
            bidValue: '',
            highestBid: 0,
            highestBidder: ""
        };
        
    }
    
    componentDidMount(){
        this.setState({ loading: true });
        this.props.firebase.items()
        .on('value', snapshot =>{
            const itemObject = snapshot.val();
            const keyList = Object.keys(itemObject);
            this.setState({
                item: itemObject,
                keys: keyList,
                loading: false
            });
        });
}
    render(){
        
        // Renders page if it's done loading
        if(this.state.loading === false)
        {
            let itemList = this.state.item;
            let funcArg = this.props.firebase.func;
            let activeBidList = [];
            let uid = this.props.firebase.auth.W;
            let key = ""
            let keyList = this.state.keys;
            let x = 0;
            // Construct list of items user has bid on
            for(x in keyList){
                if(itemList[keyList[x]]["bidList"][this.props.firebase.auth.W]){
                    activeBidList.push(itemList[keyList[x]])
            
                }
            }


            // Determine if user has highest bid
            x=0
            for(x in activeBidList)
            {
                let highestBid = 0;
                let currentUser = false;
                let bidList = activeBidList[x]["bidList"];
                let y = 0;
                for(y in bidList)
                {
                    if(bidList[y] > highestBid)
                    {
                        highestBid = bidList[y]
                        if(y===uid)
                        {
                            currentUser = " You have the current highest bid! ";
                        }
                        else
                        {
                            currentUser = undefined;
                        }
                    }
                }
                activeBidList[x]["currentUser"] = currentUser;
                activeBidList[x]["highestBid"] = highestBid;
                // Determine if checkout is available based on availability and the Current User
                if((activeBidList[x]["available"] === false) && (activeBidList[x]["currentUser"] === " You have the current highest bid! "))
                {
                    activeBidList[x]["checkoutAvailable"] =  true;

                }
            }

            // print list of cart items, calling CartItemList
            for(x in keyList) {
                return(
                    <div className="cart-page-wrapper">
                        <Navigation />
                        <CartItemList items={activeBidList} uid={uid} function={funcArg}></CartItemList>
                    </div>
                )
            }
        }
        // Page is not finished loading
        else
        {
            return(
                <div className="cart-page-wrapper">
                    <Navigation />
                    <hr />
                    <h2>
                    loading...
                    </h2>
                </div>
            )
        }
        
    }

    
}

// Class to print list of items in cart
class CartItemList extends Component{
    constructor(props){
        super(props);
        // let functions = CartPage.props
        this.handleClick = this.handleClick.bind(this);
    }
    // Function to handle checkout
    handleClick(stripe, item){
        // constructs formatted string to send to firebase functions
        const itemString = item.name + '!' + item.highestBid + '!' + item.description + "!" + item.imageUrl

        // Calls firebase function to create checkout session
        var addMessage = this.props.function.httpsCallable('checkout');
        addMessage({text: itemString}).then(function(result) {
            // Read result of the Cloud Function.
            stripe.redirectToCheckout({
                sessionId: result.data
            })
            // ...
        });
    }

    
    render(){
        // Grabs public key from firebase functions
        let getStripePubKey = this.props.function.httpsCallable('getStripePubKey');

        let stripe = undefined;
        getStripePubKey().then( (result) =>{
            stripe = window.Stripe(result.data);
        })

        // Returns cart page, using SingleItem class
        return(
            <div className="cart-item-list-wrapper">
                {this.props.items.map(item => (
                    <SingleItem
                    cartItem = {true}
                    userBid = {item.bidList[this.props.uid]}
                    highestBid = {item.highestBid}
                    isLeadingBidMssg = {item.currentUser}
                    itemId={item.id}
                    imageUrl={item.imageUrl}
                    itemName={item.name}
                    buyItNow={item.buyItNow}
                    startPrice={item.startPrice}
                    itemDescription={item.description}
                    isCheckoutAvailable = {item.checkoutAvailable}
                    checkoutHandlerFunction = {() => this.handleClick(stripe, item)} 
                    />
                ))}
            </div>
        )
    }
}

const condition = authUser => !!authUser;



export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(CartPage);
