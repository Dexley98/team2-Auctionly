import React, { Component } from 'react';
import { compose } from 'recompose';
import { withRouter, Redirect } from 'react-router-dom';
import SignOutButton from '../SignOut';


// added Nav Dom Exley 04/15/2020
import AdminNavigation from '../AdminNav';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const AdminPage = () => (
    <div>
        <AdminNavigation />
        <h1 style={{textAlign:"center",padding:'10px'}}> Admin Page </h1>
        <ViewUsersRedirect />
        <AddAnItemRedirect />
        <ViewWinnerLogRedirect />
        <ViewReportLogRedirect />
        <EditItemRedirect />
        <SetAuctionlyTimerRedirect />
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
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

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
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

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
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

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
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

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
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

                <button>
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
            <>
            <form onSubmit={this.onSubmit} style={{textAlign:"center", padding:"3px"}}>

                <button>
                    Set Auction Time
                </button>

            </form>

            <SignOutButton style={{width:"500px"}} />
            </>
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