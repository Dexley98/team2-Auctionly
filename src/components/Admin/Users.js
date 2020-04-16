import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link, BrowserRouter as Router, Route } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';

import * as ROUTES from '../../constants/routes';

class UsersPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
            db: this.props.firebase.db

        };
    }
    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.users().on('value', snapshot => {
            const usersObject = snapshot.val();
            const usersList = Object.keys(usersObject).map(key => ({
                ...usersObject[key],
                uid: key,
            }));
            this.setState({
                users: usersList,
                loading: false,
            });
        });


    }
    render() {
        const { users, loading } = this.state;

        return (
            <div className="view-users-wrapper">
                <nav className="back-to-admin-nav">
                    <ul>
                        <li>
                            <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                        </li>
                    </ul>
                </nav>

                <div className="view-users-content">
                    <h1>USERS</h1>
                    
                    {loading && <div>Loading ...</div>}
                    
                    <UserList users={users} dbref={this.state.db} />
                </div>
                
            </div>
        );
    }

}



const UserList = ({ users, dbref }) => (
    <ul className="users-list-wrapper">
        {
            users.map(user => (
                <li key={user.uid}>
                    <span>
                        <strong> Username:</strong> {user.username}
                    </span>
                    <span>
                        <strong> E-Mail:</strong> {user.email}
                    </span>
                    <span>
                        <strong> Phone Number:</strong> {user.phoneNumber}
                    </span>
                    <br/>
                    <span>
                        <strong> Roles:</strong> {user.roles[ROLES.USER] && user.roles[ROLES.USER]}
                    </span>
                    <span>
                        <strong> , </strong> {user.roles[ROLES.ADMIN]}
                    </span>
                    <br/>
                    <button
                        onClick={() => assignAdmin(user.uid, dbref)} >
                        Assign Admin
                      </button>

                    <button 
                        onClick={() => unAssignAdmin(user.uid, dbref)} >
                        Unassign Admin
                      </button>
                </li>
            ))}
    </ul>
);

const assignAdmin = (uid, dbref) => {
    dbref.ref(`users/${uid}/roles`).update({ ADMIN: "ADMIN" })

}

const unAssignAdmin = (uid, dbref) => {
    dbref.ref(`users/${uid}/roles`).update({ ADMIN: "" })

}

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];


export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(UsersPage);