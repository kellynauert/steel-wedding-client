//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Typography,
  TextField,
  AppBar,
  Box,
  Paper,
} from '@material-ui/core/';

import APIURL from '../../helpers/environment';
import BottomNav from './BottomNav';
import CardSelect from './CardSelect';
import { makeStyles } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';

const Rsvp = ({ mobile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({});
  const [open, setOpen] = useState(false);

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
  const useStyles = makeStyles((theme) => ({
    drawerPaper: {
      backgroundColor: theme.base.palette.primary.light,
      height: '100vh',
      maxHeight: '100vh',
      overflowY: 'scroll',
      width: '100%',
    },
  }));
  const classes = useStyles();

  return (
    <Paper className={classes.drawerPaper} elevation={0}>
      {!mobile ? <Redirect to='/' /> : null}
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
      <AppBar
        color='transparent'
        position='sticky'
        variant='outlined'
        style={{
          top: '0',
          width: '100%',
          border: 'none',
          backgroundColor: '#f3d2dc',
          borderBottom: '1px solid #E3D3D6',
        }}
      >
        <Grid container style={{ padding: '16px' }}>
          <Grid item xs={12}>
            <Typography variant={mobile ? 'h3' : 'h1'} align='center'>
              RSVP
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
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
        style={{
          overflow: 'hidden',
          padding: '16px',
          margin: '0',
          width: '100%',
          paddingBottom: '64px',
        }}
      >
        {searchFunction().map((group, index) => {
          return (
            <Grid item xs={12} key={group.id}>
              <Card
                variant='outlined'
                onClick={() => handleOpen(group)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: '16px',
                }}
              >
                <Grid
                  container
                  spacing={1}
                  style={{
                    display: 'flex',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    minHeight: '100px',
                    width: '100%',
                    border: '1px #E3D3D6 solid',
                  }}
                >
                  <Grid item container xs={12} spacing={1}>
                    {group.guests
                      .sort((a, b) => a.id - b.id)
                      .map((guest, i) => {
                        return (
                          <Grid
                            item
                            xs
                            style={{ minWidth: '50%' }}
                            key={guest.id}
                          >
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
                </Grid>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {mobile ? <BottomNav /> : null}
    </Paper>
  );
};
export default Rsvp;
