import Admin from '../Components/Admin';
import React, { Component } from 'react';
import firebase from '../Config/Firebase';
import Statadmin from '../Components/Statadmin';
import Roleid from '../Components/Roleid';
import Alignid from '../Components/Alignid';
import {Redirect} from 'react-router-dom';
import 'antd/dist/antd.css';
import { Menu, Icon, Switch,Layout } from 'antd';
import { Link, withRouter } from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Dashboardad extends Component {
  constructor(props){
    super(props);
    this.state = {
    collapsed: false,
    path:1,
    logout: false,
  };
}

handle = (value) => {
  {this.setState({
      path: value,
    });
  } 
}
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  page = () => {

if(this.state.path==='1')
      return <Admin/>;
    else if(this.state.path==='2')
      {
        return<Statadmin/>;
      }
    else if(this.state.path==='3')
    {
      return<Roleid/>;
    }
    else if(this.state.path==='4')
    {
      return<Alignid/>;
    }
     
  }
  
  signout = () => {
    firebase.auth().signOut().then(()=> {
      localStorage.removeItem('uid');
      localStorage.removeItem('role');
      localStorage.removeItem('organization');
      localStorage.removeItem('email');
     console.log("signed out");
     this.setState({
       logout: true,
     });
   });
  }
  

  render() {
    const { location } = this.props;
    if(this.state.logout===false){
    return (
      <Layout>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}
        style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
              }}
          >
          <div className="app-logo" />
          <Menu theme="light" mode="inline" selectedKeys={[location.pathname]}>
             <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                Leave
              </span>
            }
          >
            <Menu.Item key="1" onClick={()=>this.handle('1')}>
              <Icon type="form"  className="trigger"/>
              <span>Requests</span>
            </Menu.Item>
            <Menu.Item key="2" onClick={()=>this.handle('2')}>
              <Icon type="check" className="trigger"/>
              <span>Approved/Rejected</span>
            </Menu.Item>
            </SubMenu>
             <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="user" />
                Update
              </span>
            }
          >
            <Menu.Item key="3" onClick={()=>this.handle('3')}>
              <Icon type="bar-chart"  className="trigger"/>
              <span>Change Role</span>
            </Menu.Item>
            <Menu.Item key="4" onClick={()=>this.handle('4')}>
              <Icon type="bar-chart"  className="trigger"/>
              <span>Change Manager</span>
            </Menu.Item>
            </SubMenu>
          <Menu.Item key="5" onClick={this.signout}>
              <Icon type="logout" className="trigger"/>
              <span>Signout</span>
            </Menu.Item>
          </Menu>
        </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
              <Icon
                className="trigger"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
              />
            </Header>
            <Content style={{  marginTop: 0 }}>
            <div style={{ background: '#fff', minHeight: 280 }}>{this.page()}</div>
            </Content>
          </Layout>
        </Layout>
    );
  }
  else {

     
      return<Redirect to="/signIn"/>
  }
  }
}
export default withRouter(Dashboardad)