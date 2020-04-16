import React, { Component } from 'react'

export default class SingleItem extends Component {
    constructor(props){
        super(props);

    }
    
    render() {
        return (
            <div id={this.props.itemId} className="single-item-wrapper">
                <img className="item-image" src={this.props.imageUrl} width="200px" height = "200px" alt={this.props.itemName}/>
                <h2>{this.props.itemName}</h2>
                <p>Buy Now: ${this.props.buyItNow.toFixed(2)}</p>
                <p>Starting Price: ${this.props.startPrice.toFixed(2)}</p>
                <p>{item.description}</p>
            </div>
        )
    }
}
