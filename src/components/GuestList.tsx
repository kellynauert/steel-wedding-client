import React, { Component } from 'react';
import {
  Grid,
  Dialog,
  Box,
  IconButton,
  Button,
  DialogActions,
  Tooltip,
  TextField,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridToolbarExport } from '@material-ui/data-grid';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import EditGuest from './EditGuest';

import { Group, Guest, Data } from '../interfaces';
import APIURL from '../helpers/environment';

import Stats from './Stats';
var _ = require('lodash');

interface MyState {
  guests: Guest[] | null | undefined;
  filteredGuests: Guest[] | null | undefined;
  open: boolean;
  groups: Group[];
  openDialog: boolean;
  newGuest: Guest | null;
  role: string;
  stats: Data;
  search: string[] | null;
  searchTerm: string;
}

interface MyProps {
  role: string;
}
let defaultStats = {
  attending: 0,
  both: 0,
  drinking: 0,
  invited: 0,
  invites: 0,
  notAttending: 0,
  pescatarian: 0,
  plusOnes: 0,
  vegetarian: 0,
};
class GuestList extends Component<MyProps, MyState> {
  constructor(props) {
    super(props);
    this.state = {
      guests: [],
      filteredGuests: [],
      open: false,
      groups: [],
      openDialog: false,
      newGuest: null,
      role: this.props.role,
      stats: defaultStats,
      search: [],
      searchTerm: '',
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    this.fetchGuestList();
  };

  handleChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
      },
      () => this.searchFunction()
    );
  };

  searchFunction = () => {
    let items = this.state.guests?.sort().filter((guest) => {
      let found = false;
      let search =
        (guest.firstName ? guest.firstName.toLowerCase() : '') +
        ' ' +
        (guest.lastName ? guest.lastName.toLowerCase() : '');
      if (search.includes(this.state.searchTerm.toLowerCase())) {
        found = true;
      }
      return found;
    });

    this.setState({
      filteredGuests: items,
    });
  };

  CustomToolbar = () => {
    return (
      <Box
        padding={2}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(224, 224, 224, 1)',
        }}
      >
        <Grid container spacing={4}>
          <Grid
            item
            md={2}
            spacing={2}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <TextField
              fullWidth
              variant='outlined'
              placeholder='Search'
              onChange={_.debounce(this.handleChange, 300)}
            />
          </Grid>
          <Stats data={this.state.stats} />

          <Grid
            item
            md={2}
            style={{
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <GridToolbarExport />
            <Tooltip
              arrow
              placement='right'
              title={
                this.props.role === 'Admin'
                  ? 'Add A Guest'
                  : 'Only admins may add users'
              }
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '16px',
                }}
              >
                <Button
                  variant='contained'
                  color='secondary'
                  startIcon={<AddIcon />}
                  disabled={this.props.role !== 'Admin' ? true : false}
                  onClick={this.createUser}
                  style={{ height: '36px' }}
                >
                  Add Guest
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Box>
    );
  };
  componentDidMount() {
    this.fetchGuestList();
    this.fetchGroups();
    this.fetchStats();
  }

  fetchStats = () => {
    fetch(`${APIURL}/guest/master/count`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((response) => this.setState({ stats: response }))
      .then(() => console.log(this.state.stats));
  };
  handleErrors = (response) => {
    if (response.message === 'Not Authorized') {
      this.handleOpen();
    } else {
      return response;
    }
  };
  fetchGroups = () => {
    fetch(`${APIURL}/group/names`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((response) => this.handleErrors(response))
      .then((groupData) => {
        this.setState({
          groups: groupData,
        });
      });
  };
  fetchGuestList = () => {
    if (localStorage.token) {
      fetch(`${APIURL}/guest/master/`, {
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
            filteredGuests: guestData,
          });
        })
        .then(() => console.log(this.state.guests));
    } else {
      this.handleOpen();
    }
  };
  deleteUser = (id) => () => {
    fetch(`${APIURL}/guest/master/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then(this.fetchGuestList);
  };

  createUser = () => {
    fetch(`${APIURL}/guest/master/`, {
      method: 'POST',
      body: JSON.stringify({
        firstName: 'First Name',
        groupId: 1,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((json) => this.fetchGuest(json.id));
  };

  fetchGuest = (id) => {
    fetch(`${APIURL}/guest/master/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((json) => this.setState({ newGuest: json }))
      .then(() => this.setState({ openDialog: true }));
  };

  handleEditCellChange = (e) => {
    console.log(e);
    if (e.field === 'groupId') {
      fetch(`${APIURL}/guest/master/${e.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          [e.field]: parseInt(e.props.value),
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      }).then((res) => res.json());
    } else if (e.field === 'diet' && typeof e.props.value === 'string') {
      fetch(`${APIURL}/guest/master/${e.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          [e.field]: e.props.value.split(','),
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      }).then((res) => res.json());
    } else {
      fetch(`${APIURL}/guest/master/${e.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          [e.field]: e.props.value,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      }).then((res) => res.json());
    }
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false });
    this.fetchGuestList();
    this.forceUpdate();
  };
  handleDialogOpen = () => {
    this.setState({
      openDialog: true,
    });
  };

  render() {
    let columns = [
      {
        field: 'firstName',
        headerName: 'First name',
        flex: 0.5,
        editable: true,
      },
      { field: 'lastName', headerName: 'Last name', flex: 0.5, editable: true },
      {
        field: 'groupId',
        headerName: 'Group',
        valueGetter: (params) => this.state.groups[params.value],
        flex: 1,
        editable: true,
      },
      {
        field: 'attending',
        headerName: `Attending`,
        flex: 0.5,
        editable: true,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => params.value,
        renderCell: (params) =>
          params.value === null ||
          params.value.toString() === '' ? null : params.value.toString() ===
            'true' ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CheckCircleOutlineOutlinedIcon style={{ color: '#00a152' }} />
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CancelOutlinedIcon style={{ color: '#f44336' }} />
            </Box>
          ),
      },
      {
        field: 'diet',
        headerName: 'Diet',
        valueGetter: (params) => params.value?.join(),
        flex: 0.5,
        editable: true,
      },
      {
        field: 'over21',
        headerName: 'Over21',
        flex: 0.5,
        editable: true,
        headerAlign: 'center',
        align: 'center',
        valueGetter: (params) => params.value,
        renderCell: (params) =>
          params.value === null ||
          params.value.toString() === '' ? null : params.value.toString() ===
            'true' ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CheckCircleOutlineOutlinedIcon style={{ color: '#00a152' }} />
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CancelOutlinedIcon style={{ color: '#f44336' }} />
            </Box>
          ),
      },
      {
        field: 'drinking',
        headerName: 'Drinking',
        flex: 0.5,
        headerAlign: 'center',
        align: 'center',
        editable: true,
        valueGetter: (params) => params.value,
        renderCell: (params) =>
          params.value === null ||
          params.value.toString() === '' ? null : params.value.toString() ===
            'true' ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CheckCircleOutlineOutlinedIcon style={{ color: '#00a152' }} />
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CancelOutlinedIcon style={{ color: '#f44336' }} />
            </Box>
          ),
      },
      {
        field: 'plusone',
        headerName: 'Plus one',
        flex: 0.5,
        editable: true,
        valueGetter: (params) =>
          params.row.plusone
            ? !params.row.plusone.firstName && !params.row.plusone.lastName
              ? 'Unknown'
              : params.row.plusone.firstName
              ? params.row.plusone.firstName
              : null + ' ' + params.row.plusone.lastName
              ? params.row.plusone.lastName
              : null
            : null,
      },
      {
        field: 'plusOneAllowed',
        headerName: 'Plus one allowed',
        flex: 0.5,
        headerAlign: 'center',
        align: 'center',
        editable: true,
        valueGetter: (params) => params.value,
        renderCell: (params) =>
          params.value === null ||
          params.value.toString() === '' ? null : params.value.toString() ===
            'true' ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CheckCircleOutlineOutlinedIcon style={{ color: '#00a152' }} />
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <CancelOutlinedIcon style={{ color: '#f44336' }} />
            </Box>
          ),
      },
      {
        field: 'delete',
        headerName: ' ',
        flex: 0.2,
        align: 'center',
        renderCell: (params) => (
          <Tooltip
            arrow
            placement='left'
            title={
              this.props.role === 'Admin'
                ? 'Delete Guest'
                : 'Only admins may delete users'
            }
          >
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label='delete'
                onClick={this.deleteUser(params.id)}
                disabled={this.props.role !== 'Admin' ? true : false}
              >
                <DeleteIcon />
              </IconButton>
            </span>
          </Tooltip>
        ),
      },
      {
        field: 'edit',
        headerName: ' ',
        flex: 0.2,
        align: 'center',
        renderCell: (params) => (
          <IconButton
            aria-label='edit'
            onClick={() => this.fetchGuest(params.id)}
          >
            <EditIcon color='primary' />
          </IconButton>
        ),
      },
    ];

    return (
      <Grid container>
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleDialogClose}
          aria-labelledby='form-dialog-title'
        >
          {this.state.newGuest ? (
            <EditGuest
              guest={this.state.newGuest}
              fetchGuestList={this.fetchGuestList}
              groups={this.state.groups}
            />
          ) : null}
          <DialogActions>
            <Typography variant='subtitle2' style={{ color: 'white' }}>
              Changes saved automatically
            </Typography>
            <Button
              onClick={this.handleDialogClose}
              color='primary'
              variant='contained'
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
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
                id='datagrid'
                density='comfortable'
                // @ts-ignore
                columns={columns}
                disableColumnMenu
                // @ts-ignore
                rows={this.state.filteredGuests}
                onEditCellChangeCommitted={this.handleEditCellChange}
                components={{ Toolbar: this.CustomToolbar }}
              />
            ) : null}
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default GuestList;
