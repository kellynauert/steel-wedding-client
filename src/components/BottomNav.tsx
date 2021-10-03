import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BottomNavigation,
  BottomNavigationAction,
  Typography,
} from '@material-ui/core/';
import sign from '../assets/sign.svg';
import gifts from '../assets/gifts.svg';
import info from '../assets/info.svg';

const BottomNav = () => {
  const pathname = window.location.pathname;

  const [value, setValue] = useState(pathname);
  return (
    <BottomNavigation
      style={{ position: 'fixed', bottom: 0, width: '100%' }}
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      showLabels
    >
      <BottomNavigationAction
        component={Link}
        color='primary'
        value='/rsvp'
        to='/rsvp'
        label={<Typography variant='button'>RSVP</Typography>}
        icon={<img src={sign} height='24px' alt='rsvp' />}
      />
      <BottomNavigationAction
        component={Link}
        to='/'
        value='/'
        label={<Typography variant='button'>Info</Typography>}
        icon={<img src={info} height='24px' alt='info' />}
      />
      <BottomNavigationAction
        // component={Link}
        // to='/signal'
        label={<Typography variant='button'>Gifts</Typography>}
        icon={<img src={gifts} height='24px' alt='gifts' />}
      />
    </BottomNavigation>
  );
};
export default BottomNav;
