import React, { Component } from 'react';
import { Grid, Box, Typography, Tooltip } from '@material-ui/core';
import {
  mdiFish,
  mdiGlassMugVariant,
  mdiLeaf,
  mdiCastle,
  mdiCards,
  mdiMailboxOpen,
  mdiCommentQuestion,
} from '@mdi/js';
import Icon from '@mdi/react';

interface MyState {}

// interface MyProps {
//   data: {};
// }

class Stats extends Component<any, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }
  render() {
    return (
      <Grid item container md={10}>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiCards}
                size={1}
                color='palevioletred'
              />
              {this.props.data.invited}
            </Typography>
            <Typography variant='body1'>Invited</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography variant='h2'>
              <Tooltip
                arrow
                placement='top'
                title={`Invited: ${this.props.data.attending}, Plus Ones: ${this.props.data.plusOnes}`}
              >
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Icon
                    style={{ marginRight: '8px' }}
                    path={mdiCastle}
                    size={1}
                    color='grey'
                  />

                  {this.props.data.attending + this.props.data.plusOnes}
                </span>
              </Tooltip>
            </Typography>

            <Typography variant='body1'>Attending</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiCommentQuestion}
                size={1}
                color='indigo'
              />
              {this.props.data.invited -
                this.props.data.notAttending -
                this.props.data.attending}
            </Typography>
            <Typography variant='body1'>No Response</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiMailboxOpen}
                size={1}
                color='dodgerblue'
              />
              {this.props.data.invites}
            </Typography>
            <Typography variant='body1'>Invitations</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiGlassMugVariant}
                size={1}
                color='chocolate'
              />
              {this.props.data.drinking}
            </Typography>
            <Typography variant='body1'>Drinking</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiFish}
                size={1.1}
                color='teal'
              />
              {this.props.data.pescatarian}
            </Typography>
            <Typography variant='body1'>Pescatarians</Typography>
          </Box>
        </Grid>
        <Grid item md={1}>
          <Box textAlign='center'>
            <Typography
              variant='h2'
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon
                style={{ marginRight: '8px' }}
                path={mdiLeaf}
                size={1}
                color='forestgreen'
              />
              {this.props.data.vegetarian - this.props.data.both}
            </Typography>
            <Typography variant='body1'>Vegetarians</Typography>
          </Box>
        </Grid>
      </Grid>
    );
  }
}
export default Stats;
