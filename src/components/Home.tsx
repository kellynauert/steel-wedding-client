import React, { Component } from 'react';
import { Card, Grid } from '@material-ui/core/';
import TarotWedding from './TarotWedding';
import TarotLovers from './TarotLovers';
import TarotGuests from './TarotGuests';
import Background from './Background';
class Home extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      width: window.screen.width <= 768 ? '90vw' : '25vw',
    };
  }
  componentDidMount() {
    console.log(window.screen.width);
    if (window.screen.width <= 768) {
      this.setState({ width: '100vw' });
    }
  }
  render() {
    return (
      <Grid
        container
        style={{
          backgroundColor: 'rgb(37, 14, 44)',
          height: '100vh',
        }}
      >
        {/* <Background /> */}
        <Card elevation={12} style={{ width: this.state.width }}>
          <TarotLovers />
        </Card>
        <Card elevation={12} style={{ width: this.state.width }}>
          <TarotWedding />
        </Card>
        <Card
          elevation={12}
          style={{
            width: this.state.width,
          }}
        >
          <TarotGuests />
        </Card>
      </Grid>
    );
  }
}

export default Home;
