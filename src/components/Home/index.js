import React, { Component, useState, useEffect } from 'react';

//import routing from react router dom
import {Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { compose } from 'recompose';
import Firebase from 'firebase';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';


class HomePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: [],
            auctionData: {}, 
        };
    }

componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.items().on('value', snapshot => {
        const itemsObject = snapshot.val();
        console.log('items object ',itemsObject);
        const itemsList = Object.keys(itemsObject).map(key => ({
            ...itemsObject[key],
            id: key,
        }));
        this.setState({
            items: itemsList,
            loading: false,
        });
    });

    
    this.props.firebase.auctionData().once('value', snapshot => {
        const auctionDataObject = snapshot.val();
        this.setState({
            auctionData: auctionDataObject
        });
    });

}

render(){
    const {items, loading, auctionData} = this.state;
    console.log('items in home page render ', items);
    console.log('auctionData in home page render ', auctionData);
    return(
        <React.Fragment>
        <CountdownTimer data = {auctionData}/>
        <div>
            <h1>Home Page</h1>
            <p>The Home Page is accessible by every signed in user.</p>
        </div>
        <ItemList items = {items}></ItemList>
        </React.Fragment>
    )
}
}

// this function takes an item name from the item component and creates a url formatted like firstword-secondword-lastword
const itemNametoUrlString = (itemName) => {
    let splitNameList = itemName.split(' ');
    let itemNameUrl = '';

    for(let i=0; i<splitNameList.length; i++){
        if( i == splitNameList.length - 1){
            itemNameUrl += splitNameList[i];
        }
        else{
            itemNameUrl += `${splitNameList[i]}-`;
        }
    }
    return itemNameUrl
}


const ItemList = ({ items }) => (
    <ul>
        {items.map(item => (
                <Link to={`item/${itemNametoUrlString(item.name)}`}>
                    <li key={item.name}>
                        <span>
                            <img src={item.imageUrl} width="200px" height = "200px"/>
                            <br />
                            {item.name}
                            <strong> Buy Now: </strong> {item.buyItNow}
                            <strong> Starting Price: </strong> {item.startPrice}
                            <br></br> {item.description}
                    
                        </span>
                    </li>
                </Link>
        ))}
    </ul>
);

const CountdownTimer = (props) => {
    
    const createDateString = (dateObject) => {
        let date = dateObject
        let time = dateObject.time;

        let dateString = `${date.month}, ${date.date} ${date.year} ${time.hour}:${time.minute}`
        return dateString;
    }

    const calculateTimeLeft = (auctionTimes) => {
      // I set this to show that actual data was passed to this. 
      let startDate = auctionTimes.startDate;
      let stopDate = auctionTimes.stopDate;

      // since we call inside of a set interval this value you should change.
      let currentDate = new Date();  
      let startDateString = createDateString(startDate);
      let stopDateString = createDateString(stopDate);

      // the value of difference controls the magical if statement below
      let difference = +new Date(startDateString) - currentDate;
      let timerMessage = "Auction will Start in: ";
      let endMessage = "Auction is about to start!";

      // kind of a convuluted way to go about this, but it checks the first differce then falls back to this.
      if(difference <= 0){
          difference = +new Date(stopDateString) - currentDate;
          timerMessage = "Auction will End in: ";
          endMessage = "End of Auction ";
      }
    
      let timeLeft = {};
  
      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }
  
      return [timeLeft, timerMessage, endMessage];
    };
  
    // set default 'state' values for timeLeft so function doesn't shit itself. Also the "..." is only relevant for initial.
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        "...": "Loading"
    });

    // you have to individually set state
    const [messages, setMessages] = useState({
        timerMessage: "Loading...",
        endMessage: "Loading...",
    })


    //like ComponentDidMount
    useEffect(() => {
      setTimeout(() => {
        // You don't want to set the time if you haven't received the data yet. (I found this takes about 3 seconds.)
        if(Object.keys(props.data) == 0){
            // no props received, don't set state yet.
        }else{
            let returnValues = calculateTimeLeft(props.data);
            setTimeLeft(returnValues[0]);
            setMessages({
                timerMessage: returnValues[1],
                endMessage: returnValues[2]
            })
        }
        
      }, 1000);
    });
  
    const timerComponents = [];
  
    Object.keys(timeLeft).forEach(interval => {
      if (!timeLeft[interval]) {
        return;
      }
  
      timerComponents.push(
        <span>
          {timeLeft[interval]} {interval}{" "}
        </span>
      );
    });

    // all that for 2 lines of meaningful render code hahahahahahahahahyhahahahahaha.
    return (
      <div>
        <h1>{messages.timerMessage}</h1>
        {timerComponents.length ? timerComponents : <span>{messages.endMessage}</span>}
      </div>
    );
  }


const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
