import React, { Component } from 'react';

export class CountdownTimer extends Component {

    constructor(props){
        super(props);
        this.state = {
            timeLeft: {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            },
            messages: {
                timerMessage: "Loading...",
                endMessage: "",
            }
        }
    }

    componentDidUpdate() {
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
              <span>
                {this.state.timeLeft[interval]} {interval}{" "}
              </span>
            );
          });
      
          // all that for 2 lines of meaningful render code hahahahahahahahahyhahahahahaha.
          return (
            <div>
              <h1>{this.state.messages.timerMessage}</h1>
              {timerComponents.length ? timerComponents : <span>{this.state.messages.endMessage}</span>}
            </div>
          );
    }
}

export function calculateTimeLeft(auctionData){
    // I set this to show that actual data was passed to this. 
    let startDate = auctionData.startDate;
    let stopDate = auctionData.stopDate;

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

export function createDateString(dateObject){
    let date = dateObject;
    //console.log(dateObject);
    let time = dateObject.time;

    let dateString = `${date.month}, ${date.date} ${date.year} ${time.hour}:${time.minute}`;
    return dateString;
}
