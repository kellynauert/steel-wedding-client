import React, { useState } from 'react';

import GuestComponent from './GuestComponent';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
} from '@material-ui/core/';

const CardSelect = ({
  open,
  mobile,
  group,
  setOpen,
  setGroup,
  fetchGroupList,
}) => {
  const handleClose = () => {
    fetchGroupList();
    setGroup(null);
    setOpen(false);
  };

  // const saveGroup = (e) => {
  //   fetch(`${APIURL}/group/${group.id}`, {
  //     method: 'PUT',
  //     body: JSON.stringify({
  //       [e.target.id]: e.target.value,
  //     }),
  //     headers: new Headers({
  //       'Content-Type': 'application/json',
  //     }),
  //   }).then((res) => res.json());
  // };

  return (
    <Dialog fullScreen={mobile} open={open} onClose={handleClose}>
      <DialogContent className='cardBack'>
        {open === false ? null : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card style={{ borderRadius: '4px' }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant='h2'>{group?.groupName}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {group?.guests.map((guest) => {
              return <GuestComponent guestId={guest.id} />;
            })}
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Typography variant='subtitle2'>Changes saved automatically</Typography>
        <Button onClick={handleClose} variant='outlined'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CardSelect;
