import './App.css';
import React, { Component } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './components/Home';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  CssBaseline,
  AppBar,
  Button,
  Toolbar,
  Typography,
  Box,
} from '@material-ui/core';
import theme from './themes/theme';
import GroupList from './components/GroupList';
import GuestList from './components/GuestList';
import Login from './components/Login';
import GuardedRoute from './components/GuardedRoute';
import APIURL from './helpers/environment';

interface MyState {
  value: number;
  open: boolean;
  isAuthenticated: boolean;
  username: string;
  path: string;
  location: string;
  role: string;
}

interface MyProps {
  location: string;
}

class App extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      open: false,
      isAuthenticated: false,
      username: '',
      path: '/guests',
      location: '',
      role: '',
    };
  }
  componentDidMount() {
    this.getRole();
  }
  getRole = () => {
    if (localStorage.getItem('token')) {
      this.setState({ isAuthenticated: true });

      fetch(`${APIURL}/user/role`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            role: res.role,
            username: res.username,
          });
        });
    }
  };
  setPath = (path) => () => this.setState({ path: path });

  logIn = () => {
    this.getRole();
    this.setState({ isAuthenticated: true }, () => {
      return (
        <Redirect
          to={{
            pathname: this.state.path,
            state: { role: this.state.role },
          }}
          from='/login'
        />
      );
    });
  };

  handleLogOut = () => {
    localStorage.clear();
    this.setState({ isAuthenticated: false, role: '' });
  };
  render() {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {this.props.location === '/' ? null : (
          <AppBar position='sticky'>
            <Toolbar
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <Box style={{ display: 'flex' }}>
                <Link
                  to='/'
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    style={{
                      color: 'white',
                      marginRight: '32px',
                    }}
                  >
                    Home
                  </Typography>
                </Link>
                <Link
                  to='/guests'
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    style={{
                      color: 'white',
                      marginRight: '32px',
                    }}
                  >
                    Guests
                  </Typography>
                </Link>
                <Link
                  to='/groups'
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  <Typography
                    variant='subtitle1'
                    style={{
                      color: 'white',
                      marginRight: '32px',
                    }}
                  >
                    Groups
                  </Typography>
                </Link>
              </Box>
              <Box>
                {this.state.isAuthenticated ? (
                  <Button onClick={this.handleLogOut}>
                    <Typography
                      variant='body1'
                      style={{
                        color: 'white',
                        marginRight: '8px',
                      }}
                    >
                      {this.state.username}
                    </Typography>
                    <Typography
                      variant='subtitle1'
                      style={{
                        color: 'white',
                      }}
                    >
                      (Logout)
                    </Typography>
                  </Button>
                ) : null}
              </Box>
            </Toolbar>
          </AppBar>
        )}

        <Switch>
          <GuardedRoute
            path='/guests'
            component={GuestList}
            auth={this.state.isAuthenticated}
            setPath={this.setPath}
            role={this.state.role}
          />
          <GuardedRoute
            path='/groups'
            component={GroupList}
            auth={this.state.isAuthenticated}
            setPath={this.setPath}
            role={this.state.role}
          />
          <Route
            path='/login'
            render={() => (
              <Login auth={this.state.isAuthenticated} loginFunc={this.logIn} />
            )}
          />
          <Route path='/' exact component={Home} />
        </Switch>
      </ThemeProvider>
    );
  }
}

export default App;
