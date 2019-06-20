import React from 'react';
import firebase from '../Config/Firebase';
import { Card } from 'antd';
const { Meta } = Card;
var db = firebase.firestore();
class Manstatus extends React.Component {
  constructor(props){
    super(props);
    this.state = {
     a: [],
   };
   }
   componentDidMount(){
    let temp=[];
     var ub=db.collection("users");
    var lb=db.collection("Leave");
    ub.where("alignedId","==",localStorage.getItem('uid')).get().then(querySnapshot =>{
      querySnapshot.forEach(doc =>{
       lb.where("uid","==",doc.id).get().then(querySnapshot => {
        querySnapshot.forEach(docs => {
          if(docs.status!=="-"){
        var l=temp.push({data:docs.data(),id:docs.id});
        }
        });
      this.setState({
          a: temp,
      });
   });
      })
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
            <p>Status: {element.data.status}</p>
          </Card>
        })
        }
          </div>
       );
    }
  }
export default Manstatus
