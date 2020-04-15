/***************************************************************************************
 * Title: Refactoring Changes. 
 * Date: 04/02/2020
 * Author: Dom Exley
 * Description: Added in a routes to report, winnerLog, and add-item
 ********************************************************************/

export const LANDING = '/';
export const SIGN_UP = '/signup';
export const SIGN_IN = '/signin';
export const HOME = '/home';
export const ACCOUNT = '/account';
export const ADMIN = '/admin';
export const USERS = '/users';

// added all paths to items
export const ADMIN_REPORT = '/admin/report';
export const ADMIN_WINNER_LOG = '/admin/winnerlog';
export const ADMIN_ADD_ITEM = '/admin/add-item';
export const EDIT_ITEM = '/editItems'
export const SET_DATE = '/admin/set-date'


// Refactoring changes made here.
export const PASSWORD_FORGET = '/pw-forget';

// Wild Card Works for Items! yay!
export const DYNAMIC_ITEMS = '/item/*';
export const DYNAMIC_CART = '/cart/*';
export const EDIT_ITEM_PAGE = '/edit/*';
