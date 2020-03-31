import React, { Component } from 'react';

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
        };
    }

componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.items().on('value', snapshot => {
        const itemsObject = snapshot.val();
        const itemsList = Object.keys(itemsObject).map(key => ({
            ...itemsObject[key],
            id: key,
        }));
        this.setState({
            items: itemsList,
            loading: false,
        });
    });
}

render(){
    const {items, loading} = this.state;
    return(
        <React.Fragment>
        <div>
            <h1>Home Page</h1>
            <p>The Home Page is accessible by every signed in user.</p>
        </div>
        <ItemList items = {items}></ItemList>
        </React.Fragment>
    )
}
}

// this was just for debugging. Can be removed. 
const ConsoleLog = ({ children }) => {
    console.log(children);
    return false;
  };

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
            <Link to={`${itemNametoUrlString(item.name)}`}>
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

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
