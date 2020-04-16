import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

// added Nav Dom Exley 04/15/2020
import AdminNavigation from '../AdminNav';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const AdminPage = () => (
    <div className="main-admin-page-wrapper">
        <AdminNavigation />
        <div className="main-admin-content">
            <h1> Admin Page </h1>
            <div className="main-admin-links-wrapper">
                <ViewUsersRedirect />
                <AddAnItemRedirect />
                <ViewWinnerLogRedirect />
                <ViewReportLogRedirect />
                <EditItemRedirect />
                <SetAuctionlyTimerRedirect />
            </div>
        </div>
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
            <form className="view-users-button-wrapper" onSubmit={this.onSubmit}>
                <button className="view-users-button"> 
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
            <form className="add-item-button-wrapper" onSubmit={this.onSubmit}>
                <button className="add-item-button">
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
            <form className="winner-log-button-wrapper" onSubmit={this.onSubmit}>

                <button className="winner-log-button">
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
            <form className="view-report-button-wrapper" onSubmit={this.onSubmit}>

                <button className="view-report-button">
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
            <form className="edit-item-button-wrapper" onSubmit={this.onSubmit}>

                <button className="edit-item-button">
                    Edit Auction Items
                </button>

            </form>
        );
    }
}

class SetAuctionlyTimer extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }
    onSubmit = event => {
        this.props.history.push(ROUTES.SET_DATE);
        event.preventDefault();
    };

    render() {
        return (
            <form className="set-timer-button-wrapper" onSubmit={this.onSubmit}>

                <button className="set-timer-button">
                    Set Auction Time
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

const SetAuctionlyTimerRedirect = compose(
    withRouter,
    withFirebase,
)(SetAuctionlyTimer);

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(AdminPage);