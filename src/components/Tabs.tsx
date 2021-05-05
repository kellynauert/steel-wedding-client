import { AppBar, Button } from '@material-ui/core';
import React, { Component } from 'react';
import GroupList from './GroupList';
import GuestList from './GuestList';
import { Link, Route } from 'react-router-dom';

interface MyState {
  open: boolean;
  value: number;
}
interface MyProps {}

class SimpleTabs extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      open: false,
    };
  }

  handleLogOut = () => {
    localStorage.clear();
  };

  render() {
    return (
      <div>
        <AppBar position='sticky'>
          <Link to='/'>Home</Link>
          <Link to='/guests'>Guests</Link>
          <Link to='/groups'>Guests</Link>
          <Route path='./guests' component={GuestList} />
          <Route path='./groups' component={GroupList} />
          {localStorage.token ? (
            <Button style={{ color: 'white' }} onClick={this.handleLogOut}>
              Logout
            </Button>
          ) : null}
        </AppBar>
      </div>
    );
  }
}
export default SimpleTabs;
