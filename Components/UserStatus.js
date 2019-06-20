import React from 'react';
import firebase from '../Config/Firebase';
import 'antd/dist/antd.css';
import { message,Form, DatePicker,Input, Button, Checkbox, Card } from 'antd';
const { Meta } = Card;
var db = firebase.firestore();
var l=0;

class UserStatus extends React.Component {
 constructor(props){
   super(props);
   this.state = {
   b: [],
 };
}
componentDidMount() {
let temp=[];
 {db.collection("Leave").where("uid", "==" , localStorage.getItem('uid'))
 	   .get()
 	   .then((querySnapshot)=> {
 	       querySnapshot.forEach(function(doc) {
 	       	console.log(doc.data());
 	           // doc.data() is never undefined for query doc snapshots
 	           var l=temp.push(doc.data());
 	       });
 	       this.setState({
 	             b: temp,
 	           });
 	       
 	   })
 	   .catch(function(error) {
 	       console.log("Error getting documents: ", error);
 	   });
 	}

  }
// collect = () => {


// }

//componentDidMount

render(){
return(
<div>
{this.state.b.map(element => {
return<Card
    hoverable
    style={{width: 500,left: 500 }}
  >
  <p><b>From:</b>{element.from}<b>To:</b>{element.to}</p>
  <p>{element.reason}</p>
  <p><b>Status:</b>{element.status}</p>
  </Card>
})}

</div>

);

}
}
export default UserStatus
