//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Card,
  Box,
  Grid,
  Typography,
  CardContent,
  Drawer,
  Link,
  Button,
} from '@material-ui/core/';
import image from '../../assets/flowers.svg';

import BottomNav from './BottomNav';
import Rsvp from './Rsvp';
import { makeStyles } from '@material-ui/core/styles';

const Home = ({ mobile, dimensions }) => {
  const [drawerWidth, setDrawerWidth] = useState(dimensions.width * 0.3);
  useEffect(() => {
    setDrawerWidth(dimensions.width * 0.3);
  }, [dimensions]);
  useEffect(() => {
    console.log(drawerWidth);
  }, [drawerWidth]);
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginRight: drawerWidth,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      backgroundColor: theme.base.palette.primary.light,
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      backgroundColor: 'white',
      padding: theme.spacing(3),
      textAlign: 'center',
      marginBottom: '56px',
    },
  }));
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <main
        className={classes.content}
        component='main'
        item
        container
        spacing={1}
        xs={12}
      >
        <Card variant='outlined' style={{ border: 'none' }}>
          <CardContent>
            <Grid container spacing={8} style={{ padding: '16px' }}>
              <Grid item xs={12}>
                <Typography variant='h6'>please join</Typography>
                <Typography variant='h1'>
                  Kelly Nauert <br></br>& Blake Steel
                </Typography>
                <Typography variant='h6'>for their wedding</Typography>
              </Grid>
              <Grid item xs={12} style={{ marginBottom: '24px' }}>
                <img src={image} alt='castle' style={{ height: '50vh' }}></img>
              </Grid>{' '}
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Location
                </Typography>

                <Typography variant='body2'>
                  Clayshire Castle
                  <br />
                  8780 E County Rd 75 N
                  <br />
                  Bowling Green, IN 47833
                </Typography>
                <br />
                <Link
                  href='https://www.google.com/maps/place/Clayshire+Castle/@39.3977577,-86.9491932,17z/data=!3m1!4b1!4m8!3m7!1s0x886d03b30c742ead:0xf7939cd9d84be637!5m2!4m1!1i2!8m2!3d39.3977536!4d-86.9470045'
                  target='_blank'
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {' '}
                  <Button variant='outlined' color='secondary'>
                    View in Google Maps
                  </Button>
                </Link>
              </Grid>{' '}
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Date & Time
                </Typography>
                <Typography variant='body2'>Saturday, May 28th 2022</Typography>
                <Typography variant='body2'>Ceremony at 5:00 PM</Typography>
                <br />
                <Link
                  href='https://calendar.google.com/event?action=TEMPLATE&tmeid=MGhsMmhwcHUxM2I4bGozcjJqNTZydXJ1cDQga2VsbHluYXVlcnRAbQ&tmsrc=kellynauert%40gmail.com'
                  target='_blank'
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {' '}
                  <Button variant='outlined' color='secondary'>
                    Add to Calendar{' '}
                  </Button>
                </Link>
                <br /> <br />
                <Typography variant='caption'>
                  The Castle can be difficult to find, please give yourself
                  plenty of extra time to arrive. Guests will be accepted
                  starting at 4:30.
                </Typography>
              </Grid>{' '}
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Dress Code
                </Typography>
                <Typography variant='body2'>Semi-formal</Typography>
                <Typography variant='caption'>
                  Ceremony is indoors, with optional reception activities
                  outdoors in the grass.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Registry
                </Typography>
                <Typography variant='caption'>
                  We are registered at Target and Amazon through Zola.
                </Typography>{' '}
                <br />
                <br />
                <Link
                  href='https://www.zola.com/registry/nauertsteelwedding'
                  target='_blank'
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  {' '}
                  <Button variant='outlined' color='secondary'>
                    Visit Zola
                  </Button>
                </Link>
              </Grid>{' '}
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Covid Protocol
                </Typography>
                <Typography variant='body2'>
                  All guests aged 5+ must be fully vaccinated.
                </Typography>
                <Typography variant='caption'>
                  As of 2/27/2022 masks are not required. Boosters are strongly
                  recommended.
                </Typography>{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Reception
                </Typography>
                <Typography variant='body2'>5:30 PM-11:45 PM</Typography>
                <Typography variant='caption'>
                  Reception will include dinner, games, and (a little) dancing.
                  We encourage you to bring your favorite games along!
                </Typography>{' '}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant='h2' style={{ marginBottom: '8px' }}>
                  Lodging
                </Typography>
                <Typography variant='caption'>
                  The closest town is a 30+ minute drive away, towards
                  Indianapolis, and is called Cloverdale. There are several
                  lodging options available there: <br />
                  <Link
                    href='https://goo.gl/maps/ySYfaWbMNRRh7vTp9'
                    target='_blank'
                    color='secondary'
                  >
                    Motel 6
                  </Link>{' '}
                  <br />
                  <Link
                    href='https://g.page/holiday-inn-express-cloverdale?share'
                    target='_blank'
                    color='secondary'
                  >
                    Holiday Inn Express
                  </Link>{' '}
                  <br />
                  <Link
                    href='https://goo.gl/maps/8iCfQRxUEMfqgFUG6'
                    target='_blank'
                    color='secondary'
                  >
                    Econo Lodge
                  </Link>{' '}
                  <br />
                  <Link
                    href='https://goo.gl/maps/VTmRHskUaDNfuUhL9'
                    target='_blank'
                    color='secondary'
                  >
                    Days Inn by Wyndham
                  </Link>{' '}
                  <br />
                  <br /> The Indy 500 is the following day, so if you plan to
                  stay closer to Indianapolis you should book your hotel as
                  early as possible.
                  <br />
                </Typography>{' '}
              </Grid>{' '}
            </Grid>
          </CardContent>
        </Card>
      </main>
      {!mobile ? (
        <Drawer
          className={classes.drawer}
          variant='permanent'
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor='right'
        >
          <Grid container>
            <Rsvp />
          </Grid>
        </Drawer>
      ) : (
        <BottomNav />
      )}{' '}
    </Box>
  );
};
export default Home;
