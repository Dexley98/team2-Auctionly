import React from 'react';
import { compose } from 'recompose';
import Item from '../Item/item.js'
import { WithAuthorization, WithEmailVerification } from '../Session';

const HomePage = () => 

        <React.Fragment>
            <div>
                <h1>Home Page</h1>
                <p>The Home Page is accessible by every signed in user.</p>

                
                {/* Change so that each item is generated from realtime database */}
                <Item
                    itemName="Dog"
                    itemAmount="500">
                </Item>


            </div>
        </React.Fragment>

const condition = authUser => !!authUser;

// export default HomePage
export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
)(HomePage);
