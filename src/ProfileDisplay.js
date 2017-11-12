import React from 'react';
import {FormGroup, ControlLabel, HelpBlock, Clearfix, MenuItem, Navbar} from 'react-bootstrap';
import DateTimePicker from 'react-bootstrap-date-time-picker';
import classNames from 'classnames';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';

export default class ProfileDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user:{}
    };
    this.getUser = this.getUser.bind(this);
  }

  componentWillMount() {
    const {user} = this.props;
    this.getUser(user);
  }

  getUser (username) {
    const self = this;
		fetch(`https://api.github.com/users/${username}`)
		.then((response) => response.json())
		.then((jsonObj) => {
			self.setState({ user: jsonObj });
      console.log(jsonObj);
		});
	}

  render() {

    return <div className="user-profile-view">
        <img className="user-profile-view__img" src={this.state.user.avatar_url}/>
        <hr/>
        <div className="user-profile-view__desc">
          <h2>{this.state.user.login}</h2>
          <h4>{this.state.user.name}</h4>
          <hr/>
          <div className="user-profile-view__desc_item">
            {this.state.user.followers} &nbsp; Followers
          </div>
          <div className="user-profile-view__desc_item">
            {this.state.user.following} &nbsp; Following
          </div>
        </div>
    </div>
  }
}
