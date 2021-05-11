import React, { Component } from 'react';
import { CardContent, Typography, Box, Link } from '@material-ui/core/';
import image from '../assets/castle.png';
import bg from '../assets/bg.png';

class TarotLovers extends Component {
  render() {
    return (
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
            <Link
              href='https://www.google.com/maps/place/Clayshire+Castle/@39.3977605,-86.9487145,17.34z/data=!4m8!3m7!1s0x886d03b30c742ead:0xf7939cd9d84be637!5m2!4m1!1i2!8m2!3d39.3977536!4d-86.9470045'
              target='_blank'
              style={{ color: 'inherit' }}
            >
              8780 E County Rd 75 N
              <br />
              Bowling Green, IN 47833
            </Link>
            <br />
            <br />
            dinner and games to follow
          </Typography>
        </div>
      </CardContent>
    );
  }
}

export default TarotLovers;
