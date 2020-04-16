import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';
import './timer.css';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
// Just in case you need to route to stuff.
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    date: '',
    month: '',
    year: '',
    hour: '',
    minute: '',
};

class setTime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...INITIAL_STATE
        };
    }

    componentDidMount() {
        this.setState({
            loading: true,
            auctionStartDate: '',
            auctionStartMonth: '',
            auctionStartYear: '',
            auctionStartHour: '',
            auctionStartMinute: '',
            auctionEndDate: '',
            auctionEndMonth: '',
            auctionEndYear: '',
            auctionEndHour: '',
            auctionEndMinute: '',
        });

        this.props.firebase.db
            .ref('/auctionData/startDate/')
            .on('value', snapshot => {

                const startDateValues = snapshot.val();

                this.setState({
                    auctionStartDate: startDateValues.date,
                    auctionStartMonth: startDateValues.month,
                    auctionStartYear: startDateValues.year,
                    loading: true,
                });
            });
            
        this.props.firebase.db
            .ref('/auctionData/startDate/time/')
            .on('value', snapshot => {
                
                const startDateValues = snapshot.val();

                this.setState({
                    auctionStartHour: startDateValues.hour,
                    auctionStartMinute: startDateValues.minute,
                    loading: false,
                });
            });
        this.props.firebase.db
            .ref('/auctionData/stopDate/')
            .on('value', snapshot => {
                
                const endDateValues = snapshot.val();

                this.setState({
                    auctionEndDate: endDateValues.date,
                    auctionEndMonth: endDateValues.month,
                    auctionEndYear: endDateValues.year,
                    loading: false,
                });

            });
        this.props.firebase.db
            .ref('/auctionData/stopDate/time/')
            .on('value', snapshot => {
                
                const endDateValues = snapshot.val();

                this.setState({
                    auctionEndHour: endDateValues.hour,
                    auctionEndMinute: endDateValues.minute,
                    loading: false,
                });

            });
    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };


    onSubmitStartDate = event => {
        event.preventDefault();

        const { date, month, year, hour, minute } = this.state;
  
        this.props.firebase.db
            .ref('/auctionData/startDate').update({
                date,
                month,
                year,
            })
            .then(
                    this.props.firebase.db
                    .ref('/auctionData/startDate/time').update({
                        hour: hour,
                        minute: minute,
                    })
            )
            .then(() => {
                // after item is created reset state of form back to empty fields
                this.setState({ ...INITIAL_STATE });
            })

    }

    onSubmitEndDate = event => {
        event.preventDefault();

        const { date, month, year, hour, minute } = this.state;

        this.props.firebase.db
            .ref('/auctionData/stopDate').update({
                date,
                month,
                year,
            })
            .then(
                this.props.firebase.db
                    .ref('/auctionData/stopDate/time').update({
                        hour: hour,
                        minute: minute,
                    })
            )
            .then(() => {
                // after item is created reset state of form back to empty fields
                this.setState({ ...INITIAL_STATE });
            })
    }

    render() {
        const {
            startDate,
            startMonth,
            startYear,
            startHour,
            startMinute,
            endDate,
            endMonth,
            endYear,
            endHour,
            endMinute,
            auctionStartDate,
            auctionStartMonth,
            auctionStartYear,
            auctionStartHour,
            auctionStartMinute,
            auctionEndDate,
            auctionEndMonth,
            auctionEndYear,
            auctionEndHour,
            auctionEndMinute,

        } = this.state;

        return (

            <div className="nav-bar">

                <nav>
                    <ul>
                        <li>
                            <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                        </li>
                    </ul>
                </nav>
	    </div>
	    <div className="forms">
            <form name="startDate" onSubmit={this.onSubmitStartDate}>
                
                
                <h1> Set Auction Start Time </h1>

                    <h3>Current Start Time: <br/>
                    {auctionStartMonth + " / " + auctionStartDate + " / " + auctionStartYear
                        + " at " + auctionStartHour + ":" + auctionStartMinute
                    } 
                    </h3>
                    <br />


                    <input
                        name="month"
                        placeholder="Month"
                        value={startMonth}
                        onChange={this.onChange}
                        type="number"
                        min="1"
                        max="12"
                        style={{ width: "250px" }}
                    />

                    <br />
                    <br />

                    <input
                        name="date"
                        placeholder="Day"
                        value={startDate}
                        onChange={this.onChange}
                        type="number"
                        min="1"
                        max="31"
                        style={{ width: "250px" }}
                    />

                <br />
                <br />
                
                <input
                        name="year"
                        type="number"
                        placeholder="Year"
                        value={startYear}
                        onChange={this.onChange}
                        min="2020"
                        max="2030"
                        style={{ width: "250px" }}
                />
                <br />
                <br />
                <input
                        name="hour"
                        type="number"
                        placeholder="hour"
                        value={startHour}
                        onChange={this.onChange}
                        min="0"
                        max="23"
                        style={{ width: "250px" }}
                    />
                <br />
                <br />
                <input
                        name="minute"
                        type="number"
                        placeholder="Minute"
                        value={startMinute}
                        onChange={this.onChange}
                        min="0"
                        max="59"
                        style={{ width: "250px" }}
                />
                    <br />
                    <br />
                <button type="submit">Submit</button>


            </form>

                <br />

            <form name="endDate" onSubmit={this.onSubmitEndDate}>

                <h1> Set Auction End Time </h1>

                    <h3>Current End Time: <br />
                        {auctionEndMonth + " / " + auctionEndDate + " / " + auctionEndYear
                            + " at " + auctionEndHour + ":" + auctionEndMinute
                        }
                    </h3>

                <br />

                    <input
                        name="month"
                        placeholder="Month"
                        value={endMonth}
                        onChange={this.onChange}
                        type="number"
                        min="1"
                        max="12"
                        style={{ width: "250px" }}
                    />
                <br />
                <br />
                    
                    <input
                        name="date"
                        placeholder="Day"
                        value={endDate}
                        onChange={this.onChange}
                        type="number"
                        min="1"
                        max="31"
                        style={{ width: "250px" }}
                    />

                <br />
                <br />
                <input
                        name="year"
                        type="number"
                        placeholder="Year"
                        value={endYear}
                        onChange={this.onChange}
                        min="2020"
                        max="2030"
                        style={{ width: "250px" }}
                />
                <br />
                <br />
                <input
                        name="hour"
                        type="number"
                        placeholder="hour"
                        value={endHour}
                        onChange={this.onChange}
                        min="0"
                        max="23"
                        style={{ width: "250px" }}
                />
                <br />
                <br />
                <input
                        name="minute"
                        type="number"
                        placeholder="Minute"
                        value={endMinute}
                        onChange={this.onChange}
                        min="0"
                        max="59"
                        style={{ width: "250px"}}
                />
                <br/>
                <br />
                <button type="submit">Submit</button>


                </form>
            </div>
        );
    }
}

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(setTime);
