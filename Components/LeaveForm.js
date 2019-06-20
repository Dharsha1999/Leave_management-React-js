import React from 'react';
import firebase from '../Config/Firebase';
import { Form, DatePicker,Input, Button, Checkbox, message, Card } from 'antd';
const { RangePicker } = DatePicker;
var db = firebase.firestore();

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

class LeaveForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
    submit: true,
  };
}
back =() =>{
    this.setState({
      submit: true,
    })
  }
  handleSubmit = e => {
    e.preventDefault();
   

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {console.log("error");
        return;
      }
      // Should format date value before submit.
      const rangeValue = fieldsValue['range'];
      const values = {
        ...fieldsValue,
        'range': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')] };
        console.log(values);
        console.log(values.range[1]);
        var b=localStorage.getItem('uid');
        var d=localStorage.getItem('email');
        console.log(b);
        var a= ""+values.range[0];
        var c=""+values.range[1];

        db.collection("Leave").add({
           uid: b,
           email:d,
           name: values.username,
           reason: values.reason,
           start :a,
           end : c,
           status: "-",
         })
          this.setState({
              submit: false,
            });
    });
    
  };

render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const rangeConfig = {
          rules: [{ type: 'array', required: true, message: 'Please select the dates!' }],
        };
        if(this.state.submit){

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>

      <Form.Item {...formItemLayout} label="Name">
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: 'Please input your name',
                    },
                  ],
                })(<Input placeholder="Please input your name" />)}
         </Form.Item>
         <Form.Item {...formItemLayout} label="Reason">
                   {getFieldDecorator('reason', {
                     rules: [
                       {
                         required: true,
                         message: 'Please input your reason for leave',
                       },
                     ],
                   })(<Input placeholder="Please input your reason for leave" />)}
          </Form.Item>
        <Form.Item label="RangePicker">
          {getFieldDecorator('range', rangeConfig)(<RangePicker />)}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

    );
  }
  else{
    message.success("Your responses have been recorded")
    return<Card
      hoverable
      style={{width: 500,left: 500 }}
    >
    <p><center><b> YOUR RESPONSES HAVE BEEN RECORDED</b></center></p>
    <Button type="primary" onClick={()=>this.back()}><center>back</center></Button>

    </Card>

  }

  }
}


export default Form.create()(LeaveForm)