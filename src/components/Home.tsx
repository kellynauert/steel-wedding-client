import React, { Component } from 'react';
import { Grid, Container } from '@material-ui/core/';
import TarotWedding from './TarotWedding';
import TarotLovers from './TarotLovers';
import TarotGuests from './TarotGuests';
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Container maxWidth={false} style={{}}>
        <Grid container spacing={2}>
          <TarotLovers />
          <TarotWedding />
          <TarotGuests />
        </Grid>
      </Container>
    );
  }
}

export default Home;
