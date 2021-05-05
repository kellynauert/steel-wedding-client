import React, { Component } from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@material-ui/core/';
import image from '../assets/castle.png';
import bg from '../assets/bg.png';

class TarotLovers extends Component {
  render() {
    return (
      <Grid item xs={12} md={6} lg={3}>
        <Card elevation={3}>
          <CardContent
            style={{
              backgroundImage: `url(${bg})`,
              backgroundSize: '100%',
              backgroundRepeat: 'repeat-y',
            }}
          >
            <Box mb={1}>
              <Typography variant='h3' align='center'>
                The Wedding
              </Typography>
            </Box>
            <img
              src={image}
              alt='castle'
              style={{ mixBlendMode: 'multiply', border: '#438DB6 6px solid' }}
            ></img>
            <div
              style={{
                mixBlendMode: 'multiply',
                border: '#438DB6 6px solid',
                padding: '18px',
                borderTop: 'none',
                marginTop: '-5px',
              }}
            >
              <Typography variant='h2' align='center'>
                14 April 2021 - 5 PM
              </Typography>
              <Typography align='center' variant='subtitle1'>
                <br />
                Clayshire Castle
              </Typography>
              <Typography align='center' variant='body1'>
                8780 E county Rd 75 N
                <br />
                Bowling Green, IN 47833
                <br />
                <br />
                dinner and games to follow
              </Typography>
            </div>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default TarotLovers;
