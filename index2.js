const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const firestore = require('firestore');
const admin = require('firebase-admin');
const axios = require("axios");

admin.initializeApp(functions.config().firebase);
let db=admin.firestore();
let transporter = nodemailer.createTransport({
	service :'gmail',
	auth: {
		user:'intern.skript@gmail.com',
		pass: 'intern_skript1',
	}
});
exports.createUser = functions.firestore
    .document('leaveApplications/{LeaveId}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const user=newValue['email'];
      const id=newValue['uid'];
      console.log(id);
      return sendEmail(id);
      
    });

getMailList =(id) => {
  console.log("inside get maillist");
  let mail=[];
  let maillist=[];
  return db.collection('users').doc(id).get()
    .then(member => {
      console.log(member.data().managerId)
  return db.collection('users').doc(member.data().managerId).get()
    .then(manager => {
  return db.collection('users').where("organizations","==","gmail").get()
    .then((querySnapshot)=> {
      querySnapshot.forEach(function(admin) {
        if(admin.data().role ===1){
          console.log("inside role =1")
          console.log(admin.data());
          maillist.push(`${admin.data().email}`)
          maillist.push(`${manager.data().email}`)
          console.log(maillist.length)
           for(var m = 0; m < maillist.length; m++) {
              console.log(maillist[m]);
              var mailOptions = {
              from: '<intern.skript@gmail.com>',
              to: maillist[m],
              subject: 'test',
              html: '<p>Click <a href="http://localhost:3000/signIn">here</p>'
              }
                 
            return transporter.sendMail(mailOptions)
            .then(() => console.log('email sent'))
            .catch((error) => console.error('There was an error while sending the email:', error));               
        } 
      }

      })  
      return;
    })
    })
    })
}

function sendEmail(id) {
  maillist= getMailList(id)
  console.log(maillist)
           
  }
const getLeavesLeft = (email) => {
  let leavesLeft= 0;
   return db.collection("users").where("email","==",email).get()
  .then(user => {
    leavesLeft= user.data().days
    return leavesLeft;

  })
  .catch(error =>{
    console.log(error);
  });
}

const getUser = (userId) => {
  var url = "https://slack.com/api/users.info";
  return axios.get(url, {
    "params":{
    "token": "xoxp-474554372978-572733981253-661848892465-b632411c0a488f3a7eda3ce7d26ba3fd",
    "user": userId,
    }
  }).then(response => {
    console.log(response.data);
    console.log(response.data.user.profile.real_name);
    return response.data.user.profile.email;
  })
}

var fulfillmentTextResponse = (message) =>{
  return {
    fulfillmentText: "message",
    fulfillmentMessages: [
      {
        platform: "SLACK",
        payload: {
          slack: {
            text: message ,
            parse_mode: "Markdown"
          }
        }
      }
    ]
  };
};
updateInfo = (email,startDate,endDate,reason) => {
   let leaveCollection= db.collection("leaveApplications")
   let users= db.collection("users")
   return users.where("email","==", email).get()
    .then(doc => {
      console.log(email);
          console.log(startDate,endDate,doc.id)
          leaveCollection.add({
              start: startDate,
              end: endDate,
              reason: reason,
              uid: doc.id
          })
      console.log("document written successfully")
      return true
    })
    .catch((error) => {
    console.log("Error getting document:", error);
});
}


const doAction = (body) => {
  var action = body.queryResult.action;
  console.log("dfklkgfdfgiooidfyuioitdfiiy",body,action)
  return getUser(userId)
    .then(email =>{
      var mailId= email
      console.log(email)
      return;
    });
  if( action === 'get_leaves_left' ){
    return getLeavesLeft(mailId)
      .then((leavesLeft) => {
    return `You have got *${leavesLeft}* of leaves left. Apply for leave?`     
    })
    .catch(error =>{
      console.log(error);
    return "something's not right"
    })
  }
  else if( action === 'send_leave_request'){
    let userId=body.originalDetectIntentRequest.payload.data.user.id
    console.log("leave req")
    var params =body.queryResult.outputContexts[0].parameters
    console.log(params)
    startDate = new Date(params.date_period.startDate).getTime()
    endDate = new Date(params.date_period.endDate).getTime()
    leave_reason = params.leave_reason
    console.log(startDate)
    return updateInfo(mailId,startDate,endDate,leave_reason)
    .then(mail_success =>{
       return 'Mail request sent successfully. You should be receiving an update shortly!'
    })
    .catch(error =>{
      console.log(error);
    return "Mail error"
    })

  }
  else if( action === 'get_pending_leaves'){
    return getLeavesLeft(mailId)
      .then((leavesLeft) => {
    return `You have got *${leavesLeft}* of leaves left.`     
    })
    .catch(error =>{
      console.log(error);
    return "something's not right"
    })
  }
  else
    return "Error"
  
}
exports.webhook = functions.https.onRequest((req, res) => {
  console.log("inside");
   var message
  let queryBody = req.body;
  doAction(queryBody).then(response =>{
    console.log("inside then")
    return res.json(fulfillmentTextResponse(response))
  })
  .catch(error =>{
          console.log(error);
          return "Final Error"
         });
});







