//@ts-nocheck
import React, { Component, useState } from 'react';
import { Card, Grid, Typography, CardContent, Box } from '@material-ui/core/';
import image from '../../assets/flowers.svg';

import { Link } from 'react-router-dom';
import BottomNav from './BottomNav';
const Home = () => {
  let wedding = new Date('05/28/2022');
  let daysLeft = Math.round(
    (wedding.getTime() - Date.now()) / (1000 * 3600 * 24)
  );

  return (
    <>
      <Box p={1}>
        <Grid container>
          <Grid item xs></Grid>
          <Grid
            container
            item
            spacing={1}
            md={6}
            lg={4}
            style={{ textAlign: 'center' }}
          >
            <Grid item xs={12}>
              <Card style={{ marginBottom: '56px' }}>
                <CardContent>
                  <Box mb={1}>
                    <Typography variant='h6'>please join</Typography>
                    <Typography variant='h1'>
                      Kelly Nauert <br></br>& Blake Steel
                    </Typography>
                    <Typography variant='h3'>28 May 2022 - 5:00pm</Typography>
                  </Box>

                  <Box display='flex' justifyContent='center' p={6}>
                    <img
                      src={image}
                      alt='castle'
                      style={{ height: '50vh' }}
                    ></img>
                  </Box>
                  <div>
                    <Typography variant='h6'>for their wedding</Typography>
                    <Typography variant='h2'>Clayshire Castle</Typography>

                    <Typography variant='h3'>
                      <Link
                        href='https://www.google.com/maps/place/Clayshire+Castle/@39.3977577,-86.9491932,17z/data=!3m1!4b1!4m8!3m7!1s0x886d03b30c742ead:0xf7939cd9d84be637!5m2!4m1!1i2!8m2!3d39.3977536!4d-86.9470045'
                        target='_blank'
                        style={{ color: 'inherit', textDecoration: 'none' }}
                      >
                        8780 E County Rd 75 N
                        <br />
                        Bowling Green, IN 47833
                      </Link>
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>{' '}
          <Grid item xs></Grid>
        </Grid>
      </Box>
      <BottomNav />
    </>
  );
};
export default Home;
