import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const AdminPage = () => (
    <div>
        <h1> Admin Page </h1>
        <ViewUsersRedirect />
        <AddAnItemRedirect />
        <ViewWinnerLogRedirect />
        <ViewReportLogRedirect />
        <EditItemRedirect />
    </div>
);



class ViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.USERS);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <button>
                    View Users
                </button>

            </form>
        );
    }
}

class AddAnItem extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.ADMIN_ADD_ITEM);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <button>
                    Add an Item
                </button>

            </form>
        );
    }
}

class ViewWinnerLog extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.ADMIN_WINNER_LOG);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <button>
                    View Winners Log
                </button>

            </form>
        );
    }
}

class ViewReportLog extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.ADMIN_REPORT);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <button>
                    View Report Log
                </button>

            </form>
        );
    }
}

class EditItem extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.EDIT_ITEM);
        event.preventDefault();
    };

    render() {
        return (
            <form onSubmit={this.onSubmit}>

                <button>
                    Edit Auction Items
                </button>

            </form>
        );
    }
}

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

const ViewUsersRedirect = compose(
    withRouter,
    withFirebase,
)(ViewUsers);

const AddAnItemRedirect = compose(
    withRouter,
    withFirebase,
)(AddAnItem);

const ViewWinnerLogRedirect = compose(
    withRouter,
    withFirebase,
)(ViewWinnerLog);

const ViewReportLogRedirect = compose(
    withRouter,
    withFirebase,
)(ViewReportLog);

const EditItemRedirect = compose(
    withRouter,
    withFirebase,
)(EditItem);

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(AdminPage);