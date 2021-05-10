import React, { Component } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from '@material-ui/core/';
import PlusOne from './PlusOne';
import { Guest } from '../interfaces';
import APIURL from '../helpers/environment';

interface MyState {
  attending: boolean | null;
  drinking: any;
  diet: string[] | null;
}
interface MyProps {
  guest: Guest;
  fetchGroupList: () => void;
  groupId: number;
}
class GuestComponent extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      attending: this.props.guest.attending,
      drinking: this.props.guest.drinking,
      diet: this.props.guest.diet ? this.props.guest.diet : [],
    };
  }

  saveGuest = () => {
    fetch(`${APIURL}/guest/${this.props.guest.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        attending: this.state.attending,
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
      })
      .then(() => {
        this.forceUpdate();
      });
  };

  handleAttendingChange = (e) => {
    if (e.target.value === 'true') {
      this.setState({ drinking: null, diet: [] });
      if (this.props.guest.plusone) {
        fetch(`${APIURL}/plusone/${this.props.guest.plusone.id}`, {
          method: 'DELETE',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }).then(() => {
          this.props.fetchGroupList();
        });
      }
    }
    this.setState({ attending: JSON.parse(e.target.value) }, () => {
      this.saveGuest();
    });
  };

  handleChange = (e) => {
    this.setState({ drinking: e.target.checked }, () => {
      this.saveGuest();
    });
  };

  handleDietChange = (e) => {
    if (this.state.diet) {
      if (e.target.checked) {
        this.setState({ diet: [...this.state.diet, e.target.name] }, () => {
          this.saveGuest();
        });
      } else {
        let index = this.state.diet.indexOf(e.target.name);
        this.setState(
          {
            diet: this.state.diet.filter((_, i) => i !== index),
          },
          () => {
            this.saveGuest();
          }
        );
      }
    }
  };

  render() {
    return (
      <Grid item xs={12}>
        <Card style={{ borderRadius: '4px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h2'>
                  {this.props.guest.firstName} {this.props.guest.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <RadioGroup
                  name='attending'
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onChange={this.handleAttendingChange}
                  defaultValue={
                    this.props.guest.attending === null
                      ? undefined
                      : this.props.guest.attending.toString()
                  }
                >
                  <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label='Attending'
                    style={{ width: '33%' }}
                  />
                  <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label='Not Attending'
                  />
                </RadioGroup>
              </Grid>
            </Grid>

            {this.state.attending ? (
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='drinking'
                        defaultChecked={this.state.drinking}
                        onChange={this.handleChange}
                        disabled={
                          this.props.guest.over21
                            ? this.props.guest.over21
                            : undefined
                        }
                      />
                    }
                    label='21+ and drinking'
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={
                          this.state.diet
                            ? this.state.diet.includes('vegetarian')
                            : undefined
                        }
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
                        defaultChecked={
                          this.state.diet
                            ? this.state.diet.includes('Pescatarian')
                            : undefined
                        }
                        onChange={this.handleDietChange}
                        name='Pescatarian'
                      />
                    }
                    label='Pescatarian'
                  />
                </Grid>

                <>
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
                    key={
                      this.props.guest.plusone
                        ? this.props.guest.plusone.id
                        : null
                    }
                    fetchGroupList={this.props.fetchGroupList}
                    guest={this.props.guest}
                  />
                </>
              </Grid>
            ) : null}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}
export default GuestComponent;
