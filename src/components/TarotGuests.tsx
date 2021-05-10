import React, { Component } from 'react';
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
} from '@material-ui/core/';
import bg from '../assets/bg.png';
import search from '../assets/magg.png';
import floret from '../assets/floret.svg';
import floretLeft from '../assets/floretleft.svg';
import GuestComponent from './GuestComponent';
import { Group, Guest } from '../interfaces';
import APIURL from '../helpers/environment';

interface MyState {
  groups: Group[];
  search: string[] | null;
  searchTerm: string;
  open: boolean;
  group: any;
  invite: boolean;
  address: string | null;
  mobile: boolean;
}

interface MyProps {}

class TarotGuests extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      search: [],
      searchTerm: '',
      open: false,
      group: [],
      invite: false,
      address: null,
      mobile: false,
    };
  }

  handleChange = (e) => {
    this.setState({
      searchTerm: e.target.value,
    });
  };

  searchFunction = () => {
    let items = this.state.groups.sort().filter((item) => {
      let found = false;
      item.guests.forEach((guest: Guest) => {
        let search =
          (guest.firstName ? guest.firstName.toLowerCase() : '') +
          ' ' +
          (guest.lastName ? guest.lastName.toLowerCase() : '');
        if (search.includes(this.state.searchTerm.toLowerCase())) {
          found = true;
        }
      });
      return found;
    });
    return items;
  };

  handleClose = () => this.setState({ open: false });
  handleOpen = (group) => () => {
    console.log(group);
    this.setState({
      open: true,
      group: group,
      invite: group.address === null ? false : true,
      address: group.address === null ? null : group.address,
    });
  };

  componentDidMount() {
    this.fetchGroupList();
    if (window.screen.width <= 768) {
      this.setState({ mobile: true });
    } else {
      this.setState({ mobile: false });
    }
  }
  setInvite = (e) => {
    if (this.state.invite === true) {
      fetch(`${APIURL}/group/${this.state.group.id}`, {
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
          this.fetchGroupList();
        })
        .then(() => this.setState({ address: null }));
    }
    this.setState({ invite: e.target.checked });
  };

  fetchGroupList = () => {
    fetch(`${APIURL}/group/`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((groupData) => this.setState({ groups: groupData }))
      .then(() => {
        this.setState({ group: this.state.group });
      })
      .then(() => console.log(this.state.groups, this.state.group));
  };

  saveGroup = (e) => {
    fetch(`${APIURL}/group/${this.state.group.id}`, {
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
        this.fetchGroupList();
      });
  };

  render() {
    return (
      <>
        <Dialog
          fullScreen={this.state.mobile}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby='form-dialog-title'
        >
          <DialogContent style={{ backgroundColor: 'purple' }}>
            {this.state.open === false ? null : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card style={{ borderRadius: '4px' }}>
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant='h2'>
                            {this.state.group.groupName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            id='phone'
                            label='Phone Number'
                            defaultValue={this.state.group.phone}
                            variant='outlined'
                            onChange={this.saveGroup}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name='invite'
                                onChange={this.setInvite}
                                checked={this.state.invite}
                              />
                            }
                            label='Opt in to physical invite'
                          />
                        </Grid>
                        {this.state.invite ? (
                          <Grid item xs={11}>
                            <TextField
                              fullWidth
                              label='Address'
                              disabled={!this.state.invite}
                              required
                              id='address'
                              defaultValue={this.state.address}
                              variant='outlined'
                              onChange={this.saveGroup}
                            />
                          </Grid>
                        ) : null}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                {this.state.group.guests.map((guest, index) => {
                  return (
                    <GuestComponent
                      groupId={this.state.group.id}
                      guest={guest}
                      fetchGroupList={this.fetchGroupList}
                      key={guest.id}
                    />
                  );
                })}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='primary'>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <CardContent
          style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: '100%',
            backgroundRepeat: 'repeat-y',
          }}
        >
          <Box mb={1}>
            <Typography variant='h3' align='center'>
              RSVP
            </Typography>
          </Box>
          <Box
            style={{
              border: '#602678 6px solid',
              borderBottom: 'none',
              padding: '18px',
            }}
          >
            <Box
              style={{
                height: '100px',
                backgroundImage: `url(${search})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right',
                display: 'flex',
                padding: '16px',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant='body1' align='center'>
                Search your name
              </Typography>

              <TextField
                fullWidth
                placeholder='Search Here'
                onChange={(e) => this.handleChange(e)}
              />
            </Box>
          </Box>
          <Box
            style={{
              border: '#602678 6px solid',
              padding: '18px',
              overflowY: 'scroll',
              overflowX: 'hidden',
              height: '70vh',
              borderRight: 'none',
              marginTop: '-2px',
            }}
          >
            <Typography
              variant='body1'
              align='center'
              style={{ marginBottom: '16px' }}
            >
              Select your card
            </Typography>
            <Grid container spacing={2}>
              {this.searchFunction().map((group, index) => {
                return (
                  <Grid item xs={12} key={group.id}>
                    <Card
                      style={{
                        borderRadius: '0',
                        cursor: 'pointer',
                      }}
                      onClick={this.handleOpen(group)}
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
        </CardContent>
      </>
    );
  }
}

export default TarotGuests;
