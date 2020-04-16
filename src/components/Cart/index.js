
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
        // let dbItemKey = urlStringToItemName(this.props.match.params[0]);
        this.props.firebase.items()
        .on('value', snapshot =>{
            const itemObject = snapshot.val();
            const keyList = Object.keys(itemObject);
            // console.log('item to assign to state ', itemObject[keyList[0]])
            this.setState({
                item: itemObject,
                keys: keyList,
                loading: false
            });
        });
}


    render(){
        if(this.state.loading === false)
        {
            let itemList = this.state.item;
            let activeBidList = [];
            let uid = this.props.firebase.auth.W;
            let key = ""
            let keyList = this.state.keys;
            let x = 0;
            for(x in keyList){
                if(itemList[keyList[x]]["bidList"][this.props.firebase.auth.W]){
                    console.log(keyList[x] + " exists!")
                    activeBidList.push(itemList[keyList[x]])
            
                }
            }


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
                if((activeBidList[x]["available"] === false) && (activeBidList[x]["currentUser"] === " You have the current highest bid! "))
                {
                    console.log(activeBidList[x]);
                    activeBidList[x]["checkoutAvailable"] =  true;

                }
            }

            for(x in keyList) {
                console.log(keyList[x]);
                return(
                    <div className="cart-page-wrapper">
                        <Navigation />
                        <hr />
                        <CartItemList items={activeBidList} uid={uid}></CartItemList>
                    </div>
                )
            }
        }
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

class CartItemList extends Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(stripe, item){
        // console.log(item)
        let string = item.name + '!' + item.highestBid + '!' + item.description + '!' + item.imageUrl
        fetch('http://localhost:8000/processJSON.php', {
            headers: {
              // Accept: 'application/json',
              'Content-Type': 'text/plain',
            },
            // credentials: "include",
            method: 'POST',
            body: string
        })
          .then(response => {
            response.text().then(text=> {
                console.log(text.trim())
                stripe.redirectToCheckout({
                    sessionId: text.trim()
                    })
            })
          });
    }

    
    render(){
        console.log(this.props.items)
        const stripe = window.Stripe('pk_test_rpJFYMoN3dlgpDND53RFbjz800n6Rl2nMN');
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
                    clickHandlerFunction = {() => this.handleClick(stripe, item)} 
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
