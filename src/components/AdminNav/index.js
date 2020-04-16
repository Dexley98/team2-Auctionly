import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const AdminNavigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <AdminNavigationAuth authUser={authUser} />
            ) : (
                    <AdminNavigationNonAuth />
                )
        }
    </AuthUserContext.Consumer>
);

const AdminNavigationAuth = ({ authUser }) => (
    <nav className="admin-nav-bar-wrapper">
        <ul className="admin-nav-list-authorized">
            <li>
                <Link to={ROUTES.HOME}>Auction Home</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
                <SignOutButton />
            </li>
        </ul>
    </nav>
);

const AdminNavigationNonAuth = () => (
    <nav className="nav-bar-wrapper">
        <ul className="nav-list-non-authorized">
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
        </ul>
    </nav>
);

export default AdminNavigation;
