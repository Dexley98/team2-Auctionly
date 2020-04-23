/***************************************************************************************
                         Allow Admins to add items to the Database
 **************************************************************************************/

import React, { Component } from 'react';
import { compose } from 'recompose';
import { Link} from 'react-router-dom';

import { withFirebase } from '../../Firebase';
import { WithAuthorization, WithEmailVerification } from '../../Session';
import * as ROLES from '../../../constants/roles';
// Just in case you need to route to stuff.
import * as ROUTES from '../../../constants/routes';


const INITIAL_STATE = {
    available: true,
    name: '',
    description: '',
    startPrice: '',
    buyItNow: '',
    imageUrl:"",
    bidList: {},
    image: null,
    url: '',

};

class AddItemForm extends Component {
  constructor(props) {
      super(props);

      this.state = { ...INITIAL_STATE };
    }

    handleChange = e => {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        
    };
    handleUpload = () => {
        const { image } = this.state;
        //kicks if admin tries to upload an image without selecting an image
        if (this.state.image === null) {
            alert("No image has been selected")
        }
        else {
            const uploadTask = this.props.firebase.storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                snapshot => {
                    // image upload progress function
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    this.setState({ progress });
                },
                error => {
                    // Error function
                    console.log(error);
                }
                , () => {
                    // Get the URL function
                    this.props.firebase.storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            this.setState({
                                url
                            });

                            this.setState({imageUrl : url});
                        });
                }
            );
        }
    };



    onChange = event => {

        this.setState({
            [event.target.name]: event.target.value
        });
    };


    onSubmit = event => {
        event.preventDefault();
        const { available, name, description, startPrice, buyItNow, imageUrl } = this.state;
        const bidList = {};
        bidList["Initial"] = '';
            //push items to the database 
            this.props.firebase.db
                .ref('/items').push({
                    available,
                    name,
                    description,
                    startPrice,
                    buyItNow,
                    imageUrl,
                    bidList,
                    
                })
                .then(() => {
                    // after item is created reset state of form back to empty fields
                    this.setState({
                        ...INITIAL_STATE
                    });
                })
        
    }
   
  render() {
      const {

          name,
          description,
          startPrice,
          buyItNow,

      } = this.state;


      return (
          <div>

              <nav>
                  <ul>
                      <li>
                          <Link to={ROUTES.ADMIN}>Go Back To Admin Page</Link>
                      </li>
                  </ul>
              </nav>

              <img
                  src={this.state.url || "https://via.placeholder.com/400x300"}
                  alt="Uploaded Images"
                  height="300"
                  width="400"
                  style={{padding:"10px"}}
              />

              <br />

              <input type="file" onChange={this.handleChange} />

              <br />
              <br />

              <progress value={this.state.progress} max="100" className="progress" />

              <br />

              <button onClick={this.handleUpload} >Upload Picture </button>

              <br />

              <form onSubmit={this.onSubmit}>
              
                    <input name="name" placeholder="Item Name" value={name} onChange={this.onChange} type="text" />
        
                    <br />
                    <input name="description" placeholder="Item Description" value={description} onChange={this.onChange} type="text" />
        
                    <br />
                    <input name="startPrice" type="text" placeholder="Starting Bid Price" value={startPrice} onChange={this.onChange} />
        
                    <br />
                    <input name="buyItNow" type="text" placeholder="Buy It Now Price" value={buyItNow} onChange={this.onChange} />
                  
                    <br />
                    <br />

                    <button type="submit" >Submit </button>
                
              </form>

              
              
          </div>

          
    );
  }
}

//gives access to admin role only
const condition = authUser =>
    authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
    WithEmailVerification,
    WithAuthorization(condition),
    withFirebase,
)(AddItemForm);
