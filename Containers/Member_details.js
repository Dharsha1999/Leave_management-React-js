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
 {db.collection("Leave").where("uid", "==" , this.props.match.params.memberId)
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
  console.log(this.props.match.params.memberId);
return(
<div>
{this.state.b.map(element => {
return<Card
    hoverable
    style={{width: 500,left: 500 }}
  >
  <p>{element.name}</p>
  <p>{element.start}</p>
  <p>{element.end}</p>
  <p>{element.reason}</p>
  <p><b>Status:</b>{element.status}</p>
  </Card>
})}

</div>

);

}
}
export default UserStatus
