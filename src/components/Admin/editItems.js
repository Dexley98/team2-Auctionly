import React, { Component } from 'react';

//import routing from react router dom
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { compose } from 'recompose';
import Firebase from 'firebase';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

class EditItemPage extends Component {

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
            console.log('items object ', itemsObject);
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

    render() {
        const { items, loading } = this.state;
        
        return (
            <React.Fragment>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                            </li>
                        </ul>
                    </nav>

                    <h1>Edit Auction Items</h1>
                    
                </div>
                <ItemList items={items}></ItemList>
            </React.Fragment>
        )
    }
}


const ItemList = ({ items }) => (
    <ul>
        {items.map(item => (
            <Link to={`edit/${item.id}`}>
                <li key={item.name}>
                    <span>
                        <img src={item.imageUrl} width="200px" height="200px" />
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


const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(EditItemPage);