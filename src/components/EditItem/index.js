
import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
    available: true,
    name: '',
    description: '',
    startPrice: '',
    buyItNow: '',
    imageUrl: '',
    bidList: {},

};

class EditItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            item: {},
            key: "",
            ...INITIAL_STATE,
        };

    }

    componentDidMount() {
        this.setState({ loading: true });
        
        this.props.firebase.db.ref('/items')
            .orderByChild("itemName")
            .on('value', snapshot => {
                const itemObject = snapshot.val();
                const keyList = Object.keys(itemObject);
                
                this.setState({
                    item: itemObject[keyList[0]],
                    key: keyList[0],
                    loading: false
                });
            })

    }

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };


    onEditName = event => {

        const { name } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                name,
            })
        event.preventDefault();
    }

    onEditDescription = event => {

        const { description } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                description,
            })
        event.preventDefault();
    }

    onEditStartPrice = event => {

        const { startPrice } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                startPrice,
            })
        event.preventDefault();
    }

    onEditBuyItNow = event => {

        const { buyItNow } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                buyItNow,
            })
        event.preventDefault();
    }

    onEditImageUrl = event => {

        const { imageUrl } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                imageUrl,
            })
        event.preventDefault();
    }

    onRemoveItem = event => {

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).remove()
        event.preventDefault();
    }
    render() {
        const item = this.state.item;
        const {
            name,
            description,
            startPrice,
            buyItNow,
            imageUrl,

        } = this.state;
        
        // this.setState({highestBid:highestBidd})
        return (
            // same thing as React.Fragment / different syntax. May not need but here for now.
            <>
                <div>
                    <h1> Edit Item </h1>

                    <nav>
                        <ul>
                            <li>
                                <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                            </li>
                        </ul>
                    </nav>

                    <img src={item.imageUrl} width="200px" height="200px" />
                    <h1>{item.name}</h1>
                    <p>Item description: {item.description}</p>
                    <p>Start Price: ${(item.startPrice / 1).toFixed(2)}</p>
                    <p>Buy it Now Price: ${(item.buyItNow / 1).toFixed(2)}</p>

                    <form onSubmit={this.onEditName}>
                        <input
                            name="name"
                            placeholder="Item Name"
                            value={name}
                            onChange={this.onChange}
                            type="text"
                        />
                        <button type="submit">Update</button>
                    </form>

                    <form onSubmit={this.onEditDescription}>
                        <input
                            name="description"
                            placeholder="Description"
                            value={description}
                            onChange={this.onChange}
                            type="text"
                        />
                        <button type="submit">Update</button>
                    </form>

                    <form onSubmit={this.onEditStartPrice}>
                        <input
                            name="startPrice"
                            placeholder="Start Price"
                            value={startPrice}
                            onChange={this.onChange}
                            type="text"
                        />
                        <button type="submit">Update</button>
                    </form>

                    <form onSubmit={this.onEditBuyItNow}>
                        <input
                            name="buyItNow"
                            placeholder="Buy it now price"
                            value={buyItNow}
                            onChange={this.onChange}
                            type="text"
                        />
                        <button type="submit">Update</button>
                    </form>

                    <form onSubmit={this.onEditImageUrl}>
                        <input
                            name="imageUrl"
                            type="file"
                            value={imageUrl}
                            onChange={this.onChange}
                        />
                        <button type="submit">Update</button>
                    </form>
                    <br></br>

                    <button onClick={this.onRemoveItem}>Remove Item</button>
                </div>
            </>
        )
    }

}



const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(EditItemForm);