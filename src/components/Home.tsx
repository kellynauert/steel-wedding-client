import React, { Component } from 'react';
import { Card, Grid } from '@material-ui/core/';
import TarotWedding from './TarotWedding';
import TarotLovers from './TarotLovers';
import TarotGuests from './TarotGuests';
import ReactCardCarousel from 'react-card-carousel';
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
          backgroundColor: '#1d0c3b',
          height: '100vh',
        }}
      >
        <Background />
        <ReactCardCarousel spread='wide' style={{ cursor: 'pointer' }}>
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
        </ReactCardCarousel>
      </Grid>
    );
  }
}

export default Home;
