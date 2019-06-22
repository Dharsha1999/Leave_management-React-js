import React from 'react';
import {
  Redirect
} from 'react-router-dom';
import Firebase from '../Config/Firebase';
import Firestore from '../Config/Firestore';
import SignIn from '../Containers/SignIn'

export default class Authenticator extends React.Component {

  constructor(props) {
    super(props);
    // this.provider = new firebase.auth.GoogleAuthProvider();
    this.state = {
      loading: true,
      authenticated: false,
      errorMessage: "",
      status: null,
      newLink: null,
    }
  }

  componentDidMount() {
    this.authenticate();

    Firebase.auth().getRedirectResult()
    .then((result) => {
      var user = result.user;
      if (user) {
        var cleanedUser = this.cleanUser(result.user);
        return Firestore.collection("users").doc(cleanedUser.uid).get().then((userSnap) => {
          if (userSnap.exists) {
            return Firestore.collection("users").doc(cleanedUser.uid).update(cleanedUser);
          } else {
            return Firestore.collection("users").doc(cleanedUser.uid).set(cleanedUser);
          }
         
        }).then(() => {
          this.setState({
            loading: false,
            authenticated: true
          });
          return true;
        })
      }
    }).catch(function(error) {
      console.log(error);
    });
  }

  cleanUser = (user) => {
    return {
      email: user.email,
      name: user.name,
      uid: user.uid,
      managerId: user.managerId,
      role: user.role
    }
  }

  authenticate() {
    Firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loading: false,
          authenticated: true
        })
      } else {
        this.setState({
          loading: false,
          authenticated: false
        })
      }
    });
    
  }

  render() {

    if (!this.state.authenticated) {
      return <SignIn />
    }

    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}
