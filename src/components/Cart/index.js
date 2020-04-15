import React, { Component } from 'react';

// add nav Dom Exley 04/15/2020
import Navigation from '../Navigation';

import { compose } from 'recompose';
import { WithAuthorization, WithEmailVerification } from '../Session';

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
            let keyList = this.state.keys;
            let x = 0;
            for(x in keyList){
                if(itemList[keyList[x]]["bidList"][this.props.firebase.auth.W]){
                    console.log(keyList[x] + " exists!")
                    activeBidList.push(itemList[keyList[x]])               }
            }


            x=0
            for(x in activeBidList)
            {
                let highestBid = 0
                let currentUser = false;
                let bidList = activeBidList[x]["bidList"]
                let y = 0
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
                            currentUser = " "
                        }
                    }
                }
                activeBidList[x]["currentUser"] = currentUser;
                activeBidList[x]["highestBid"] = highestBid;
                const stripe = window.Stripe('pk_test_rpJFYMoN3dlgpDND53RFbjz800n6Rl2nMN')
                if((activeBidList[x]["available"] === false) && (activeBidList[x]["currentUser"] === " You have the current highest bid! "))
                {
                    activeBidList[x]["checkoutAvailable"] =  <button onClick = { ()=> handleClick(stripe, activeBidList[x])}>Checkout</button>
                }
            }
            // console.log(highestBid + " " + currentUser)
            // console.log(activeBidList)

            for(x in keyList)
            return(
                <div>
                    <Navigation />
                    <hr />
                    <ItemList items={activeBidList} uid={uid}></ItemList>
                </div>
            )
        }
        else
        {
            return(
                <div>
                    <Navigation />
                    <hr />
                    <h2>
                    loading...
                    </h2>
                </div>
            )
        }
        // console.log(item)
        // if(item["one"]["bidList"][this.props.firebase.auth.W]){
        //     console.log("exists")
        // }
        // <ActiveBidList items = {items}></ActiveBidList>
        
    }

    
}

const handleClick = (stripe, item) => {
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

const ItemList = ({ items, uid }) => (
    <ul>
        {items.map(item => (
                // <Link to={`item/${itemNametoUrlString(item.name)}`}>
                    <li key={item.name}>
                        <span>
                            <img src={item.imageUrl} width="200px" height = "200px" alt={item.name}/>
                            <br />
                            {item.name}
                            <strong> Your bid: </strong> ${(item.bidList[uid] / 1).toFixed(2)}
                            <strong> Current leading bid: </strong> ${(item.highestBid / 1).toFixed(2)}
                            <strong>{item.currentUser}</strong>
                            <br /> 
                            {item.description}
                            <br></br>
                            {item.checkoutAvailable}
                    
                        </span>
                    </li>
                // </Link>
        ))}
    </ul>
);

const condition = authUser => !!authUser;



export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(CartPage);
