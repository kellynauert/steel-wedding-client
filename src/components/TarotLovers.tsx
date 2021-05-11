import React, { Component } from 'react';
import { CardContent, Typography, Box } from '@material-ui/core/';
import image from '../assets/wedding.png';
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
            The Lovers
          </Typography>
        </Box>
        <img
          src={image}
          alt='skeleton lovers'
          style={{ mixBlendMode: 'multiply', border: '#783426 6px solid' }}
        ></img>
        <div
          style={{
            mixBlendMode: 'multiply',
            border: '#783426 6px solid',
            padding: '10px',
            borderTop: 'none',
            marginTop: '-5px',
          }}
        >
          <Typography variant='h1' align='center'>
            Kelly & Blake
          </Typography>
        </div>
      </CardContent>
    );
  }
}

export default TarotLovers;
