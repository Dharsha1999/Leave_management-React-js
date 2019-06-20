import React from 'react';
import firebase from '../Config/Firebase';
import { Card, Button } from 'antd';
const { Meta } = Card;
var db = firebase.firestore();
class Statadmin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     a: [],
   };
   }
   componentDidMount(){
    let temp=[];
   db.collection("Leave").where("status", ">",'-').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var l=temp.push(doc.data())
        
        });
      this.setState({
          a: temp,
      });
   });
}
Approve=(data) =>{
    db.collection("Leave").doc(data).update({
              status: "Approved"
            })
  }
  Reject=(data)=>{
    db.collection("Leave").doc(data).update({
      status:"Rejected"
    })
  }
 render(){
    return(
          <div style={{ background: '#ECECEC', padding: '30px' }}>
          {this.state.a.map(element => {
            return<Card title="Leave Application" bordered={false} style={{ width: 700, left:500 }}>
            <p>Name:{element.name}</p>
            <p>From:{element.start}</p>
            <p>To:{element.end}</p>
            <p>Reason:{element.reason}</p>
            <p>Status: {element.status}</p>
            <Button type="primary" onClick={()=>this.Approve(element.id)}>Accept</Button>
           <Button type="danger" onClick={()=>this.Reject(element.id)}>Reject</Button>
          </Card>
        })
        }
          </div>
       );
    }
  }
export default Statadmin
