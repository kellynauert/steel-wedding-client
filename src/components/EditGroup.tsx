import React, { Component } from 'react';
import {
  Grid,
  Typography,
  TextField,
  DialogContent,
  Card,
  CardContent,
} from '@material-ui/core/';
import { Group } from '../interfaces';
import APIURL from '../helpers/environment';

interface MyState {
  group: Group;
  open: boolean;
  groupName: string | null;
  children: number;
}

interface MyProps {
  group: Group;
  fetchGroupList: () => void;
  groups: Group[];
}

class EditGroup extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.group,
      open: false,
      groupName: this.props.group.groupName,
      children: this.props.group.children,
    };
  }
  componentDidMount = () => {
    this.setState({ group: this.props.group });
  };
  saveGroup = () => {
    fetch(`${APIURL}/group/${this.props.group.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        groupName: this.state.groupName,
        children: this.state.children,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    }).then((res) => res.json());
  };

  handleChange = (e) =>
    // @ts-ignore
    this.setState({ [e.target.name]: e.target.checked }, () => {
      this.saveGroup();
    });

  handleTextChange = (e) => {
    // @ts-ignore
    this.setState({ [e.target.id]: e.target.value }, () => {
      this.saveGroup();
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  render() {
    return (
      <DialogContent className='cardBack'>
        <Card style={{ borderRadius: '4px' }} id='groupEdit'>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant='h2'>Group</Typography>
              </Grid>{' '}
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label='Group Name'
                  id='groupName'
                  defaultValue={this.state.groupName}
                  variant='outlined'
                  onChange={this.handleTextChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label='Children'
                  id='children'
                  defaultValue={this.state.children}
                  variant='outlined'
                  type='number'
                  onChange={this.handleTextChange}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
    );
  }
}
export default EditGroup;
