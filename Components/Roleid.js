import React from 'react';
import firebase from '../Config/Firebase';
import { Menu, Dropdown, Icon, Card } from 'antd';
import 'antd/dist/antd.css';
import { Select, Divider } from 'antd';
import { InputNumber } from 'antd';
const { Option } = Select;
var db = firebase.firestore();
function role(user) {
console.log(user);
if(user.data.role===3)
return"Member"
else
return"Manager"

}
class Roleid extends React.Component{
  constructor(props){
    super(props);
    this.state = {
     a: [],
     value: 0,
     x: 1,
   };
       this.subComponent = this.subComponent.bind(this);
   }
  handle = (value,id) => {
    if(value==2){
 return db.collection("users").doc(id).update({
  role: 2
 })
 localStorage.setItem('role',value);
  } 
  else if(value==3)
    return db.collection("users").doc(id).update({
      role:3
    })
  localStorage.setItem('role',value);
}
onChange =(value) => {
              console.log('changed', value);
              var id=localStorage.getItem('organization')
              this.setState({
                x: value,
              })
             db.collection("Organizations").doc(id).update({
              days: value,
             })
             .then(() => {
              console.log("written successfully");
             })
             .catch(() =>{
              console.log("error");
             })
            }
componentDidMount(){
    let temp=[];
   db.collection("users").get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if(doc.data().role!==1){
        var l=temp.push({data:doc.data(),id:doc.id});
        }
        });
      this.setState({
          a: temp,
      });
   });
}
componentDidUpdate(prevProps){
    if (this.props.value !== prevProps.value) {
      this.setState({
       value: this.props.value
      });
  
}
}
subComponent=(data) =>{
    if(data==="2"){
      return(
        <div>
        <p>Manager</p>
        </div>
        );
      }else {
        return(
        <div>
        <p>Member</p>
        </div>);
      }
    }


render() {
  return(
            <div style={{ background: '#ECECEC', padding: '30px' }}>
            return<Card bordered={false} style={{ width: 700, left:500 }}>
           <InputNumber min={1} max={500}  onChange={this.onChange.bind(this)} value={this.x}/>
           </Card>
            {this.state.a.map(element => {
            return<Card bordered={false} style={{ width: 700, left:500 }}>

            <p>Name:{element.data.name}</p>
            {this.subComponent(element.data.role)}
            <Select defaultValue={role(element)}
            style={{ width: 120 }}
             dropdownRender={menu => (
             <div>
             {menu}
              <Divider style={{ margin: '4px 0' }} />
             <div style={{ padding: '8px', cursor: 'pointer' }}>
              <Icon type="plus" /> Add item
             </div>
              </div>
              )}
               >
              <Option value="manager" onClick={()=>this.handle('2',element.id)}>Manager</Option>
              <Option value="member" onClick={()=>this.handle('3',element.id)}>Member</Option>
              </Select>
              </Card>
            })
          }
          </div>
  );
}
}
export default Roleid 
