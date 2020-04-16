import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class EditItemDiv extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        return(
            <div id={`edit${this.props.itemId}`} className="edit-single-item-wrapper">
                <Link className="edit-single-item-link" to={`edit/${this.props.itemId}`}>
                <div className="edit-single-item-image-wrapper">
                    <img className="item-image" src={this.props.imageUrl} width="200px" height = "200px" alt={this.props.itemName}/>
                </div>
                <div className="edit-single-item-info-wrapper">
                    <h2>{this.props.itemName}</h2>
                    <p>Buy Now: ${parseInt(this.props.buyItNow, 10).toFixed(2)}</p>
                    <p>Starting Price: ${parseInt(this.props.startPrice, 10).toFixed(2)}</p>
                    <p>{this.props.itemDescription}</p>
                </div>
                </Link>
            </div>
            )
    }
}
