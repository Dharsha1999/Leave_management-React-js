import React from 'react';
import firebase from '../Config/Firebase';
import 'antd/dist/antd.css';
import { message,Alert,Input, Button, Checkbox, Card } from 'antd';
import { Menu, Dropdown, Icon } from 'antd';
import { Select } from 'antd';
import { Collapse } from 'antd';
import { Spin } from 'antd';

const Panel = Collapse.Panel;

const info = () => {
  message.info('This is a normal message');
};

const { Option } = Select;
var db = firebase.firestore();
var l=0,v=0;
const { Meta } = Card;

class Alignid extends React.Component{
constructor(props){
   super(props);
   this.state = {
   value: 0,
   managers: [],
   members: [],
   ischecked: false,
   loading: false,
 };
}


onChange=(member,x,manager,e) => {
  console.log(e.target.value);
  let v=[];
  let z=[];
  x=parseInt(x);
  if(e.target.checked === true)
    { this.setState({
      ischecked: true,
      });

      var washingtonRef = db.collection("users").doc(e.target.value);
      var Ref=db.collection("Leave")
       if(washingtonRef.alignedId==="none"){
      return washingtonRef.update({
         alignedId: manager.id
      })
      .then(function() {
         console.log("Document successfully updated!");
      })
      .catch(function(error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });
      }
      else{

      return washingtonRef.update({
         alignedId: manager.id
      })
      .then(function() {
         console.log("Document successfully updated!");
      })
      .catch(function(error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });
      }

      }
      else{
      var washingtonRef = db.collection("users").doc(e.target.value);
      return washingtonRef.update({
         alignedId: "none"
      })
      .then(function() {
         console.log("Document successfully updated!");
      })
      .catch(function(error) {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error);
      });


      }
      
     
      }
    
componentDidMount() {
  this.getUsers();
}

getUsers = () => {
  let members = [];
  let managers = [];

  this.setState({
    loading:true,
  })
  db.collection("users")
     .get()
     .then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
            if(doc.data().role === 2){
              managers.push({ data:doc.data() , id:doc.id , checked: false })
            }
            if(doc.data().role === 3){
              if(doc.data().alignedId === 'none'){
                members.push({ data:doc.data() , id:doc.id , checked: false })
              }
              else{
                members.push({ data:doc.data() , id:doc.id , checked: true })
              }
            }
          });
            this.setState({
            managers,
            members,
            loading: false
          })
         

        })
         .catch(error => {
         console.log("Error getting documents: ", error);
      });
}

render(){
  if(this.state.loading===true){
    return  <Spin/>
  }
  return(
    <div>
      {this.state.managers.map((manager,i) => {
        return (<Card
                key={i}
                hoverable
                style={{width: 500,left: 500 }}
                bordered={false}
              >
                <Collapse accordion bordered={false}>
                  <Panel header={manager.data.name} value={manager.id}>
                     {this.state.members.map((member,i)=>{
                        return (<Checkbox
                          key={i} 
                          
                          value={member.id} 
                          onChange={this.onChange.bind(this,member,i,manager)}
                          defaultChecked={member.checked}
                          disabled={member.data.alignedId !== 'none' ? member.data.alignedId === manager.id ? false : true : false}
                          >
                            {member.data.name}
                          </Checkbox>)     
                     })}
                    </Panel>
                 </Collapse>
                </Card>)
        })}
    </div>);
  }
}
export default Alignid