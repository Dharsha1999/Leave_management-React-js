import React from 'react';
import firebase from '../Config/Firebase';
import { Card } from 'antd';
import 'antd/dist/antd.css';
import { message,Form, DatePicker,Input, Button, Checkbox} from 'antd';
const { Meta } = Card;
var db = firebase.firestore();
class Admin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     a: [],
   };
   }
   componentDidMount(){
    let temp=[];
   db.collection("Leave").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var l=temp.push({data:doc.data(),id:doc.id});
        
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
            <p>Name:{element.data.name}</p>
            <p>From:{element.data.start}</p>
            <p>To:{element.data.end}</p>
            <p>Reason:{element.data.reason}</p>
           <Button type="primary" onClick={()=>this.Approve(element.id)}>Accept</Button>
           <Button type="danger" onClick={()=>this.Reject(element.id)}>Reject</Button>
          </Card>
        })
        }
          </div>
            
    );
    }
  }
export default Admin
