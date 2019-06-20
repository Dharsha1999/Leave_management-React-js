import React from 'react';
import firebase from '../Config/Firebase';
import { Card } from 'antd';
import { message,Alert,Input, Button, Checkbox} from 'antd';
import { Menu, Dropdown, Icon } from 'antd';
import { Link } from 'react-router-dom'
const { Meta } = Card;
var db = firebase.firestore();
class Manager_list extends React.Component{
  constructor(props){
   super(props);
   this.state = {
    a: [],
  };
}
   componentDidMount(){
    let temp=[];
   db.collection("users").where("alignedId","==",this.props.match.params.managerId).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var l=temp.push({data:doc.data(),id:doc.id});
        
        });
      this.setState({
          a: temp,
      });
   });
}

  render(){
    console.log(this.props.match.params.managerId);
    return(
          <div style={{ background: '#ECECEC', padding: '30px' }}>
          {this.state.a.map(member => {
            return<Card title="Leave Application" bordered={false} style={{ width: 700, left:500 }}>
           <Button type="link" block={true}>
              <Link to={`/members/${member.id}`}>{member.data.name}</Link>
          </Button>
          </Card>
        })
        }
          </div>
            
    );
  }
}
export default Manager_list
