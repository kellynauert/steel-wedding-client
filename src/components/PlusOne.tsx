import React, { Component } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core/';
import { Guest } from '../interfaces';
import APIURL from '../helpers/environment';

interface MyState {
  firstName: string | null;
  lastName: string | null;
  drinking: boolean | null;
  diet: string[];
  guest: Guest;
  plusOneExists: boolean;
  plusOneId: number | null;
}

interface MyProps {
  guest: Guest;
  fetchGroupList: () => void;
}
class PlusOne extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.guest.plusone
        ? this.props.guest.plusone.firstName
        : '',
      lastName: this.props.guest.plusone
        ? this.props.guest.plusone.lastName
        : '',
      drinking: this.props.guest.plusone
        ? this.props.guest.plusone.drinking
        : null,
      diet: this.props.guest.plusone
        ? this.props.guest.plusone.diet
          ? this.props.guest.plusone.diet
          : []
        : [],
      guest: this.props.guest,
      plusOneExists: this.props.guest.plusone ? true : false,
      plusOneId: this.props.guest.plusone ? this.props.guest.plusone.id : null,
    };
  }

  deletePlusOne = () => {
    fetch(`${APIURL}/plusone/${this.state.plusOneId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then(() => {
        this.props.fetchGroupList();
      })
      .then(() =>
        this.setState({
          plusOneExists: false,
          firstName: '',
          lastName: '',
          diet: [],
          drinking: null,
        })
      )
      .then(() => this.updateGuest(null));
  };
  updateGuest = (id) => {
    console.log(id);
    fetch(`${APIURL}/guest/${this.props.guest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        plusOneId: id,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        this.props.fetchGroupList();
      });
  };
  createPlusOne = () => {
    fetch(`${APIURL}/plusone/`, {
      method: 'POST',
      body: JSON.stringify({
        guestId: this.state.guest.id,
        diet: [],
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        this.props.fetchGroupList();
        this.setState({ plusOneExists: true, plusOneId: json.id });
        localStorage.setItem('plusOneId', json.id);
        return json.id;
      })
      .then((id) => this.updateGuest(id));
  };

  editPlusOne = () => {
    fetch(`${APIURL}/plusone/${this.state.plusOneId}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        drinking: this.state.drinking,
        diet: this.state.diet,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        this.props.fetchGroupList();
      });
  };

  handleDietChange = (e) => {
    console.log(e.target.checked);
    console.log(this.state.diet);
    if (e.target.checked) {
      this.setState({ diet: [...this.state.diet, e.target.name] }, () => {
        this.editPlusOne();
      });
    } else {
      let index = this.state.diet.indexOf(e.target.name);
      console.log(index);
      this.setState(
        {
          diet: this.state.diet.filter((_, i) => i !== index),
        },
        () => {
          this.editPlusOne();
        }
      );
    }
  };

  handleChange = (e) =>
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.checked }, () => {
      this.editPlusOne();
    });

  handleTextChange = (e) =>
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.editPlusOne();
    });

  render() {
    return (
      <>
        {this.state.plusOneExists ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant='h2'>Plus One</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id='firstName'
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
                id='lastName'
                name='lastName'
                label='Last Name'
                fullWidth
                defaultValue={this.state.lastName}
                onChange={this.handleTextChange}
                variant='outlined'
                style={{ margin: '16px 0 8px 0' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name='drinking'
                    defaultChecked={
                      this.state.drinking ? this.state.drinking : undefined
                    }
                    onChange={this.handleChange}
                  />
                }
                onChange={this.handleChange}
                label='21+ and drinking'
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={this.state.diet.includes('Vegetarian')}
                    onChange={this.handleDietChange}
                    name='Vegetarian'
                  />
                }
                label='Vegetarian'
              />
            </Grid>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={this.state.diet.includes('Vegan')}
                    onChange={this.handleDietChange}
                    name='Vegan'
                  />
                }
                label='Vegan'
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={this.deletePlusOne}>Remove Plus One</Button>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Button
              onClick={this.createPlusOne}
              disabled={!this.props.guest.plusOneAllowed}
            >
              Add Plus One
            </Button>
          </Grid>
        )}
      </>
    );
  }
}
export default PlusOne;
