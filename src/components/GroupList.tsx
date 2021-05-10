import React, { Component } from 'react';
import { Grid, Box } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { Group, Guest } from '../interfaces';
import APIURL from '../helpers/environment';

interface MyState {
  open: boolean;
  groups: Group[];
  guests: Guest[];
}

interface MyProps {
  role: string;
}
class GroupList extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      groups: [],
      guests: [],
    };
  }

  handleOpen = () => this.setState({ open: true });

  componentDidMount() {
    this.fetchGuestList();
  }
  handleErrors = (response) => {
    console.log(response);
    if (response.message === 'Not Authorized') {
      this.handleOpen();
    } else {
      return response;
    }
  };

  fetchGuestList = () => {
    if (localStorage.token) {
      fetch(`${APIURL}/group/`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((response) => this.handleErrors(response))
        .then((guestData) => {
          this.setState({
            guests: guestData,
          });
        });
    } else {
      this.handleOpen();
    }
  };
  handleEditCellChange = (e) => {
    console.log(e);

    fetch(`${APIURL}/group/${e.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        [e.field]: e.props.value,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    }).then((res) => res.json());
  };
  render() {
    let columns = [
      {
        field: 'id',
        headerName: 'id',
      },
      {
        field: 'groupName',
        headerName: 'Group name',
        flex: 0.5,
        editable: true,
      },

      {
        field: 'address',
        headerName: 'Address',
        flex: 1,
        editable: true,
        valueGetter: (params) => params.value?.toString(),
      },
      {
        field: 'phone',
        headerName: 'Phone',
        flex: 0.5,
        editable: true,
      },
      {
        field: 'members',
        headerName: 'Members',
        valueGetter: (params) =>
          params.row.guests
            ?.map((item) => item.firstName + ' ' + item.lastName)
            .join(', '),
        flex: 1,
      },
    ];

    return (
      <Grid container>
        <Grid item xs={12}>
          <Box
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '90vh',
              padding: '16px',
            }}
          >
            {this.state.guests ? (
              <DataGrid
                density='comfortable'
                columns={columns}
                rows={this.state.guests}
                onEditCellChangeCommitted={this.handleEditCellChange}
              />
            ) : null}
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default GroupList;
