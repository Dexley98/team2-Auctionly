import React, { Component } from 'react';
import { compose } from 'recompose';
import { WithAuthorization, WithEmailVerification } from '../Session';
import { renderIntoDocument, act } from 'react-dom/test-utils';
import CheckoutButton from '../Checkout/CheckoutButton.js'



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
        if(this.state.loading == false)
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
                        if(y==uid)
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
                if((activeBidList[x]["available"] == false) && (activeBidList[x]["currentUser"] == " You have the current highest bid! "))
                {
                    activeBidList[x]["checkoutAvailable"] = <CheckoutButton name={activeBidList[x]["name"]} amount={highestBid*100}></CheckoutButton>;
                }
            }
            // console.log(highestBid + " " + currentUser)
            // console.log(activeBidList)

            for(x in keyList)
            return(
                <div>
                    <ItemList items={activeBidList} uid={uid}></ItemList>
                </div>
            )
        }
        else
        {
            return(
                <h2>
                loading...
                </h2>
            )
        }
        // console.log(item)
        // if(item["one"]["bidList"][this.props.firebase.auth.W]){
        //     console.log("exists")
        // }
        // <ActiveBidList items = {items}></ActiveBidList>
        
    }

    
}

const ItemList = ({ items, uid }) => (
    <ul>
        {items.map(item => (
                // <Link to={`item/${itemNametoUrlString(item.name)}`}>
                    <li key={item.name}>
                        <span>
                            <img src={item.imageUrl} width="200px" height = "200px"/>
                            <div style="font-size:x-large">
                            {item.name}
                            <p><strong> Your bid: </strong> ${(item.bidList[uid] / 1).toFixed(2)}</p>
                            <p><strong> Current leading bid: </strong> ${(item.highestBid / 1).toFixed(2)}</p>
                            <p><strong>{item.currentUser}</strong></p>
                            <p><strong> Description: </strong> {item.description}</p>
                            <br></br>
                            {item.checkoutAvailable}
                    	    </div>
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
