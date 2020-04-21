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
	    reportList: [] ,
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
        	let itemList = this.state.item ;
		let adminList = [];
		let x = 0 ;
		let keyList = this.state.keys;
		let userList = this.state.users;

		for(x in keyList)
			{
	                if(itemList[keyList[x]]["bidList"] != null)
				{
				console.log(keyList[x] + " exists!")
				adminList.push(itemList[keyList[x]])
	                	}
			}

		let z = 0 ;
		for(z in adminList)
			{
			let bids = adminList[z]["bidList"]
			let x = 0;
			let uid = "";
			let highestBid = 0;
			let reportList = [['item'] , ['highest_bid'] , ['user'] , ['email'] , ['phone_number']];
			let y = 1;

			for(x in bids)
				{
					if(bids[x] > highestBid )
						{
						highestBid = bids[x] ;
						reportList[y]["highest_bid"] = bids[x];
						reportList[y]["item"] = adminList[z]["name"];
						let i =0 ;
						for(i in userList)
							{
							if(userList[i])
								{
								reportList[y]["username"] = "" ;
        	                                        	reportList[y]["email"] = "" ;
                	                                	reportList[y]["phone_number"] = 0 ; 
								}
							else
								{
								reportList[y]["user"] = userList[i]["username"] ;
								reportList[y]["email"] = userList[i]["email"];
								reportList[y]["phone_number"] = userList[i]["phoneNumber"];
								}
							}
						}
				}
			y++;
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
	}
}

function myfunc(repoList)
	{
		return(
			"<tr><td>"+repoList.item+"</td><td>"+repoList.highest_bid+"</td><td>"+repoList.user+"</td><td>"+repoList.email+"</td><td>"+repoList.phone_number+"</td></tr>"
		) ;
	}

class WinnerList extends Component {
	constructor(props){
		super(props);
		this.state = {
			reports: ""
		}
	}
	render(){
		return(
		        <table>
                        <tr>
                                <th>Item</th>
                                <th>Bid</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                        </tr>
                        </table>
		)
	}
}

/*
const WinnerList = ({reportList}) => (
	reportList.map(myfunc)
);
*/
    
    const condition = authUser =>
        authUser && !!authUser.roles[ROLES.ADMIN];
    
    export default compose(
        WithEmailVerification,
        WithAuthorization(condition),
        withFirebase,
)(WinnersPageForm);
