import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';

import * as ROUTES from '../../../constants/routes';


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
	    	let reportList = [];

		for(x in keyList)
			{
	                if(itemList[keyList[x]]["bidList"] != null)
				{
//				console.log(keyList[x] + " exists!")
				adminList.push(itemList[keyList[x]])
	                	}
			}

		let z = 0 ;
		for(z in adminList)
			{
			let bids = adminList[z]["bidList"]
			let x = 0;
			let uid = "";
			let highestBid = 0 ;
                        reportList["item"] = adminList[z]["name"];

			for(x in bids)
				{
					if(bids[x] > highestBid )
						{
						highestBid = bids[x] ;
						reportList["highestbid"] = bids[x];
						let i =0 ;
						for(i in userList)
							{
							if(userList[i])
								{
								reportList["username"] = "" ;
        	                                        	reportList["email"] = "" ;
                	                                	reportList["phone_number"] = 0 ; 
								}
							else
								{
								reportList["user"] = userList[i]["username"] ;
								reportList["email"] = userList[i]["email"];
								reportList["phone_number"] = userList[i]["phoneNumber"];
								}
							}
						}
				}
console.log(userList);
				console.log(reportList);
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
                    <WinnerList winners= {reportList}></WinnerList>
		</div>
            </>
		)
console.log(reportList);
    	}
}

/*
function myfunc(repoList)
	{
		return(
			"<tr><td>"+repoList.item+"</td><td>"+repoList.highest_bid+"</td><td>"+repoList.user+"</td><td>"+repoList.email+"</td><td>"+repoList.phone_number+"</td></tr>"
		) ;
	}
*/

class WinnerList extends Component {
	constructor(props){
		super(props);
		/*this.state = {
			winList: ""
		}*/
		this.tableFormat = this.tableFormat.bind(this);
	}
	tableFormat(){
console.log(this.props.reportList);
		this.props.winners.map(reportList => {
			return(
				<tr>
				<td>{reportList.item}</td>
				<td>{reportList.highest_bid}</td>
				<td>{reportList.user}</td>
				<td>{reportList.email}</td>
				<td>{reportList.phone_number}</td>
				</tr>
			)})
	}
	render(){
		return(
		<table>
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
				{this.tableFormat()}
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
