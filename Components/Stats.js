import React, { Component } from 'react';
import firebase from '../Config/Firebase';
import moment from 'react-moment';
import { Progress, Card } from 'antd';
var db = firebase.firestore();
class Stats extends Component {
	constructor(props){
    super(props);
    this.state = {
     a: [],
     b: [],
     now: 0,
     end: 0,
     duration: 0,
     days: 0,
   };
    
   }
	componentDidMount(){
    let temp=[];
    let temp1=[];
   db.collection("Leave").where('uid',"==",localStorage.getItem('uid')).get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
      	       if(doc.status==="Approved"){
      	       var l=temp.push({data:doc.data(),id:doc.id});
      	   }
        });

      this.setState({
          a: temp,
      });
   });
   db.collection("Organizations").get().then(querySnapshot => {
   	querySnapshot.forEach(doc => {
   		var m= temp1.push({data:doc.data});
   	});
   	this.setState({
   		b: temp1,

   	});
   });
   {this.state.a.map(element => {
			this.setState({
				now: element.data.start,
			    end: element.data.end,
				duration: moment.duration(this.end.diff(this.now)),
				days: this.duration.asDays() ,
			});
			})
    }
}
render(){
return<Card
        hoverable
         style={{width: 500,left: 500 }}
         bordered={false}>
         {this.state.b.map(element => {
         	return(
         <p>Total no of days:{element.days}</p>
         )
     })
 }
<Progress type="circle" percent= {this.state.days} format={percent => `${this.state.days} Days`} />
<Progress type="circle" percent={100} format={() => 'Done'} />
 </Card>    
}
}  

export default Stats