import React, { useState } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core/';
import APIURL from '../helpers/environment';

const PlusOne = ({
  guest,
  fetchGuest,
  deletePlusOne,
  plusOneId,
  setPlusOneId,
}) => {
  const [firstName, setFirstName] = useState(guest.plusone?.firstName || '');
  const [lastName, setLastName] = useState(guest.plusone?.lastName || '');
  const [diet, setDiet] = useState(guest.plusone?.diet || []);
  const [plusOneExists, setPlusOneExists] = useState(!!guest.plusone);

  const updateGuest = (id) => {
    fetch(`${APIURL}/guest/${guest.id}`, {
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
        fetchGuest();
      });
  };

  const createPlusOne = () => {
    fetch(`${APIURL}/plusone/`, {
      method: 'POST',
      body: JSON.stringify({
        guestId: guest.id,
        diet: [],
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        fetchGuest();
        setPlusOneExists(true);
        setPlusOneId(json.id);
        localStorage.setItem('plusOneId', json.id);
        return json.id;
      })
      .then((id) => updateGuest(id));
  };

  const editPlusOne = () => {
    fetch(`${APIURL}/plusone/${plusOneId}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        diet: diet,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchGuest();
      });
  };

  const handleDietChange = (e) => {
    if (e.target.checked) {
      setDiet([...diet, e.target.name]);
      editPlusOne();
    } else {
      let index = diet.indexOf(e.target.name);
      console.log(index);
      setDiet(diet.filter((_, i) => i !== index));
      editPlusOne();
    }
  };

  const handleTextChange = (e, field) => {
    if (field === 'first') {
      setFirstName(e.target.value);
    } else {
      setLastName(e.target.value);
    }

    editPlusOne();
  };

  return (
    <>
      {plusOneExists ? (
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
              defaultValue={firstName}
              onChange={(e) => handleTextChange(e, 'first')}
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
              defaultValue={lastName}
              onChange={(e) => handleTextChange(e, 'last')}
              variant='outlined'
              style={{ margin: '16px 0 8px 0' }}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={diet.includes('Vegetarian')}
                  onChange={handleDietChange}
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
                  defaultChecked={diet.includes('Pescatarian')}
                  onChange={handleDietChange}
                  name='Pescatarian'
                />
              }
              label='Pescatarian'
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={deletePlusOne}>Remove Plus One</Button>
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Button onClick={createPlusOne} disabled={!guest.plusOneAllowed}>
            Add Plus One
          </Button>
        </Grid>
      )}
    </>
  );
};
export default PlusOne;
