import React, { Component } from 'react';
import {
  Grid,
  Box,
  TextField,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridToolbarExport } from '@material-ui/data-grid';
import { Group } from '../interfaces';
import EditGroup from './EditGroup';
import APIURL from '../helpers/environment';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
var _ = require('lodash');

interface MyState {
  open: boolean;
  groups: Group[];
  search: string[] | null;
  searchTerm: string;
  filteredGroups: Group[] | null | undefined;
  group: Group | null;
  openDialog: boolean;
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
      group: null,
      search: [],
      searchTerm: '',
      filteredGroups: [],
      openDialog: false,
    };
  }
  handleDialogClose = () => {
    this.setState({ openDialog: false });
    this.fetchGroupList();
    this.forceUpdate();
  };
  handleChange = (e) => {
    this.setState(
      {
        searchTerm: e.target.value,
      },
      () => this.searchFunction()
    );
  };
  createGroup = () => {
    fetch(`${APIURL}/group/`, {
      method: 'POST',
      body: JSON.stringify({
        groupName: null,
        address: null,
        phone: null,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((json) => this.fetchGroup(json.id));
  };
  deleteUser = (id) => () => {
    fetch(`${APIURL}/group/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then(this.fetchGroupList);
  };
  searchFunction = () => {
    let items = this.state.groups?.sort().filter((group) => {
      let found = false;
      let search =
        (group.groupName ? group.groupName.toLowerCase() : '') +
        ' ' +
        (group.address ? group.address.toLowerCase() : '') +
        (group.guests
          ? group.guests
              ?.map(
                (item) =>
                  (item.firstName ? item.firstName.toLowerCase() : '') +
                  (item.firstName && item.lastName ? ' ' : '') +
                  (item.lastName ? item.lastName.toLowerCase() : '')
              )
              .join(' ')
          : '');
      console.log(search);
      if (search.includes(this.state.searchTerm.toLowerCase())) {
        found = true;
      }
      return found;
    });

    this.setState({
      filteredGroups: items,
    });
  };
  handleOpen = () => this.setState({ open: true });

  componentDidMount() {
    this.fetchGroupList();
  }
  handleErrors = (response) => {
    console.log(response);
    if (response.message === 'Not Authorized') {
      this.handleOpen();
    } else {
      return response;
    }
  };

  fetchGroupList = () => {
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
        .then((groupData) => {
          this.setState({
            groups: groupData,
            filteredGroups: groupData,
          });
        });
    } else {
      this.handleOpen();
    }
  };

  fetchGroup = (id) => {
    if (localStorage.token) {
      fetch(`${APIURL}/group/${id}`, {
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
            group: guestData,
          });
        })
        .then(() => this.setState({ openDialog: true }));
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
        <Grid
          item
          md={2}
          spacing={2}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            fullWidth
            variant='outlined'
            placeholder='Search'
            onChange={_.debounce(this.handleChange, 300)}
          />
        </Grid>

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
                : 'Only admins may add groups'
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
                onClick={this.createGroup}
                style={{ height: '36px' }}
              >
                Add Group
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Box>
    );
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
              this.props.role !== 'Admin'
                ? 'Only admins may delete users'
                : params.row.guests.length > 0
                ? 'Can only delete groups with no members'
                : 'Delete group'
            }
          >
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton
                aria-label='delete'
                onClick={this.deleteUser(params.id)}
                disabled={
                  this.props.role !== 'Admin' || params.row.guests.length > 0
                    ? true
                    : false
                }
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
            onClick={() => this.fetchGroup(params.id)}
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
          {this.state.group ? (
            <EditGroup
              group={this.state.group}
              fetchGroupList={this.fetchGroupList}
              groups={this.state.groups}
            />
          ) : null}
          <DialogActions style={{ background: 'rgba(255,255,255,.2)' }}>
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
            {this.state.groups ? (
              <DataGrid
                density='comfortable'
                //@ts-ignore
                columns={columns}
                //@ts-ignore
                rows={this.state.filteredGroups}
                onEditCellChangeCommitted={this.handleEditCellChange}
                components={{ Toolbar: this.CustomToolbar }}
                disableColumnMenu
              />
            ) : null}
          </Box>
        </Grid>
      </Grid>
    );
  }
}

export default GroupList;
