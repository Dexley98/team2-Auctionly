import React, { Component } from 'react'

export default class SingleItem extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        return (
            <div id={this.props.itemId} className="single-item-wrapper">
                <div className="item-image-wrapper">
                    <img className="item-image" src={this.props.imageUrl} width="200px" height = "200px" alt={this.props.itemName}/>
                </div>
                <div className="item-info-wrapper">
                    <h2>{this.props.itemName}</h2>
                    <p>Buy Now: ${parseInt(this.props.buyItNow, 10).toFixed(2)}</p>
                    <p>Starting Price: ${parseInt(this.props.startPrice, 10).toFixed(2)}</p>
                    <p>{this.props.itemDescription}</p>
                </div>
            </div>
        )
    }
}
