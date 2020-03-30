import React, { Component } from 'react';
import { compose } from 'recompose';

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


const ItemList = ({ items }) => (
    <ul>
        {items.map(item => (
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
        ))}
    </ul>
);

const condition = authUser => !!authUser;

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
