import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
// import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

import './index.css'

const Navigation = () => (
    <AuthUserContext.Consumer>
        {authUser =>
            authUser ? (
                <NavigationAuth authUser={authUser} />
            ) : (
                    <NavigationNonAuth />
                )
        }
    </AuthUserContext.Consumer>
);

const NavigationAuth = ({ authUser }) => (
    <nav className="nav-bar-wrapper">
        <ul className="nav-list-authorized">
            <li>
                <Link to={ROUTES.HOME}>Home</Link>
            </li>
            <li>
                <Link to={ROUTES.ACCOUNT}>Account</Link>
            </li>
            <li>
                <Link to={`../Cart/${authUser.uid}`}>Cart</Link>
            </li>
            {!!authUser.roles[ROLES.ADMIN] && (
                <li>
                    <Link to={ROUTES.ADMIN}>Admin</Link>
                </li>
            )}
        </ul>
	 {/* <SignOutButton /> */}
    </nav>
);

const NavigationNonAuth = () => (
    <nav className="nav-bar-wrapper">
        <ul className="nav-list-non-authorized">
            <li>
                <Link to={ROUTES.LANDING}>Landing</Link>
            </li>
        </ul>
    </nav>
);

export default Navigation;
