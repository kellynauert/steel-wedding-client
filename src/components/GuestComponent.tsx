/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  FormControlLabel,
  Divider,
  Radio,
  RadioGroup,
} from '@material-ui/core/';
import PlusOne from './PlusOne';
import APIURL from '../helpers/environment';

const GuestComponent = ({ guestId }) => {
  const [guest, setGuest] = useState({});
  const [attending, setAttending] = useState(false);
  const [diet, setDiet] = useState('');
  const [plusOneId, setPlusOneId] = useState(null);

  const saveGuest = () => {
    fetch(`${APIURL}/guest/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify({
        attending: attending,
        diet: [diet],
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then((res) => res.json());
  };
  const fetchGuest = () => {
    fetch(`${APIURL}/guest/${guestId}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setGuest(json);
        setAttending(json.attending);
        setDiet(json.diet[0]);
        setPlusOneId(json.plusOneId);
      });
  };
  useEffect(() => fetchGuest(), [guestId]);
  useEffect(() => {
    if (attending === false) {
      setDiet('');
      if (guest.plusOneId) {
        deletePlusOne();
      }
    }
    saveGuest();
  }, [attending, diet]);

  const handleAttendingChange = (e) => setAttending(JSON.parse(e.target.value));
  const handleDietChange = (e) => setDiet(e.target.value);
  const deletePlusOne = () => {
    fetch(`${APIURL}/guest/${guestId}`, {
      method: 'PUT',
      body: JSON.stringify({
        plusOneId: null,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchGuest();
      });

    fetch(`${APIURL}/plusone/${plusOneId}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(() => setPlusOneId(null));
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
            <Grid item xs>
              <RadioGroup
                name='attending'
                style={{ display: 'flex', flexDirection: 'row' }}
                onChange={handleAttendingChange}
                value={attending}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label='Attending'
                  style={{ width: '40%' }}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='Not Attending'
                />
              </RadioGroup>
            </Grid>
          </Grid>

          {attending ? (
            <Grid container item xs={12}>
              <Divider />
              <Grid item xs>
                <RadioGroup
                  name='diet'
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onChange={handleDietChange}
                  value={diet}
                >
                  <FormControlLabel
                    value={'Meat'}
                    control={<Radio />}
                    label='Beef Stew'
                    style={{ width: '40%' }}
                  />
                  <FormControlLabel
                    value={'Vegetarian'}
                    control={<Radio />}
                    label='Veggie Stew'
                  />
                </RadioGroup>
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
                  fetchGuest={fetchGuest}
                  guest={guest}
                  plusOneId={plusOneId}
                  setPlusOneId={setPlusOneId}
                  deletePlusOne={deletePlusOne}
                />
              </>
            </Grid>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default GuestComponent;
