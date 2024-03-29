//@ts-nocheck
import './App.css';
import React, { useState, useEffect } from 'react';
import { Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './components/ConvertedComponents/Home';
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
import Login from './components/Login';
import GuardedRoute from './components/GuardedRoute';
import APIURL from './helpers/environment';
import Rsvp from './components/ConvertedComponents/Rsvp';

import GuestList from './components/GuestList';
function debounce(fn, ms) {
  let timer;
  return (_) => {
    clearTimeout(timer);
    timer = setTimeout((_) => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
const App = ({ location }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [path, setPath] = useState('/guests');
  const [role, setRole] = useState('');
  const [mobile, setMobile] = useState(false);
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    console.log(dimensions);
    if (dimensions.width <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [dimensions]);
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }, 300);

    window.addEventListener('resize', debouncedHandleResize);

    return (_) => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  });
  useEffect(() => {
    getRole();
  }, []);

  const getRole = () => {
    if (localStorage.getItem('token')) {
      setIsAuthenticated(true);

      fetch(`${APIURL}/user/role`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((res) => {
          setRole(res.role);
          setUsername(res.username);
        });
    }
  };
  const logIn = () => {
    getRole();
    setIsAuthenticated(true);
  };

  const handleLogOut = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {location === '/guests' || location === '/groups' ? (
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
              {isAuthenticated ? (
                <Button onClick={handleLogOut}>
                  <Typography
                    variant='body1'
                    style={{
                      color: 'white',
                      marginRight: '8px',
                    }}
                  >
                    {username}
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
      ) : null}

      <Switch>
        <GuardedRoute
          path='/guests'
          component={GuestList}
          auth={isAuthenticated}
          setPath={setPath}
          role={role}
        />
        <GuardedRoute
          path='/groups'
          component={GroupList}
          auth={isAuthenticated}
          setPath={setPath}
          role={role}
        />
        <Route
          path='/login'
          render={() => <Login auth={isAuthenticated} loginFunc={logIn} />}
        />
        <Route path='/rsvp' render={() => <Rsvp mobile={mobile} />} />
        <Route
          path='/'
          exact
          render={() => <Home mobile={mobile} dimensions={dimensions} />}
        />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
