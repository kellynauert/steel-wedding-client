//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  TextField,
  AppBar,
} from '@material-ui/core/';
import floret from '../assets/floret.svg';
import floretLeft from '../assets/floretleft.svg';
import APIURL from '../helpers/environment';
import BottomNav from './BottomNav';
import CardSelect from './CardSelect';

const Rsvp = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({});
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);

  const searchFunction = () => {
    let items = groups.sort().filter((item: any) => {
      let found = false;
      item.guests.forEach((guest: Guest) => {
        let search =
          (guest.firstName ? guest.firstName.toLowerCase() : '') +
          ' ' +
          (guest.lastName ? guest.lastName.toLowerCase() : '');
        if (search.includes(searchTerm.toLowerCase())) {
          found = true;
        }
      });
      return found;
    });
    return items;
  };

  const handleOpen = (group) => {
    setOpen(true);
    setGroup(group);
  };

  useEffect(() => {
    fetchGroupList();
    if (window.screen.width <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  const fetchGroupList = () => {
    fetch(`${APIURL}/group/`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((groupData) => setGroups(groupData))
      .then(() => {
        setGroup(group);
      });
  };
  return (
    <Box>
      {open ? (
        <CardSelect
          open={open}
          mobile={mobile}
          group={group}
          setOpen={setOpen}
          fetchGroupList={fetchGroupList}
          setGroup={setGroup}
        />
      ) : null}
      <AppBar color='secondary' position='sticky'>
        <Grid container style={{ padding: '16px' }}>
          <Grid item xs={12}>
            <Typography variant='h3' align='center'>
              RSVP
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size='small'
              variant='outlined'
              placeholder='Search your name here'
              onChange={_.debounce((e) => setSearchTerm(e.target.value), 300)}
            />
          </Grid>
        </Grid>
      </AppBar>
      <Grid
        container
        spacing={1}
        style={{ padding: '16px', margin: '0', width: '100%' }}
      >
        {searchFunction().map((group, index) => {
          return (
            <Grid item xs={12} key={group.id}>
              <Card
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => handleOpen(group)}
              >
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                  mt={1}
                >
                  <img src={floret} style={{ width: '50%' }} alt='' />
                </Box>
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                    style={{
                      display: 'flex',
                      alignContent: 'center',
                    }}
                  >
                    <Grid item xs={1} style={{ display: 'flex' }}>
                      <img src={floretLeft} alt='' />
                    </Grid>
                    <Grid item container xs={10} spacing={1}>
                      {group.guests
                        .sort((a, b) => a.id - b.id)
                        .map((guest, index) => {
                          return (
                            <Grid item xs key={guest.id}>
                              <Typography
                                align='center'
                                style={{
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {guest.firstName} {guest.lastName}
                              </Typography>
                            </Grid>
                          );
                        })}
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      style={{
                        display: 'flex',
                        transform: 'scaleX(-1)',
                      }}
                    >
                      <img src={floretLeft} alt='' />
                    </Grid>
                  </Grid>
                </CardContent>
                <Box
                  mb={1}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <img src={floret} style={{ width: '50%' }} alt='' />
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <BottomNav />
    </Box>
  );
};
export default Rsvp;
