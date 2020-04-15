import React, { Component } from 'react';

// add nav Dom Exley 04/15/2020
import Navigation from '../Navigation';

import { compose } from 'recompose';
import { WithAuthorization, WithEmailVerification } from '../Session';



class ItemPage extends Component{

    constructor(props) {
        super(props);
       this.state = {
            loading: false,
            item: {},
            key: "",
            bidValue: '',
            highestBid: 0,
            highestBidder: ""
        };
        
    }

    componentDidMount(){
        this.setState({ loading: true });
        let dbItemKey = this.props.match.params[0];
        // console.log((this.props.match.params[0]))
    
        /***************************************************************************************************
         * There is quite a lot going on in here so I'll try and explain it the best I can. 
         * I Only called this once
         * Justification: You are supposed to call .once if you want expect this UI element to remain the same.
         * Once a bidder goes to this page, they should not expect it to change. 
         * Willing to change this as necessary / as the team sees fit. 
         * I am leaving all the console logs in here so everyone can see my pain.
         * 
         * Function Explanation
         * So I added an index rule in the firebase database on item names. 
         * We will probably have to change this once we get item upload functionality sorted out. 
         * Basically I make a ref to the items collection, then I order it by name. 
         * This makes sure that I get only the item in question. (dbItemName)
         * I only get this item once, I explain why above. 
         * 
         * This next part is hell. I get a snapshot of the returned item in the itemObject, fairly routine stuff.
         * Object.keys returns an array of the enumerable object. I wish there was another way to do this since there is only one key.
         * but whatever. 
         * 
         * I have to take that key's first (and only) index and use it as the index on the itemObject to just get the item fields
         * after that I just assign it to my state and move along my day.
         * 
         * This is rough, but I think it will scale. Sorry for the long comment. I just didn't know how this worked before. 
         * I sure do now. 
         * 
         * 
        *******************************************************************************************************/
        this.props.firebase.db.ref(`/items/${dbItemKey}`)
            .on('value', snapshot => {
                const itemObject = snapshot.val();
                console.log(itemObject)
                //console.log('item object ', itemObject["three"]);
                // const keyList = Object.keys(itemObject);
                // console.log(itemObject)
                //console.log('key ', keyList)
                //console.log('item to assign to state ', itemObject[keyList[0]])
                this.setState({
                    item: itemObject,
                    key: dbItemKey,
                    loading: false,
                    highestBid: (itemObject.startPrice)
                });
            })
        //console.log('state.item ',this.state.item);

    }
    

    
    render(){
        const item = this.state.item;
        const bidList = this.state.item['bidList']
        let x
        for(x in bidList){
            if(bidList[x] > this.state.highestBid)
            {
                console.log("BIDLIST")
                console.log(bidList[x])
                this.setState({highestBid:bidList[x]})
                // highestBid = bidList[x]
                this.setState({highestBidder : x}) 

            }
        }
        // this.setState({highestBid:highestBidd})
        return(
            // same thing as React.Fragment / different syntax. May not need but here for now.
            <div>
                <Navigation />
                <hr />
                <div>
                    <img src={item.imageUrl} width="200px" height = "200px" alt={item.name}/>
                    <h1>{item.name}</h1>
                    <p>{item.description}</p>
                    <p>Start Price: ${(item.startPrice/1).toFixed(2)}</p>
                    <p> Highest Bid: ${(this.state.highestBid/1).toFixed(2)}</p>
                    <p>Buy it Now Price: ${(item.buyItNow/1).toFixed(2)}</p>

                    <form onSubmit={this.handleBid}>
                    $<input type="number" step="5" min={Number(this.state.highestBid) + 5} id="bidInput" onChange={this.myChangeHandler}></input><input type="submit" value="Bid"/> 
                    </form>

                    <form onSubmit={this.handleBuyout}>
                    <input type ="submit" value="Buyout"/>
                    </form>
                </div>
            </div>
        )
    }

    myChangeHandler = (event) => {
        this.setState({bidValue:event.target.value})
        
    }

    handleBid = (event) => {
        event.preventDefault();
        let bid = Number(this.state.bidValue)
        if(this.state.item["available"] === true)
        {
            this.props.firebase.db.ref("items/"+ this.state.key + "/bidList").update({[this.props.firebase.auth.W]:bid})
        }
        else{
            alert("This item is no longer available!")
        }
    }

    handleBuyout = (event) => {
        event.preventDefault();
        let buyout = Number(this.state.item["buyItNow"])
        if(this.state.highestBid > buyout)
        {
            alert("The bid is higher than the buyout!")
        }
        else
        {
            if(this.state.item["available"] === true)
            {
                this.props.firebase.db.ref("items/"+ this.state.key + "/bidList").update({[this.props.firebase.auth.W]:buyout})
                this.props.firebase.db.ref("items/"+ this.state.key).update({available:false})
            }
            else{
                alert("This item is no longer available!")
            }
        }
    }
}

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(ItemPage);
