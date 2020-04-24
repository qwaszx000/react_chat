import React from 'react';
import Cookies from 'js-cookie';
import $ from 'jquery';
import './header.css';

class Header extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			loginFormType: ""
		}

		this.turnFormToLogin = this.turnFormToLogin.bind(this);
		this.turnFormToRegister = this.turnFormToRegister.bind(this);
		this.submitForm = this.submitForm.bind(this);
		this.logoutUser = this.logoutUser.bind(this);
		this.addUserToChat = this.addUserToChat.bind(this);
	}
	
	render(){
		return(
			<header>
				<nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
					{Cookies.get("user_cookie") !== undefined ||
						<a className="nav-link text-white" href="#" onClick={this.showLoginForm}>Login/Register</a>
					}
					{Cookies.get("user_cookie") &&
						<a className="nav-link text-white" href="#" onClick={this.logoutUser}><small>Your id: {this.props.userID}</small> Logout</a>
					}
					<a className="navbar-brand" href="#">KWASMESSENGER</a>
					<div className="dropdown">
						<button className="btn dropdown-toggle" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span className="navbar-toggler-icon"></span></button>
						<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu">
							<div className="dropdown-item addUser bg-white">
								<form className="form-inline addUserForm">
									<input type="text" name="user_id" className="" placeholder="user id"/>
									<button onClick={this.addUserToChat}>Add user</button>
								</form>
							</div>
						</div>
					</div>
				</nav>
				<form className="loginForm border">
					{Cookies.get("user_cookie") ||
						<div className="login-register">
							<button className="btn btn-primary" onClick={this.turnFormToLogin}>Login</button>
							<button className="btn btn-secondary" onClick={this.turnFormToRegister}>Register</button><br/>
						</div>
					}
					<div className="loginType">
						<input type="text" name="login" placeholder="login" className="input"/>
						<input type="text" name="password" placeholder="password" className="input"/>
					</div>
					<div className="registerType">
						<input type="text" name="login" placeholder="login" className="input"/>
						<input type="text" name="password" placeholder="password" className="input"/>
					</div>
					<button className="btn btn-success" onClick={this.submitForm}>Submit</button>
				</form>
				<div className="alert alert-dismissible alert_hide">
					<a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
					<strong></strong>
				</div>
			</header>
		);
	}

	addUserToChat(event){
		event.preventDefault();
		this.props.addUserToChat($(".addUserForm input").val());
	}

	showLoginForm(event){
		//show form
		event.preventDefault();
		$(".loginForm").toggle();
	}

	turnFormToLogin(event){
		//change form to login type
		var state = this.state;
		event.preventDefault();
		$(".loginForm .registerType").hide();
		$(".loginForm .registerType").attr('id', '');
		$(".loginForm .loginType").show();
		$(".loginForm .loginType").attr('id', 'active');
		state.loginFormType = "login";
		this.setState(state);
	}

	turnFormToRegister(event){
		//change form to register type
		var state = this.state;
		event.preventDefault();
		$(".loginForm .loginType").hide();
		$(".loginForm .loginType").attr('id', '');
		$(".loginForm .registerType").show();
		$(".loginForm .registerType").attr('id', 'active');
		state.loginFormType = "register";
		this.setState(state);
	}

	submitForm(event){
		if(this.state.loginFormType === ""){
			return 0;
		}
		//convert inputs to json {name: value}
		function getJSONFromInputs(array){
			var json = {};
			for (var i = 0; i < array.length; i++) {
				var input = array[i];

				json[input.name] = input.value;
			}
			return json;
		}
		
		event.preventDefault();
		//get form data
		const form = $(".loginForm");
		const form_inputs = $(".loginForm #active input");
		//convert it to json
		const json_inputs = getJSONFromInputs(form_inputs);
		//sent data to server
		$.ajax({
	      url: "http://localhost:8080/" + this.state.loginFormType,
	      type: "post",
	      async: false,
	      data: json_inputs,
	      error: (jqXHR, textStatus, error) => {
	        console.log(textStatus + " / " + error + " / " + jqXHR.status);
	      },
	      success: function(res){
	      	if(res.code >= 0){
	      		Cookies.set("user_cookie", res.cookie);
	      		$('.alert_hide').removeClass("alert-danger");
	      		$('.alert_hide').addClass("alert-success");
	      		$('.alert_hide strong').text(res.msg);
				$('.alert_hide').show();
	      	} else {
	      		$('.alert_hide').removeClass("alert-success");
	      		$('.alert_hide').addClass("alert-danger");
	      		$('.alert_hide strong').text(res.errmsg);
				$('.alert_hide').show();
	      	}
	      }
	    });
		//hide form
		form.hide();

		//update header and app
		this.setState(this.state);
		this.props.updateAppFunction();
	}

	logoutUser(event){
		event.preventDefault();
		Cookies.remove('user_cookie');

		//update header and app
		this.setState(this.state);
		this.props.updateAppFunction();
	}
}

export default Header;