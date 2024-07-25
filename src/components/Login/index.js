import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    isError: false,
  };

  onChangeUsername = event => {
    this.setState({ username: event.target.value });
  };

  onChangePassword = event => {
    this.setState({ password: event.target.value });
  };

  onSubmitForm = async event => {
    event.preventDefault();
    const { username, password } = this.state;
    const userDetails = {
      username,
      password,
    };
    const url = 'https://apis.ccbp.in/login';
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      this.onSuccessLogin(data.jwt_token);
    } else {
      this.onFailureLogin(data);
    }
    console.log('Logged In');
  };

  onSuccessLogin = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    this.props.navigate('/');
  };

  onFailureLogin = data => {
    this.setState({ isError: true, errorMsg: data.error_msg });
  };

  render() {
    const { isError, password, username, errorMsg } = this.state;
    const jwtToken = Cookies.get('jwt_token');
    if (jwtToken !== undefined) {
      return <Navigate to="/" />;
    }

    return (
      <div className="bgLogin">
        <form onSubmit={this.onSubmitForm} className="login">
          <img
            className="loginLogo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <div className="inputCont">
            <label className="labelPara" htmlFor="username">
              USERNAME
            </label>
            <input
              value={username}
              onChange={this.onChangeUsername}
              id="username"
              className="inputBox"
              placeholder="Username"
              type="text"
            />
          </div>
          <div className="inputCont">
            <label className="labelPara" htmlFor="password">
              PASSWORD
            </label>
            <input
              value={password}
              onChange={this.onChangePassword}
              id="password"
              className="inputBox"
              placeholder="Password"
              type="password"
            />
          </div>
          <button className="loginBtn" type="submit">
            Login
          </button>
          {isError && <p className="errorLogin">*{errorMsg}</p>}
        </form>
      </div>
    );
  }
}

const LoginWithRouter = (props) => {
  const navigate = useNavigate();
  return <Login {...props} navigate={navigate} />;
};

export default LoginWithRouter;
