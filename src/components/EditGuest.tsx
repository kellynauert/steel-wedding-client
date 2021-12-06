//@ts-nocheck
import React, { Component } from 'react';
import {
  Grid,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  DialogContent,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
} from '@material-ui/core/';
import { Guest, Group } from '../interfaces';
import PlusOne from './ConvertedComponents/PlusOne';
import APIURL from '../helpers/environment';

interface MyState {
  firstName: string | null;
  lastName: string | null;
  guest: Guest;
  plusOneAllowed: boolean | null;
  over21: boolean | null;
  groupId: number | null;
  attending: boolean | null;
  open: boolean;
  groups: Group[];
}

interface MyProps {
  guest: Guest;
  fetchGuestList: () => void;
  groups: Group[];
}

class EditGuest extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.guest.firstName,
      lastName: this.props.guest.lastName,
      attending: this.props.guest.attending,
      over21: this.props.guest.over21,
      plusOneAllowed: this.props.guest.plusOneAllowed,
      groupId: this.props.guest.groupId,
      guest: this.props.guest,
      open: false,
      groups: this.props.groups,
    };
  }
  componentDidMount = () => {
    this.setState({ guest: this.props.guest });
  };
  saveGuest = () => {
    fetch(`${APIURL}/guest/master/${this.props.guest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        over21: this.state.over21,
        plusOneAllowed: this.state.plusOneAllowed,
        attending: this.state.attending,
        groupId: this.state.groupId,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    }).then((res) => res.json());
  };
  handleAttendingChange = (e) => {
    if (e.target.name === 'attending' && e.target.value === 'true') {
      if (this.props.guest.plusone) {
        fetch(`${APIURL}/plusone/${this.props.guest.plusone.id}`, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then((response) => console.log(response));
      }
    }

    // @ts-ignore
    this.setState({ [e.target.name]: JSON.parse(e.target.value) }, () => {
      this.saveGuest();
    });
  };

  handleChange = (e) =>
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.checked }, () => {
      this.saveGuest();
    });

  handleTextChange = (e) =>
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.saveGuest();
    });

  handleGroupChange = (event) => {
    this.setState({ groupId: event.target.value }, () => {
      this.saveGuest();
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    return (
      <DialogContent className='cardBack'>
        <Card style={{ borderRadius: '4px' }} id='guestEdit'>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant='h2'>Guest</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='firstName2'
                  name='firstName'
                  label='First Name'
                  fullWidth
                  defaultValue={this.state.firstName}
                  onChange={this.handleTextChange}
                  variant='outlined'
                  style={{ margin: '16px 0 8px 0' }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id='lastName2'
                  name='lastName'
                  label='Last Name'
                  fullWidth
                  defaultValue={this.state.lastName}
                  onChange={this.handleTextChange}
                  variant='outlined'
                  style={{ margin: '16px 0 8px 0' }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant='subtitle1'>Group</Typography>
                <Select
                  fullWidth
                  labelId='groupselect'
                  id='groupselect'
                  open={this.state.open}
                  onClose={this.handleClose}
                  onOpen={this.handleOpen}
                  value={this.state.groupId}
                  onChange={this.handleGroupChange}
                >
                  {Object.keys(this.state.groups).map((group) => (
                    <MenuItem value={group}>
                      {this.state.groups[group]}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='subtitle1'>Attending</Typography>

                <RadioGroup
                  name='attending'
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onChange={this.handleAttendingChange}
                  defaultValue={
                    this.props.guest.attending === null
                      ? 'null'
                      : this.props.guest.attending.toString()
                  }
                >
                  <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label='Yes'
                  />
                  <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label='No'
                  />
                  <FormControlLabel
                    value='null'
                    control={<Radio />}
                    label='Unsure'
                  />
                </RadioGroup>
              </Grid>
              {this.state.attending !== false ? (
                <Grid item container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant='subtitle1'>Age</Typography>

                    <RadioGroup
                      name='over21'
                      style={{ display: 'flex', flexDirection: 'row' }}
                      onChange={this.handleAttendingChange}
                      defaultValue={
                        this.props.guest.attending === null
                          ? 'null'
                          : this.props.guest.attending.toString()
                      }
                    >
                      <FormControlLabel
                        value='true'
                        control={<Radio />}
                        label='21+'
                      />
                      <FormControlLabel
                        value='false'
                        control={<Radio />}
                        label='Under 21'
                      />
                      <FormControlLabel
                        value='null'
                        control={<Radio />}
                        label='Unsure'
                      />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant='subtitle1'>
                      Plus One Allowed
                    </Typography>

                    <RadioGroup
                      name='plusOneAllowed'
                      style={{ display: 'flex', flexDirection: 'row' }}
                      onChange={this.handleAttendingChange}
                      defaultValue={
                        this.state.plusOneAllowed === null
                          ? 'null'
                          : this.state.plusOneAllowed.toString()
                      }
                    >
                      <FormControlLabel
                        value='true'
                        control={<Radio />}
                        label='Yes'
                      />
                      <FormControlLabel
                        value='false'
                        control={<Radio />}
                        label='No'
                      />
                      <FormControlLabel
                        value='null'
                        control={<Radio />}
                        label='Unsure'
                      />
                    </RadioGroup>
                  </Grid>
                  {this.state.plusOneAllowed !== false ? (
                    <Grid item xs={12}>
                      <hr
                        style={{
                          margin: '16px 0',
                          borderStyle: 'dashed',
                          borderWidth: 'thin',
                          opacity: '50%',
                          width: '100%',
                        }}
                      />
                      <PlusOne
                        fetchGuest={this.props.fetchGuestList}
                        guest={this.state.guest}
                        deletePlusOne={null}
                        plusOne={this.state.guest.plusone}
                      />
                    </Grid>
                  ) : null}
                </Grid>
              ) : null}
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
    );
  }
}
export default EditGuest;
