/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Divider,
  Box,
} from '@material-ui/core/';
import PlusOne from './PlusOne';
import APIURL from '../../helpers/environment';
import soup from '../../assets/soup.svg';

const GuestComponent = ({ guestId }) => {
  const [guest, setGuest] = useState({});
  const [attending, setAttending] = useState(undefined);
  const [vegetarian, setVegetarian] = useState(undefined);
  const [drinks, setDrinks] = useState(undefined);
  const [drinking, setDrinking] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [plusOneId, setPlusOneId] = useState(undefined);

  const fetchGuest = () => {
    setLoading(true);
    fetch(`${APIURL}/guest/${guestId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setGuest(json);
        setAttending(
          json.attending === null ? null : json.attending?.toString()
        );
        setVegetarian(
          json.vegetarian === null ? null : json.vegetarian?.toString()
        );
        setDrinking(json.drinking);
        let guestDrinks = {};
        guestDrinks.mead = json.mead;
        guestDrinks.wine = json.wine;
        guestDrinks.beer = json.beer;
        guestDrinks.cider = json.cider;
        setDrinks(guestDrinks);
        setPlusOneId(json.plusone ? json.plusone.id : null);
      })
      .then(() => setLoading(false));
  };

  useEffect(() => {
    if (guestId) {
      fetchGuest();
    }
  }, [guestId]);

  useEffect(() => {
    if (loading === false) {
      if (attending === 'false' && guest.plusone) {
        deletePlusOne();
      }
      fetch(`${APIURL}/guest/${guestId}`, {
        method: 'PUT',
        body: JSON.stringify({
          guest: {
            attending: attending ? JSON.parse(attending) : null,
            drinking: drinking,
            vegetarian: vegetarian ? JSON.parse(vegetarian) : null,
            mead: drinks.mead,
            wine: drinks.wine,
            beer: drinks.beer,
            cider: drinks.cider,
          },
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      }).then(fetchGuest);
    }
  }, [attending, drinking, vegetarian, drinks]);

  const deletePlusOne = () => {
    fetch(`${APIURL}/plusone/${plusOneId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => fetchGuest());
  };
  return (
    <Grid item xs={12}>
      <Card style={{ borderRadius: '4px' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h2'>
                {guest?.firstName} {guest?.lastName}
              </Typography>
            </Grid>

            {attending !== undefined ? (
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Typography variant='h5'>Attendance</Typography>{' '}
                </Grid>
                <Grid item xs={12}>
                  <RadioGroup
                    name='attending'
                    onChange={(e) => setAttending(e.target.value)}
                    value={attending}
                  >
                    <FormControlLabel
                      value='true'
                      control={<Radio />}
                      label='Attending'
                      style={{ width: '40%' }}
                    />
                    <FormControlLabel
                      value='false'
                      control={<Radio />}
                      label='Not Attending'
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            ) : null}

            {attending === 'true' ? (
              <>
                {guest.over21 !== false &&
                drinking !== undefined &&
                drinks !== undefined ? (
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
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
                      <Box width='100%'></Box>
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
                      <FormControlLabel
                        checked={drinks.mead}
                        control={<Checkbox />}
                        label='Mead'
                        style={{ width: '100px' }}
                        onChange={(e) => {
                          if (drinking !== true) {
                            setDrinking(true);
                          }
                          setDrinks({ ...drinks, mead: e.target.checked });
                        }}
                      />{' '}
                      <Divider width='100%' />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      container
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      <FormControlLabel
                        checked={
                          drinking === true
                            ? false
                            : drinking === false
                            ? true
                            : null
                        }
                        control={<Checkbox />}
                        label='Not Drinking'
                        style={{ width: '100%' }}
                        onChange={(e) => {
                          setDrinking(!e.target.checked);
                          if (e.target.checked === true) {
                            setDrinks({
                              beer: false,
                              wine: false,
                              mead: false,
                              cider: false,
                            });
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                ) : null}

                {vegetarian !== undefined ? (
                  <Grid container item xs={12}>
                    <Grid item xs={12}>
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
                      <img
                        src={soup}
                        alt='soup'
                        style={{ height: '60px', opacity: '.87' }}
                      ></img>
                    </Grid>
                  </Grid>
                ) : null}
                {guest ? (
                  <PlusOne
                    plusOneId={plusOneId}
                    deletePlusOne={deletePlusOne}
                    plusOneAllowed={guest?.plusOneAllowed}
                    guestId={guestId}
                    fetchGuest={fetchGuest}
                  />
                ) : null}
              </>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default GuestComponent;
