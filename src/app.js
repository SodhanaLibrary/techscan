import React from 'react';
import {FormGroup, ControlLabel, HelpBlock, Clearfix, MenuItem, Navbar} from 'react-bootstrap';
import DateTimePicker from 'react-bootstrap-date-time-picker';
import classNames from 'classnames';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import ProfileDisplay from './ProfileDisplay.js';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/react-select/dist/react-select.css'
import './app.css';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      selectedNavItem:'js',
      value:null,
      profileView:false,
      currentUser:null
    }
    this.onSelectTech = this.onSelectTech.bind(this);
    this.sendSearchRequest = this.sendSearchRequest.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.onChange = this.onChange.bind(this);
    this.loadReposOfUser = this.loadReposOfUser.bind(this);
    this.viewProfile = this.viewProfile.bind(this);
  }

  componentWillMount() {
    this.sendSearchRequest('JavaScript');
  }

  sendSearchRequest(str) {
    var myHeaders = new Headers();
    var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default'
             };
    const self = this;
    fetch('https://api.github.com/search/repositories?q='+str, myInit).then(function(response) {
      return response.json();
    }).then(function(resp) {
      self.setState({
        data:resp.items
      });
    });
  }

  loadReposOfUser(user) {
    var myHeaders = new Headers();
    var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default'
             };
    const self = this;
    fetch('https://api.github.com/users/'+user+'/repos', myInit).then(function(response) {
      return response.json();
    }).then(function(resp) {
      self.setState({
        data:resp
      });
    });
  }


  onSelectTech(tec) {
    switch (tec) {
      case 'js':
        this.sendSearchRequest('JavaScript');
        this.setState({
          selectedNavItem:'js',
          value:null
        });
        break;
      case 'java':
        this.sendSearchRequest('java');
        this.setState({
          selectedNavItem:'java',
          value:null
        });
        break;
      case 'python':
        this.sendSearchRequest('python');
        this.setState({
          selectedNavItem:'python',
          value:null
        });
        break;
      case 'php':
        this.sendSearchRequest('php');
        this.setState({
          selectedNavItem:'php',
          value:null
        });
        break;
      case 'ruby':
        this.sendSearchRequest('ruby');
        this.setState({
          selectedNavItem:'ruby',
          value:null
        });
        break;
      default:
    }
  }

  viewProfile(user) {
    this.setState({
      profileView:true,
      currentUser:user
    });
    this.loadReposOfUser(user);
  }

  onChange (value) {
		this.setState({
			value: value,
      selectedNavItem:''
		});
    this.loadReposOfUser(value.login);
	}

  getUsers (input) {
		if (!input) {
			return Promise.resolve({ options: [] });
		}

		return fetch(`https://api.github.com/search/users?q=${input}`)
		.then((response) => response.json())
		.then((json) => {
			return { options: json.items };
		});
	}

  render() {
    return (
      <div>
        <Navbar>
           <Navbar.Header>
             <Navbar.Brand>
               <a href="#">TechScan</a>
             </Navbar.Brand>
           </Navbar.Header>
           <div className="header-nav-search pull-right">
             <Select.Async
               multi={false}
               placeholder="Search ny name"
               loadingPlaceholder="loading..."
               noResultsText="No results found"
               value={this.state.value}
               onChange={this.onChange}
               onValueClick={this.gotoUser}
               valueKey="id"
               labelKey="login"
               loadOptions={this.getUsers}/>
           </div>
        </Navbar>
        <div className="row">
          <div className="col-xs-6 col-md-4">
             {this.state.profileView ? <ProfileDisplay ref={ref => this.profileDisplay = ref} user={this.state.currentUser}></ProfileDisplay> : <div className="list-group">
                 <span href="#" className="list-group-item active">
                     Technologies
                     <span className="pull-right" id="slide-submenu">
                         <i className="fa fa-times"></i>
                     </span>
                 </span>
                 <a onClick={this.onSelectTech.bind(this, 'js')} href="#" className={classNames("list-group-item",{"list-group-item__selected":this.state.selectedNavItem === 'js'})}>
                     <i className="fa fa-comment-o"></i> JavaScript
                 </a>
                 <a onClick={this.onSelectTech.bind(this, 'java')} href="#" className={classNames("list-group-item",{"list-group-item__selected":this.state.selectedNavItem === 'java'})}>
                     <i className="fa fa-search"></i> Java
                 </a>
                 <a onClick={this.onSelectTech.bind(this, 'python')} href="#" className={classNames("list-group-item",{"list-group-item__selected":this.state.selectedNavItem === 'python'})}>
                     <i className="fa fa-user"></i> Python
                 </a>
                 <a onClick={this.onSelectTech.bind(this, 'php')} href="#" className={classNames("list-group-item",{"list-group-item__selected":this.state.selectedNavItem === 'php'})}>
                     <i className="fa fa-folder-open-o"></i> Php
                 </a>
                 <a onClick={this.onSelectTech.bind(this, 'ruby')} href="#" className={classNames("list-group-item",{"list-group-item__selected":this.state.selectedNavItem === 'ruby'})}>
                     <i className="fa fa-bar-chart-o"></i> Ruby
                 </a>
             </div>}
            </div>
          <div className="col-xs-12 col-sm-6 col-md-8">
            {this.state.profileView && this.profileDisplay &&<div className="user-profile-view__repos_data">
               <div>Public repos : {this.profileDisplay.state.user.public_repos}</div>
               <div>Blog : <a href={this.profileDisplay.state.user.blog} target="_blank">{this.profileDisplay.state.user.blog}</a></div>
            </div>}
            <div className="repo-list">
                {this.state.data && this.state.data.map((item) =>
                  <div key={item.id} className="repo-list__item row">
                    <div className="col-xs-7">
                      <a target="_blank" href={item.html_url}><h3>{item.name}</h3></a>
                      <p>{item.description}</p>
                      <div className="repo-list__item__avatar">
                        <span onClick={this.viewProfile.bind(this, item.owner.login)}><img className="repo-list__item__avatar-img" src={item.owner.avatar_url}/></span>
                        &nbsp;<span onClick={this.viewProfile.bind(this, item.owner.login)} className="repo-list__item__avatar-name">{item.owner.login}</span>
                      </div>
                    </div>
                    <div className="col-xs-3">
                      <span className="glyphicon glyphicon-eye-open" aria-hidden="true"></span> <b>{item.forks}</b> Forks
                    </div>
                    <div className="col-xs-2">
                      <span className="glyphicon glyphicon-star" aria-hidden="true"></span> <b>{item.watchers}</b> Stars
                    </div>
                  </div>)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
