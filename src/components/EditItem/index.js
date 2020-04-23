/**********************************************************
             
             Allow Admins to edit auction items
             
 *********************************************************/
import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom'

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

import * as ROUTES from '../../constants/routes';


class EditItemForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            item: {},
            key: "",
            available: true,
            name: '',
            description: '',
            startPrice: '',
            buyItNow: '',
            imageUrl: '',
            bidList: {},
            image: null,
        };

    }

    componentDidMount() {

        this.setState({ loading: true });
        
        //stores the current key of the item 
        let dbItemKey = this.props.match.params[0];
        //graps items from the database
        this.props.firebase.db.ref(`/items/${dbItemKey}`)
            .on('value', snapshot => {
                const itemObject = snapshot.val();
                this.setState({
                    item: itemObject,
                    key: dbItemKey,
                    loading: false
                });
            })

    }
    
    //upload image handler
    handleChange = e => {
        const image = e.target.files[0];
        this.setState(() => ({ image }));

    };

    handleUpload = () => {
        const { image } = this.state;

        if (this.state.image === null) {
            alert("No image has been selected")
        }
        else {
            const uploadTask = this.props.firebase.storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    // image upload progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    this.setState({ progress });
                },
                error => {
                    // Error function
                }
                , () => {
                    // Get the URL function
                    this.props.firebase.storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            this.setState({
                                url
                            });

                            this.state.imageUrl = url;
                        });
                }
            );
        }
    };

    onChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    //edit name of the item
    onEditName = event => {
        event.preventDefault();
        const { name } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                name,
            })       
    }
    
    //edit description of the item
    onEditDescription = event => {
        event.preventDefault();
        const { description } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                description,
            })

    }

    //edit start price of the item
    onEditStartPrice = event => {
        event.preventDefault();
        const { startPrice } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                startPrice,
            })
    }

    //edit Buy It Now price of the item
    onEditBuyItNow = event => {
        event.preventDefault();
        const { buyItNow } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                buyItNow,
            })
    }

    //edit image Url of the item
    onEditImageUrl = event => {
        event.preventDefault();
        const { imageUrl } = this.state;

        this.props.firebase.db
            .ref(`items/${this.state.key}/`).update({
                imageUrl,
            })
        
    }

    //remove the item for the auction
    onRemoveItem = event => {
        event.preventDefault();
        this.props.firebase.db
            .ref(`items/${this.state.key}/`).remove()

        this.props.history.push(ROUTES.EDIT_ITEM)
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
                        <input type="file" onChange={this.handleChange} />
                        {' '}
                        <progress value={this.state.progress} max="100" className="progress" />
                        <br />
                        <button onClick={this.handleUpload} >Upload Picture </button> {'  '}
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
