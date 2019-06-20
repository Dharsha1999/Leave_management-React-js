import React from 'react';
import firebase from '../Config/Firebase';
import { Card } from 'antd';
import { message,Alert,Input, Button, Checkbox, Collapse, Select} from 'antd';
import { Menu, Dropdown, Icon } from 'antd';
import { Link } from 'react-router-dom'

const Panel = Collapse.Panel;


const { Option } = Select;
var db = firebase.firestore();
var l=0,v=0;

const { Meta } = Card;

class Other_team extends React.Component{
  constructor(props){
      super(props);
      this.state = {
      value: 0,
      managers: [],
      checked:false,
      members:[],
      leaves:[],
      path: 1,
    };
  }

  back =(x) =>{
    this.setState({
     path: x,
    })
  }
  handle = (id) => {

    let temp=[];
    {
            db.collection("users").where("organization", "==", localStorage.getItem('organization'))
                .get()
                .then((querySnapshot)=> {
                    querySnapshot.forEach((doc)=> {
                        // doc.data() is never undefined for query doc snapshots
                        if (doc.data().alignedId === id){
                            v=temp.push({ data:doc.data() , id:doc.id });
                            console.log(doc.data());}

                    });
                    this.setState({
                              members: temp,
                              path: 2,
                            });
                
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
                console.log(temp);
    }

  }

  handlem = (id) => {

    let temp=[];
    {
      
            db.collection("Leave").where("uid", "==", id)
                .get()
                .then((querySnapshot)=> {
                    querySnapshot.forEach(function(doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        if (doc.data().status === "Approved"){
                            v=temp.push({ data:doc.data() , id:doc.id });
                            console.log(doc.data());}

                    });

                    this.setState({
                              leaves: temp,
                              path:3,
                            });
                
                })
                .catch(function(error) {
                    console.log("Error getting documents: ", error);
                });
                console.log(temp);
                

    }

  }
  
  componentDidMount() {
      let temp=[];
      {
              db.collection("users").where("organization", "==", localStorage.getItem('organization'))
                  .get()
                  .then(function(querySnapshot) {
                      querySnapshot.forEach((doc)=> {
                          // doc.data() is never undefined for query doc snapshots
                          console.log(doc.id, " => ", doc.data());
                          if (doc.data().role === 2){
                            if(doc.id!=localStorage.getItem('uid'))
                              v=temp.push({ data:doc.data() , id:doc.id });
                              console.log(doc.data());}

                      });
                  
                  })
                  .catch(function(error) {
                      console.log("Error getting documents: ", error);
                  });
                  console.log(temp);
                  this.setState({
                            managers: temp
                          });

      }


  }
render(){
  if(this.state.path===3){
    return(
    <div>
                  {this.state.leaves.map(leave => {
                    return<Card
                                    hoverable
                                     style={{width: 500,left: 500 }}
                                     bordered={false}
                                    >
                                    <Button type="primary" onClick={()=>this.back(2)}><center>back</center></Button>
                                    <p><b>From:</b>{leave.data.from}<b>To:</b>{leave.data.to}</p>
                                    <p>{leave.data.name}</p>
                                    <p>{leave.data.reason}</p>
                                    <p><b>Status:</b>{leave.data.status}</p> 
                                    </Card>
                          })}

    </div>
    );

  }
  else if(this.state.path===2){

    return(
      <div>
                  {this.state.members.map(member => {
                    return(<Card
                                    hoverable
                                     style={{width: 200,left: 500,top: 10 }}
                                     bordered={false}
                                    >
                                     <Button type="primary" onClick={()=>this.back(1)}><center>back</center></Button>
                                     <Button type="link" onClick={()=>this.handlem(member.id)}><center>{member.data.name}</center></Button>
                            </Card>)
                              
                          })}
                          </div>
    );

  }
  else{

    return(
    <div>
                  {this.state.managers.map(manager => {
                    return<Card
                                    hoverable
                                     style={{width: 500,left: 500 }}
                                     bordered={false}
                                    >
                                    <Button type="link" block={true} onClick={()=>this.handle(manager.id)}><center>{manager.data.name}</center></Button>
                                    
                                    </Card>
                          })}

    </div>
    );

  }
  }


}
export default Other_team