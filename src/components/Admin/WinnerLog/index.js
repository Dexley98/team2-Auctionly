import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link} from 'react-router-dom'

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
// runs through each item in the item list
	    for(x in keyList)
			{
// if any bids have been made on an item then that item will be pushed to a seperate list				
	                if(itemList[keyList[x]]["bidList"] != null)
					{
						adminList.push(itemList[keyList[x]])
	            	}
			}

		let z = 0 ;
		reportList = []
// for every item in the new list the bids are check to find which bid is the highest	    
		for(z in adminList)
			{
			let bids = adminList[z]["bidList"]
			let x = 0;
			let highestBid = 0 ;
			reportList.push(adminList[z]);
			console.log(reportList)

			for(x in bids)
				{
// once the highest bid is found that entry is made into a new list that will be passed into a new render					
					if(bids[x] > highestBid )
						{
						highestBid = bids[x] ;
						console.log("z " + z)
						reportList[z]["highestbid"] = bids[x];
						let i =0 ;
						for(i in userList)
							{								
							if( userList[i]['uid'] === x){
								if(bids[x] === reportList[z]["highestbid"]){
									reportList[z]["username"] = userList[i]["username"];
									reportList[z]["email"] = userList[i]["email"];
									reportList[z]["phone_number"] = userList[i]["phoneNumber"];
								}
							}
							}
						}
// if the highest bid is 0 then that means no auctioner bid so blank info is added to notify the admins of that					
					else if(highestBid === 0)
                                                {
                                                reportList[z]["highestbid"] = "0" ;
                                                reportList[z]["username"] = "NO BIDS";
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
    	}
}

class WinnerList extends Component {
	
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
{/*walks through every item in the passed list print relevant info out to the Winner Log Screen in Admin*/}	
				{this.props.winners.map(item => (
				<tr>
{/*in order the info presented is the item Name, highest Bid, user's name, user's email, and user's phone number*/}			
					<td>{item.name}</td> 
					<td>$ {item.highestbid}</td>
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

    
    const condition = authUser =>
        authUser && !!authUser.roles[ROLES.ADMIN];
    
    export default compose(
        WithEmailVerification,
        WithAuthorization(condition),
        withFirebase,
)(WinnersPageForm);
