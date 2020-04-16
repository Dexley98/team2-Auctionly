import React, { Component } from 'react';

//import routing from react router dom
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { compose } from 'recompose';
import Firebase from 'firebase';

import EditItemDiv from './EditItemDiv';

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
                <div className="edit-items-wrapper">
                    <nav className="back-to-admin-nav">
                        <ul>
                            <li>
                                <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="edit-items-content">
                        <h1>Edit Auction Items</h1>
                        <ItemList items={items}></ItemList>
                    </div>
                    
                </div>
                
            </React.Fragment>
        )
    }
}


const ItemList = ({ items }) => (
    <div className="edit-items-item-list">
        {items.map(item => (
            <EditItemDiv
                itemId={item.id}
                imageUrl={item.imageUrl}
                itemName={item.name}
                buyItNow={item.buyItNow}
                startPrice={item.startPrice}
                itemDescription={item.description} 
            />
        ))}
    </div>
);


const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(EditItemPage);