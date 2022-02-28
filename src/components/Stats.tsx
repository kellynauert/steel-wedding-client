//@ts-nocheck
import React, { Component } from 'react';
import { Grid, Box, Typography, Tooltip } from '@material-ui/core';

const Stats = ({ data }) => {
  return (
    <>
      <Grid item xs>
        <Box textAlign='center'>
          <Typography variant='h2'>
            <Tooltip
              arrow
              placement='top'
              title={`Guests: ${data.invited}, Plus Ones: ${data.plusOneAllowed}, Children: ${data.children}`}
            >
              <span>{data.invited + data.plusOneAllowed + data.children}</span>
            </Tooltip>
          </Typography>
          <Typography variant='body1'>Invited</Typography>
        </Box>
      </Grid>
      <Grid item xs>
        <Box textAlign='center'>
          <Typography variant='h2'>
            <Tooltip
              arrow
              placement='top'
              title={`Guests: ${data.attending}, Plus Ones: ${data.plusOnes}, Children: ${data.childrenAttending}`}
            >
              <span>
                {data.attending + data.plusOnes + data.childrenAttending}
              </span>
            </Tooltip>
          </Typography>

          <Typography variant='body1'>Attending</Typography>
        </Box>
      </Grid>
      <Grid item xs>
        <Box textAlign='center'>
          <Typography variant='h2'>
            {data.invited - data.notAttending - data.attending}
          </Typography>
          <Typography variant='body1'>Awaiting Response</Typography>
        </Box>
      </Grid>{' '}
      <Grid item xs>
        <Box textAlign='center'>
          {' '}
          <Typography variant='h2'>
            <Tooltip
              arrow
              placement='top'
              title={`Guests: ${data.vegetarian}, Plus Ones: ${data.plusOnesVegetarian}`}
            >
              <span> {data.vegetarian + data.plusOnesVegetarian}</span>
            </Tooltip>
          </Typography>
          <Typography variant='body1'>Vegetarians</Typography>
        </Box>
      </Grid>
      <Grid
        item
        xs={4}
        container
        spacing={1}
        style={{ outline: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Grid item xs style={{ borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Box textAlign='center'>
            <Typography variant='h2'>
              <Tooltip
                arrow
                placement='top'
                title={`Guests: ${data.drinking}, Plus Ones: ${data.plusOnesDrinking}`}
              >
                <span>{data.drinking + data.plusOnesDrinking}</span>
              </Tooltip>
            </Typography>
            <Typography variant='body1'>Drinking</Typography>
          </Box>
        </Grid>
        <Grid item xs>
          <Box textAlign='center'>
            <Typography variant='h2'>{data.beer}</Typography>
            <Typography variant='body1'>Beer</Typography>
          </Box>
        </Grid>{' '}
        <Grid item xs>
          <Box textAlign='center'>
            <Typography variant='h2'>{data.wine}</Typography>
            <Typography variant='body1'>Wine</Typography>
          </Box>
        </Grid>{' '}
        <Grid item xs>
          <Box textAlign='center'>
            <Typography variant='h2'>{data.cider}</Typography>
            <Typography variant='body1'>Cider</Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
export default Stats;
