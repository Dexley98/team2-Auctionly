import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';

import * as ROUTES from '../../../constants/routes';
import './index.css'

class WinnersPageForm extends Component 
{
    constructor(props)
	{
        super(props);
        this.state = {
            loading: false,
            items: {},
	    winnerList: [] ,
	    highestBid: '',
	    highestBidder: "",
	    db: this.props.firebase.db
	        };

	}

    componentDidMount()
	{

        this.setState({ loading: true });
    
	this.props.firebase.items()
	.on('value', snapshot => {
                const itemObject = snapshot.val();
		const keyList = Object.keys(itemObject) ;

                this.setState({
                    item: itemObject,
		    keys: keyList,
                    loading: false ,
                	     });
            			}
	   );

	this.props.firebase.users()
	.on('value', snapshot => {
		const usersObject = snapshot.val();
		const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            this.setState({
                users: usersList,
            });
        })
	}
    render(){
	    const {users} = this.state ;
        let itemList = this.state.item ;
		let adminList = [];
		let x = 0 ;
		let keyList = this.state.keys;
		let userList = users;
		console.log(userList)
	    let reportList = [];

		for(x in keyList)
			{
	                if(itemList[keyList[x]]["bidList"] != null)
					{
						adminList.push(itemList[keyList[x]])
	            	}
			}

		let z = 0 ;
		reportList = []
		for(z in adminList)
			{
			let bids = adminList[z]["bidList"]
			let x = 0;
			let uid = "";
			let highestBid = 0 ;
			reportList.push(adminList[z]);
			console.log(reportList)

			for(x in bids)
				{
					if(bids[x] > highestBid )
						{
						highestBid = bids[x] ;
						console.log("z " + z)
						reportList[z]["highestbid"] = bids[x];
						let i =0 ;
						let userKeys = Object.keys(bids)
						for(i in userList)
							{								
							if( userList[i]['uid'] == x){
								if(bids[x] == reportList[z]["highestbid"]){
									reportList[z]["username"] = userList[i]["username"];
									reportList[z]["email"] = userList[i]["email"];
									reportList[z]["phone_number"] = userList[i]["phoneNumber"];
								}
							}
							}
						}
				}
			}
        return(
            <>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                            </li>
                        </ul>
                    <h1> Winner&apos;s Log </h1>
                    </nav>
                    <WinnerList winners={reportList}></WinnerList>
		</div>
            </>
		)
		console.log(reportList);
    	}
}

class WinnerList extends Component {
	constructor(props){
		super(props);
		this.tableFormat = this.tableFormat.bind(this);
	}
	tableFormat(){
		console.log(this.props.winners);
		return(
			this.props.winners.map(item => {
			})
		)
	}
	render(){
		return(
		<table class="center">
			<thead>
                        <tr>
                                <th>Item</th>
                                <th>Bid</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                        </tr>
			</thead>
			<tbody>
				{/* {this.tableFormat()} */}
				{this.props.winners.map(item => (
				<tr>
					<td>{item.name}</td>
					<td>{item.highestbid}</td>
					<td>{item.username}</td>
					<td>{item.email}</td>
					<td>{item.phone_number}</td>
				</tr>
				))}
			</tbody>
		</table>
		)
	}
}

/*
const WinnerList = ({reportList}) => (
	this.winners.map(myfunc)
);
*/
    
    const condition = authUser =>
        authUser && !!authUser.roles[ROLES.ADMIN];
    
    export default compose(
        WithEmailVerification,
        WithAuthorization(condition),
        withFirebase,
)(WinnersPageForm);
