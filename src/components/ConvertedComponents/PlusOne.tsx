//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Divider,
  Checkbox,
  Box,
  Tooltip,
} from '@material-ui/core/';
import APIURL from '../../helpers/environment';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import HelpRoundedIcon from '@material-ui/icons/HelpRounded';
const PlusOne = ({
  deletePlusOne,
  plusOneId,
  plusOneAllowed,
  guestId,
  fetchGuest,
}) => {
  const [firstName, setFirstName] = useState(undefined);
  const [lastName, setLastName] = useState(undefined);
  const [vegetarian, setVegetarian] = useState(undefined);
  const [drinks, setDrinks] = useState(undefined);
  const [drinking, setDrinking] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [plusOne, setPlusOne] = useState(undefined);

  useEffect(() => console.log(!drinking, drinking), [drinking]);
  const fetchPlusOne = () => {
    setLoading(true);
    fetch(`${APIURL}/plusone/${plusOneId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setPlusOne(json);
        setFirstName(json.firstName);
        setLastName(json.lastName);

        setVegetarian(
          json.vegetarian === null ? null : json.vegetarian?.toString()
        );
        setDrinking(json.drinking);
        let guestDrinks = {};
        guestDrinks.wine = json.wine;
        guestDrinks.beer = json.beer;
        guestDrinks.cider = json.cider;
        setDrinks(guestDrinks);
      })
      .then(() => setLoading(false));
  };

  useEffect(() => {
    if (plusOneId) {
      fetchPlusOne();
    } else {
      setPlusOne(undefined);
    }
  }, [plusOneId]);

  const createPlusOne = () => {
    fetch(`${APIURL}/plusone/`, {
      method: 'POST',
      body: JSON.stringify({
        guestId: guestId,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(fetchGuest);
  };

  useEffect(() => {
    if (loading === false) {
      setLoading(true);
      fetch(`${APIURL}/plusone/${plusOneId}`, {
        method: 'PUT',
        body: JSON.stringify({
          guest: {
            firstName: firstName,
            lastName: lastName,
            drinking: drinking,
            vegetarian: vegetarian ? JSON.parse(vegetarian) : null,
            wine: drinks.wine,
            beer: drinks.beer,
            cider: drinks.cider,
          },
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(() => setLoading(false));
    }
  }, [firstName, lastName, drinking, drinks, vegetarian]);
  const LightTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))(Tooltip);

  return (
    <>
      {plusOne !== undefined ? (
        <Grid container item spacing={2}>
          <hr
            style={{
              margin: '16px 0',
              borderStyle: 'dashed',
              borderWidth: 'thin',
              opacity: '50%',
              width: '100%',
            }}
          />
          <Grid item xs={12} style={{ margin: '8px 0' }}>
            <Typography variant='h2'>Plus One</Typography>
          </Grid>
          {firstName !== undefined ? (
            <Grid item xs={6}>
              <TextField
                id='firstName'
                name='firstName'
                label='First Name'
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                variant='outlined'
              />
            </Grid>
          ) : null}{' '}
          {lastName !== undefined ? (
            <Grid item xs={6}>
              <TextField
                id='lastName'
                name='lastName'
                label='Last Name'
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant='outlined'
              />
            </Grid>
          ) : null}
          <Divider />{' '}
          {drinking !== undefined && drinks !== undefined ? (
            <Grid container item xs={12}>
              <Grid item xs={12} style={{ margin: '8px 0' }}>
                <Typography variant='h5'>Drink Preferences</Typography>{' '}
              </Grid>
              <Grid
                item
                xs={12}
                container
                alignItems='center'
                style={{ whiteSpace: 'nowrap' }}
              >
                <FormControlLabel
                  checked={drinks.beer}
                  control={<Checkbox />}
                  label='Beer'
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    if (drinking !== true) {
                      setDrinking(true);
                    }
                    setDrinks({ ...drinks, beer: e.target.checked });
                  }}
                />
                <FormControlLabel
                  checked={drinks.wine}
                  control={<Checkbox />}
                  label='Wine'
                  onChange={(e) => {
                    if (drinking !== true) {
                      setDrinking(true);
                    }
                    setDrinks({ ...drinks, wine: e.target.checked });
                  }}
                  style={{ width: '100px' }}
                />
                <FormControlLabel
                  checked={drinks.cider}
                  control={<Checkbox />}
                  label='Cider'
                  style={{ width: '100px' }}
                  onChange={(e) => {
                    if (drinking !== true) {
                      setDrinking(true);
                    }
                    setDrinks({ ...drinks, cider: e.target.checked });
                  }}
                />{' '}
                <Divider width='100%' />
              </Grid>
              <Grid item xs={12} container style={{ whiteSpace: 'nowrap' }}>
                <FormControlLabel
                  checked={
                    drinking === true ? false : drinking === false ? true : null
                  }
                  control={<Checkbox />}
                  label='Not Drinking'
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    if (e.target.checked === true) {
                      setDrinks({
                        beer: false,
                        wine: false,
                        cider: false,
                      });
                    }
                    setDrinking(!e.target.checked);
                  }}
                />
              </Grid>
            </Grid>
          ) : null}
          {vegetarian !== undefined ? (
            <Grid container item xs={12}>
              <Grid item xs={12} style={{ margin: '8px 0' }}>
                <Typography variant='h5'>Stew Preference</Typography>{' '}
              </Grid>{' '}
              <Grid item xs={12} container alignItems='center'>
                <RadioGroup
                  name='vegetarian'
                  onChange={(e) => setVegetarian(e.target.value)}
                  value={vegetarian}
                  sx={{ marginRight: '16px' }}
                >
                  <FormControlLabel
                    value='false'
                    control={<Radio />}
                    label='Beef'
                    style={{ width: '40%' }}
                  />
                  <FormControlLabel
                    value='true'
                    control={<Radio />}
                    label='Vegetable'
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          ) : null}
          <hr
            style={{
              borderWidth: 'thin',
              opacity: '50%',
              width: '100%',
            }}
          />
          <Grid item xs={12}>
            <Button onClick={() => deletePlusOne()}>Remove Plus One</Button>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12} container alignItems='center'>
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
          </Grid>
          <Grid item>
            <LightTooltip
              disableFocusListener
              title={
                plusOneAllowed
                  ? ''
                  : 'Plus-ones have been limited to adults in long-term relationships. If we made a mistake, please contact Blake or Kelly.'
              }
            >
              <span>
                {' '}
                <Button
                  onClick={() => createPlusOne()}
                  disabled={!plusOneAllowed}
                >
                  Add Plus One
                </Button>
              </span>
            </LightTooltip>{' '}
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default PlusOne;
