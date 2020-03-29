import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import * as ROUTES from '../../constants/routes';

export default class Item extends Component {

render() {
    return(

            // Creates text explaining item, and the current amount it costs (formatted so that it takes pennies as input)
            <React.Fragment>
                {this.props.itemName}: ${(this.props.itemAmount/100).toFixed(2)}
            </React.Fragment>

            // TODO: Add link to newly generated webpage for this item

    )
}
}