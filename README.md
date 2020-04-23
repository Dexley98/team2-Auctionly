## Steps to Run Locally
1. install the necessary packages using the command: 
```
npm install
```

2. Set up local host to work on the designated port 3006.
```
export PORT=3006
```

3. Run the development server using the command: 
```
npm run start
```
  3.a. If this does not automatically open a tab in a browser navigate to the address: localhost:3006/
  
4. Your Done!


## Firebase:
- This project relies on use of the firebase console. 
The credentials are:
**Username/email:** Allthingspossibleauctionly@gmail.com
**password:** AllSpring2020

- This console allows to mointor pricing for firebase's Backend as a service. We have decided to use the realtime database and highly recommend the Blaze Pay as you go plan. Instructions for adding payment information and setting up budgets are available through firebase's console as well as the google developer platform.

- In the event your database is wiped, please use the file **auctionly-141e3-export** located in this repositiory. Here are the instructions to restore the database. Please note, only the Allthingspossibleauctionly@gmail.com account will remain. 
1. Navigate to the Database option in the project overview panel on the left hand side. 
2. Select the 'Real Time Database' option. 
3. Select the Three dots, select 'import JSON' and drop the file into the menu.
4. Next, go to the authentication option in the project overview panel.
5. Delete all users EXCEPT for the allthingspossibleauctionly account. 
6. Your reset!

## Setting Up Stripe

In order to use stripe, you must first change the program to 'live' mode from 'test' mode.

In order to do this, first, log into the stripe console at https://dashboard.stripe.com/test/dashboard

At this site, activate your account using the link on the page, fill out all information requested.

After doing this, you will recieve a series of live API keys which will need to be inserted into the functions for the program to work.

You will need to install the firease CLI and then run:

    firebase login
    log in using allthingpossibleauctionly@gmail.com
    firebase init
    select functions
    use an existing project
    select auctionly-141e3 (Auctionly)
    select JavaScript
    select No
    select No
    select No
    select No
    select Yes to install NPM packages
    firebase functions:config:set stripe.public_key="PUBLIC KEY"
    firebase functions:config:set stripe.private_key="PRIVATE KEY"

    firebase deploy --only functions

This will deploy the firebase functions for stripe to work with the correct API keys for it to work live!

