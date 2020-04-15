/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: added in imports from react-router-dom.
 * added links to Admin Functionality.
 *****************************************************************************************/

import React, { Component } from 'react';
import { compose } from 'recompose';

// add nav Dom Exley 04/15/2020
import Navigation from '../Navigation';

// added imports ref: Refactoring Changes 04/02/2020
import {Link} from 'react-router-dom';


import { withFirebase } from '../Firebase';
import { WithAuthorization, WithEmailVerification } from '../Session';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

class AdminPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
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
            <div>
                <Navigation />
                <hr />
                <h1>Admin</h1>
                <p>
                    The Admin Page is accessible by every signed in admin user.
                </p>
                <nav>
                    <ul>
                        <li>
                            <Link to={ROUTES.ADMIN_ADD_ITEM}>Add an Item</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.ADMIN_WINNER_LOG}>Winner Log</Link>
                        </li>
                        <li>
                            <Link to={ROUTES.ADMIN_REPORT}>Report Log</Link>
                        </li>
                </ul>
                </nav>

                {loading && <div>Loading ...</div>}

                <UserList users={users} />
            </div>
        );
    }
}
const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
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
            </li>
        ))}
    </ul>
);

const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(AdminPage);
import AdminPage from './admin';
import UsersPage from './Users';
import EditItemPage from './editItems';
import setTime from './timer';

export {
    AdminPage,
    UsersPage,
    EditItemPage,
    setTime
};
