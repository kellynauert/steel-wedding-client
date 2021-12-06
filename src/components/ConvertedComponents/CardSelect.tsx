import React, { useState } from 'react';
import GuestComponent from './GuestComponent';
import Children from './Children';
import {
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

  return (
    <Dialog fullScreen={mobile} open={open} onClose={handleClose}>
      <DialogContent className='cardBack'>
        {open === false ? null : (
          <Grid container spacing={2}>
            {group?.children > 0 ? (
              <Children
                groupId={group?.id}
                children={group.children}
                attending={group.childrenAttending}
              />
            ) : null}
            {group?.guests.map((guest) => {
              return <GuestComponent key={guest.id} guestId={guest.id} />;
            })}
          </Grid>
        )}
      </DialogContent>
      <DialogActions style={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant='subtitle2'>Changes saved automatically</Typography>
        <Button onClick={handleClose} variant='outlined'>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CardSelect;
