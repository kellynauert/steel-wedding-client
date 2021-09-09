//@ts-nocheck
import React, { Component, useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  FormControlLabel,
  Checkbox,
  AppBar,
} from '@material-ui/core/';
import bg from '../assets/bg.png';
import search from '../assets/magg.png';
import floret from '../assets/floret.svg';
import floretLeft from '../assets/floretleft.svg';
import GuestComponent from './GuestComponent';
import { Group, Guest } from '../interfaces';
import APIURL from '../helpers/environment';
var _ = require('lodash');

interface MyState {
  groups: Group[];
  search: string[] | null;
  searchTerm: string;
  open: boolean;
  group: Group;
  invite: boolean;
  address: string | null;
  mobile: boolean;
}

const Rsvp: React.FC<MyState> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({});
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState(false);
  const [address, setAddress] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const handleClose = () => setOpen(false);
  const handleOpen = (group) => () => {
    console.log(group);
    setOpen(true);
    setGroup(group);
    setInvite(group.address === null ? false : true);
    setAddress(group.address === null ? null : group.address);
  };

  useEffect(() => {
    fetchGroupList();
    if (window.screen.width <= 768) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, []);

  const inviteFunc = (e) => {
    if (invite === true) {
      fetch(`${APIURL}/group/${group.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          address: null,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      })
        .then((res) => res.json())
        .then(() => {
          fetchGroupList();
        })
        .then(() => setAddress(''));
    }
    setInvite(e.target.checked);
  };

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

  const saveGroup = (e) => {
    fetch(`${APIURL}/group/${group.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        [e.target.id]: e.target.value,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchGroupList();
      });
  };

  return (
    <>
      <Dialog
        fullScreen={mobile}
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogContent className='cardBack'>
          {open === false ? null : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card style={{ borderRadius: '4px' }}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant='h2'>{group.groupName}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id='phone'
                          label='Phone Number'
                          defaultValue={group.phone}
                          variant='outlined'
                          onChange={saveGroup}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name='invite'
                              onChange={(e) => inviteFunc(e)}
                              checked={invite}
                            />
                          }
                          label='Opt in to physical invite'
                        />
                      </Grid>
                      {invite ? (
                        <Grid item xs={11}>
                          <TextField
                            fullWidth
                            label='Address'
                            disabled={!invite}
                            id='address'
                            defaultValue={address}
                            variant='outlined'
                            onChange={saveGroup}
                          />
                        </Grid>
                      ) : null}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              {group.guests.map((guest, index) => {
                return (
                  <GuestComponent
                    groupId={group.id}
                    guest={guest}
                    fetchGroupList={fetchGroupList}
                    key={guest.id}
                  />
                );
              })}
            </Grid>
          )}
        </DialogContent>
        <DialogActions style={{ background: 'rgba(255,255,255,.2)' }}>
          <Typography variant='subtitle2' style={{ color: 'white' }}>
            Changes saved automatically
          </Typography>
          <Button onClick={handleClose} color='primary' variant='contained'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Box p={1} style={{ height: '100vh' }}>
        <AppBar variant='outlined' color='secondary'>
          <Box mb={1} p={1} width='100%'>
            <Typography variant='h3' align='center'>
              RSVP
            </Typography>

            <TextField
              fullWidth
              variant='outlined'
              placeholder='Search here'
              onChange={_.debounce(handleChange, 300)}
            />
          </Box>
        </AppBar>
        <Grid container spacing={1}>
          {searchFunction().map((group, index) => {
            return (
              <Grid item xs={12} key={group.id}>
                <Card
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={handleOpen(group)}
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
                      <Grid item container xs={10} spacing={2}>
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
      </Box>
    </>
  );
};
export default Rsvp;
