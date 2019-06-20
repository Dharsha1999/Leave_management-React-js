import React from 'react';
import firebase from '../Config/Firebase';
import {Redirect} from 'react-router-dom';

var count=0;
var db = firebase.firestore();
class SignIn extends React.Component{
constructor(props){
super(props);
this.state ={
tmp_result: true,
x: null,
};
}
SignIn=()=>{

var user =new firebase.auth.GoogleAuthProvider();
console.log(this.state.tmp_result);
firebase.auth().signInWithPopup(user).then((result) => {
console.log(result);
console.log(this.state.tmp_result);
var token = result.credential.accessToken;

//check for organization
var domain =result.additionalUserInfo.profile.email;
var a=domain.split("@");
 var x=a[1];
 var y=x.split(".")
 var z= y[0];
 var b=result.user.uid;

   localStorage.setItem('uid', result.user.uid);
    localStorage.setItem('email', result.additionalUserInfo.profile.email);
    localStorage.setItem('organization',z);


var company = db.collection("Organizations").doc(z);

var getDoc = company.get()
    .then(doc => {
        if (!doc.exists) {
            console.log("No such document!");
            
            console.log(b);
            db.collection("Organizations").doc(z).set({
              uid:result.user.uid,
              days: "0",
            })
            db.collection("users").doc(b).set({
            name: result.additionalUserInfo.profile.given_name,
            email: result.additionalUserInfo.profile.email,
            alignedId: "none",
            role: 1,
            organization: z
            })
           .then(() => {
             
            console.log("Document successfully written!");
            localStorage.setItem('role',1);
             {this.setState({
               tmp_result: false,
             });
           }
            })
            .catch(error => {
            console.error("Error writing document: ", error);
             });
            
        } else {
           
            console.log(b);
            var docRef = db.collection("users").doc(b);

            docRef.get().then(doc => {
           if (doc.exists) {
               console.log("Document data:", doc.data());
               localStorage.setItem('role',doc.data().role);
                {this.setState({
                 tmp_result: false,
               });
              }
           }
           else{
             
             db.collection("users").doc(b).set({
             name: result.additionalUserInfo.profile.given_name,
             email: result.additionalUserInfo.profile.email,
             alignedId: "none",
             role: 3,
             organization: z
             })
            .then(() => {
              
             console.log("Document successfully written!");
             localStorage.setItem('role',3);
              localStorage.setItem('uid',doc.id);
              {this.setState({
               tmp_result: false,
             });
           }
             })
             .catch(error => {
             console.error("Error writing document: ", error);
              });
           }
        })
    .catch(err => {
        console.log('Error getting document', err);
    });
}
            })
})
          
.catch(error =>{
var errorCode = error.code;
var errorMessage = error.message;
var email =error.email;
var credential = error.credential;
});
}

render(){
    
if(this.state.tmp_result)
{
return(
<div className="SignIn">
<button onClick={this.SignIn}>Sign In with Google</button>
</div>
)
}
else
{if(localStorage.getItem('role') === '1')
{
return(
      <div>
      <Redirect to="/dashboardAdmin"/>
       </div>
       )
}
else if(localStorage.getItem('role') === '2'){
  return(<div>
  <Redirect to="/dashboardManager" />
  </div>
  )
}
else  {
    return(
    <div>
    <Redirect to= "/dashboard" />
    </div>
)
}
}
}

}
export default SignIn