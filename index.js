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
    .document('Leave/{LeaveId}')
    .onCreate((snap, context) => {
      const newValue = snap.data();
      const user=newValue['email'];
      const id=newValue['uid'];
      console.log("mail sent");
      return sendEmail(id);
      
    });

getMailList =() => {
  console.log("inside get maillist");
  let mail=[];
  let maillist=[];
  return db.collection('users').doc(id).get()
    .then(member => {
  return db.collection('users').doc(member.data().alignedId).get()
    .then(manager => {
  return db.collection('users').where("organizations","==","gmail").get()
    .then(admin => {
      console.log(admin.data());
      maillist.push(`${manager.data().email}`)
      console.log(maillist);
      maillist.push(`${admin.data().email}`)
      console.log(maillist);
      for(var m = 0; m < maillist.length; m++) {
        const mailOptions = {
          from: '<intern.skript@gmail.com>',
          to: maillist[m],
          subject: 'test',
          text : 'it works'
        }
      }       
      return(mailOptions)     
    })  
    })
    })
}
const getLeavesLeft = () => {
  let leavesLeft= 0;
   return db.collection("organizations").doc("skcript").get()
  .then(day =>{
   leavesLeft=day.data().days
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
              id: doc.id
          })
      
      // else{
      //   console.log("No match")
      // }
      return true
    })
    .catch((error) => {
    console.log("Error getting document:", error);
});
}


const doAction = (body) => {
  var action = body.queryResult.action;
  console.log("dfklkgfdfgiooidfyuioitdfiiy",body,action)
  if( action === 'get_leaves_left' ){
    return getLeavesLeft()
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
    startDate = params.date_period.startDate
    endDate = params.date_period.endDate
    leave_reason = params.leave_reason
    console.log(startDate)
    return getUser(userId)
    .then(email =>{
      console.log(email)
       return updateInfo(email,startDate,endDate,leave_reason)
    })
    .then(mail_success =>{
       return 'Mail request sent successfully. You should be receiving an update shortly!'
    })
    .catch(error =>{
      console.log(error);
    return "Mail error"
    })

  }
  else if( action === 'get_pending_leaves'){
    return getLeavesLeft()
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

function sendEmail(id) {
            var mailOptions= getMailList()
            return transporter.sendMail(mailOptions)
            .then(() => console.log('email sent'))
            .catch((error) => console.error('There was an error while sending the email:', error)); 
         
  }





