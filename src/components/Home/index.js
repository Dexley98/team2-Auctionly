import React, { Component } from 'react';
import './index.css' ;
import SignOutButton from '../SignOut';
import Navigation from '../Navigation';

import SingleItem from '../Item/SingleItem';

import { Redirect} from 'react-router-dom'
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
        // Database query to grab all items within the database
        this.props.firebase.items().on('value', snapshot => {
            // Establishes an object to contain all the items
            const itemsObject = snapshot.val();
            // List to hold items/keys of items
            let itemsList = [];
            
            // Iterates over the itemsObject, and pushed each item and its key onto the itemList
            Object.keys(itemsObject).map(key=>{
                if(itemsObject[key].available === true){
                    itemsList.push({
                        ...itemsObject[key],
                        id: key
                    })
                }
                
            })
            
            // Sets the state, to store that itemList and whether or not the page is loading
            this.setState({
                items: itemsList,
                loading: false,
            });
        });

        // sets the state, graps auctionData (stop time and start time).        
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

        // since there is a delay in grabbing the auction data from firebase, this checks then starts the stand alone timer.
        if(auctionDataReceived){
            standAloneTimer(auctionData, this.props.firebase, items)
        }

        // If there are no items present, display this page.
        if(items.length == 0){
            return(
                <div className="home-wrapper">
                    <Navigation />
                    <hr />
                    {auctionDataReceived &&
                        < CountdownTimer data= {auctionData} />
                    }
                    <h1>Auctionly Home</h1>
                    <p>Thanks for showing your support and participating in the silent auction! We hope to see you again soon!</p>
                    <SignOutButton />
                </div>
            )
        }
        //If there are items present, display this page, including the items
        else{
            return(

                <div className="home-wrapper">
                    <Navigation />
                    <hr />
                {auctionDataReceived && 
                    <CountdownTimer data = {auctionData}/>
                }
                <h1>Auctionly Home</h1>
                {auctionDataReceived && 
                    <ItemList items = {items} data={auctionData}></ItemList>
                }
                <SignOutButton />
                </div>
            )
        }
        
    }
}

/*
 * This timer takes in auction data from firebase a reference to the firebase object, and the list of items.
 * Dates are formatted created correctly then a difference is calculated. 
 * If the auction is over, whatever items are still avaiailable are marked false.
 * This runs every second.
 */
function standAloneTimer(auctionData, firebase, items){
    let timerId = setInterval( () => {
        let currentDate = new Date();  
        let stopDate = new Date(createDateString(auctionData.stopDate));
        if( currentDate - stopDate >= 0){
            items.map( (index) => {
                firebase.db.ref(`items/${index.id}/`).update({
                    available: false
                });
            });
            clearInterval(timerId)
        }
    }, 1000)
}

// ItemList class that constructs list of item objects
class ItemList extends Component{
    constructor(props){
        super(props);
        this.state = {
            timerCount: 0
        }
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

        // set various flags to determine what the state of the auction is.
        if(diffOfNowFromStart < 0){
            preAuction = true;
        }
        else if(diffOfNowFromStop < 0){
            preAuction = false;
        }
        else if(diffOfNowFromStop >= 0){
            postAuction = true;
        }
        
        // If the auction is not active, disable the links
        if(preAuction || postAuction){
            return (
                <div className="item-list-wrapper">
                    {this.props.items.map( (item) => (
                        <SingleItem
                            activeLink = {false}
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
        // If Auction is currently live, make links active
        else{
            return(
                <div className="item-list-wrapper">
                    {this.props.items.map(item => (
                       <SingleItem
                            activeLink = {true}
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
    }
    
}


/*
 * This component does renders the countdown timer on the main home page.
 * Has various state values that are initialized in the constructor but set in the calcuateTimeLeft function
 */
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

    // since this component is time sensitive it is set to update when it mounts.
    componentDidMount(){
        this.forceUpdate();
    }

    /* on mount returnValues is populated with passed in auction data.
     those values then set various state messages.
     In the saddest turn of events, it was discovered this component does not 
     successfully update on iPhone. No data can be found to remedy this issue on short notice. 
     A component on this page does not update, or mount correctly is my only assumption. */
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
    
        // take the keys of the state and for each one populate with correct values.
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
              {timerComponents.length ? timerComponents : 
                <span className="timer-end-message">
                    {this.state.messages.endMessage}
                </span>
              }
            </div>
          );
    }
    
}

// create a date string based on a date object that can be used in javaScript date function.
function createDateString(dateObject){
    let date = dateObject
    let time = dateObject.time;

    let dateString = `${date.month}, ${date.date} ${date.year} ${time.hour}:${time.minute}`
    return dateString;
}

/* 
This function does the heavy lifting. 
Essentially it creates dates with javaScript Date function and get the difference between 
two different time values depending on what status the auction is in. 
*/
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
      endMessage = "Thanks for participating! The auction is now over. ";
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

// Render the home page for authorized users
export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
