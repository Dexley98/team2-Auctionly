import React, { Component } from 'react';

// added Nav Dom Exley 04/15/2020
import Navigation from '../Navigation';

import SingleItem from '../Item/SingleItem';

import {Link} from 'react-router-dom'
import { compose } from 'recompose';
import { WithAuthorization, WithEmailVerification } from '../Session';

class HomePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            items: []
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

    
    this.props.firebase.auctionData().on('value', snapshot => {
        const auctionDataObject = snapshot.val();
        this.setState({
            auctionData: auctionDataObject
        });
    });

}

render(){
    const {items, auctionData} = this.state;

    let auctionDataReceived;
    auctionData === undefined ? auctionDataReceived = false : auctionDataReceived = true;

    return(

        <div className="home-wrapper">
            <Navigation />
            <hr />
        {auctionDataReceived && 
            <CountdownTimer data = {auctionData}/>
        }
        <h1>Home Page</h1>
        <p>The Home Page is accessible by every signed in user.</p>
        {auctionDataReceived && 
            <ItemList items = {items} data={auctionData}></ItemList>
        }
        </div>
    )
}
}


class ItemList extends Component{
    constructor(props){
        super(props);
        this.state = {
            timerCount: 0
        }
    }

    componentDidMount(){
        this.forceUpdate();
    }

    componentDidUpdate(){
        setTimeout(() => {
            this.setState({
                timerCount: this.state.timerCount + 1
            }); 
        }, 1000);
    }

    render(){

        let preAuction = false;
        let postAuction = false;
        let currentDate = new Date();
        let startDate = new Date(createDateString(this.props.data.startDate));
        let stopDate = new Date(createDateString(this.props.data.stopDate));
        let diffOfNowFromStart = currentDate - startDate;
        let diffOfNowFromStop = currentDate - stopDate;

        if(diffOfNowFromStart < 0){
            preAuction = true;
        }
        else if(diffOfNowFromStop < 0){
            preAuction = false;
        }
        else if(diffOfNowFromStop >= 0){
            postAuction = true;
        }
        
        if(preAuction || postAuction){
            return (
                <div className="item-list-wrapper">
                    {this.props.items.map( (item) => (
                        <SingleItem
                            itemId={item.id}
                            imageUrl={item.imageUrl}
                            itemName={item.name}
                            buyItNow={item.buyItNow}
                            startPrice={item.startPrice}
                            itemDescription={item.description} 
                        />))
                    }
                </div>
            )  
        }
        else{
            return(
                <div className="item-list-wrapper">
                    {this.props.items.map(item => (
                    <Link to={`item/${item.id}`}>
                       <SingleItem
                            itemId={item.id}
                            imageUrl={item.imageUrl}
                            itemName={item.name}
                            buyItNow={item.buyItNow}
                            startPrice={item.startPrice}
                            itemDescription={item.description} 
                        /> 
                    </Link>))
                    }
                </div>
            )
        }
    }
    
}

class CountdownTimer extends Component{

    constructor(props){
        super(props);
        this.state = {
            timeLeft: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            },
            messages: {
                timerMessage: "Loading...",
                endMessage: "Loading..." 
            }
        }
        
    }

    componentDidMount(){
        this.forceUpdate();
    }

    componentDidUpdate(){
        setTimeout(() => {
            let returnValues = calculateTimeLeft(this.props.data);
            this.setState({
                timeLeft: returnValues[0],
                messages: {
                    timerMessage: returnValues[1],
                    endMessage: returnValues[2]
                }
            }); 
        }, 1000);
    }
    
    render(){

        const timerComponents = [];
    
        Object.keys(this.state.timeLeft).forEach(interval => {
            if (!this.state.timeLeft[interval]) {
                return;
            }
        
            timerComponents.push(
                <span className={`timer-value-${interval}`}>
                    {this.state.timeLeft[interval]} {interval}{" "}
                </span>
            );
        });

        return (
            <div className="timer-wrapper">
              <h1 className="timer-message">{this.state.messages.timerMessage}</h1>
              {timerComponents.length ? timerComponents : <span className="timer-end-message">{this.state.messages.endMessage}</span>}
            </div>
          );
    }
    
}

function createDateString(dateObject){
    let date = dateObject
    let time = dateObject.time;

    let dateString = `${date.month}, ${date.date} ${date.year} ${time.hour}:${time.minute}`
    return dateString;
}

function calculateTimeLeft(auctionTimes){
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
}

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
