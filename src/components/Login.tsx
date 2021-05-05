import React, { Component } from 'react';
import {
  Button,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardActions,
  TextField,
  Grid,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Redirect } from 'react-router-dom';
import APIURL from '../helpers/environment';

interface MyState {
  value: string;
  username: string;
  password: string;
  showPassword: boolean;
  sessionToken: string;
  errorTextUsername: string | undefined;
  errorTextPassword: string | undefined;
  errorUsername: boolean | undefined;
  errorPassword: boolean | undefined;
}
interface MyProps {
  auth: boolean;
  loginFunc: () => void;
}
class Login extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      showPassword: false,
      value: '',
      sessionToken: '',
      errorTextUsername: '',
      errorTextPassword: '',
      errorUsername: false,
      errorPassword: false,
    };
    console.log(this.props);
  }

  updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    this.setState({ sessionToken: newToken }, () => this.props.loginFunc());
  };
  clearToken = () => {
    localStorage.clear();
    this.setState({
      sessionToken: '',
      errorPassword: false,
      errorUsername: false,
    });
  };
  handleErrors = (response) => {
    this.clearToken();
    console.log(response);
    if (response.statusText !== 'User Successfully Logged in!') {
      this.setState({
        errorTextUsername:
          response.field === 'username' ||
          response.statusText === 'username must be unique'
            ? response.statusText
            : '',
        errorTextPassword:
          response.field === 'password' || !response.field
            ? response.statusText
            : '',
        errorPassword:
          response.field === 'password' || !response.field ? true : false,
        errorUsername:
          response.field === 'username' ||
          response.statusText === 'username must be unique' ||
          !response.field
            ? true
            : false,
      });
    } else {
      this.updateToken(response.sessionToken);
    }
  };
  handleSubmit = () => {
    if (!this.state.username || !this.state.password) {
      this.setState({
        errorUsername: !this.state.username ? true : false,
        errorPassword: !this.state.password ? true : false,
        errorTextUsername: !this.state.username ? 'Field Required' : '',
        errorTextPassword: !this.state.password ? 'Field Required' : '',
      });
    } else {
      fetch(`${APIURL}/user/login`, {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((response) => response.json())
        .then((response) => this.handleErrors(response));
    }
  };
  handleRegister = () => {
    if (!this.state.username || !this.state.password) {
      this.setState({
        errorUsername: !this.state.username ? true : false,
        errorPassword: !this.state.password ? true : false,
        errorTextUsername: !this.state.username ? 'Field Required' : '',
        errorTextPassword: !this.state.password ? 'Field Required' : '',
      });
    } else {
      fetch(`${APIURL}/user/create`, {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
          role: 'Standard',
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((response) => response.json())
        .then((response) => this.handleErrors(response));
    }
  };

  handleChange = (prop) => (event) => {
    // @ts-ignore
    this.setState({ [prop]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <>
        {this.props.auth ? (
          <Redirect to='/guests' />
        ) : (
          <Grid
            container
            justify='center'
            alignContent='center'
            style={{ height: '100vh' }}
          >
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <TextField
                    variant='filled'
                    fullWidth
                    label='username'
                    id='username'
                    value={this.state.username}
                    onChange={this.handleChange('username')}
                    helperText={this.state.errorTextUsername}
                    error={this.state.errorUsername}
                  />
                  <TextField
                    variant='filled'
                    fullWidth
                    id='filled-adornment-password'
                    label='password'
                    type={this.state.showPassword ? 'text' : 'password'}
                    onChange={this.handleChange('password')}
                    error={this.state.errorPassword}
                    helperText={this.state.errorTextPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            aria-label='toggle password visibility'
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            edge='end'
                          >
                            {this.state.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CardActions>
                    <Button onClick={this.handleRegister} color='primary'>
                      Register
                    </Button>
                    <Button onClick={this.handleSubmit} color='primary'>
                      Login
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </>
    );
  }
}

export default Login;
