/* eslint-disable react-hooks/exhaustive-deps */
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core/';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutlineOutlined';
import APIURL from '../../helpers/environment';

const Children = ({ groupId, children, attending }) => {
  const [childrenAttending, setChildrenAttending] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attending !== undefined) {
      setChildrenAttending(attending ? attending : 0);
      setLoading(false);
    }
  }, [attending]);

  useEffect(() => {
    if (loading === false) {
      fetch(`${APIURL}/group/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify({
          childrenAttending: parseInt(childrenAttending),
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      });
    }
  }, [childrenAttending]);

  return (
    <Grid item xs={12}>
      <Card style={{ borderRadius: '4px' }}>
        <CardContent>
          {groupId !== undefined ? (
            <Grid container item xs={12} spacing={1}>
              <Grid item xs={12}>
                <Typography variant='h2'>Children </Typography>{' '}
              </Grid>{' '}
              <Grid item xs={12}>
                <Typography variant='h5'>
                  Number of Children Attending
                </Typography>{' '}
              </Grid>
              <Grid item xs container alignItems='center'>
                <IconButton
                  style={{ paddingTop: '0', paddingBottom: '0' }}
                  disabled={childrenAttending === 0}
                  onClick={() => setChildrenAttending(childrenAttending - 1)}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
                <Typography>{childrenAttending}</Typography>
                <IconButton
                  style={{ paddingTop: '0', paddingBottom: '0' }}
                  disabled={childrenAttending === children}
                  onClick={() => setChildrenAttending(childrenAttending + 1)}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </Grid>
            </Grid>
          ) : null}
        </CardContent>
      </Card>
    </Grid>
  );
};
export default Children;
