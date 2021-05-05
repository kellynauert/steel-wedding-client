import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
interface MyProps {
  component: React.ComponentType;
  auth: boolean;
  path: string;
  setPath: (path: string) => void;
  role: string;
}
interface MyState {}
class GuardedRoute extends Component<MyProps, MyState> {
  render() {
    if (this.props.auth) {
      return (
        <Route
          path={this.props.path}
          render={() => <this.props.component {...this.props} />}
        />
      );
    } else {
      this.props.setPath(this.props.path);
      return <Redirect to='/login' />;
    }
  }
}
export default GuardedRoute;
