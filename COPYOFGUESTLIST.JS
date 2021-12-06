//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
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
import EditGuest from './src/components/EditGuest';
import APIURL from './src/helpers/environment';
import Stats from './src/components/Stats';
import { useWhatChanged } from '@simbathesailor/use-what-changed';

var _ = require('lodash');

const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGuest, setNewGuest] = useState(null);
  const [role, setRole] = useState(undefined);
  const [stats, setStats] = useState('');
  const [search, setSearch] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuestList();
    fetchGroups();
    fetchStats();
  }, []);

  let deps = [
    guests,
    filteredGuests,
    open,
    groups,
    openDialog,
    newGuest,
    role,
    stats,
    search,
    searchTerm,
  ];

  useWhatChanged(
    deps,
    'guests,filteredGuests,open,groups,openDialog,newGuest,role,stats,search,searchTerm,'
  );
  useEffect(() => {
    console.log(searchTerm);
  }, deps);

  useEffect(() => {
    let items = guests?.sort().filter((guest) => {
      let found = false;
      let search =
        (guest.firstName ? guest.firstName.toLowerCase() : '') +
        ' ' +
        (guest.lastName ? guest.lastName.toLowerCase() : '');
      if (search.includes(searchTerm.toLowerCase())) {
        found = true;
      }
      return found;
    });
    setFilteredGuests(items);
  }, [searchTerm, guests]);

  const CustomToolbar = () => {
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
              size='small'
              variant='outlined'
              key='search'
              placeholder='Search your name here'
              onChange={_.debounce((e) => setSearchTerm(e.target.value), 300)}
            />
          </Grid>
          <Stats data={stats} />

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
                role === 'Admin' ? 'Add A Guest' : 'Only admins may add users'
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
                  disabled={role !== 'Admin' ? true : false}
                  onClick={createUser}
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

  const fetchStats = () => {
    fetch(`${APIURL}/guest/master/count`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((json) => setStats(json));
  };

  const handleErrors = (response) => {
    if (response.message === 'Not Authorized') {
      setOpen(true);
    } else {
      return response;
    }
  };
  const fetchGroups = () => {
    fetch(`${APIURL}/group/names`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((response) => handleErrors(response))
      .then((groupData) => {
        setGroups(groupData);
      });
  };
  const fetchGuestList = () => {
    if (localStorage.token) {
      fetch(`${APIURL}/guest/master/`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((response) => handleErrors(response))
        .then((guestData) => {
          setGuests(guestData);
          // setFilteredGuests(guestData);
        });
    } else {
      setOpen(true);
    }
  };

  const deleteUser = (id) => () => {
    fetch(`${APIURL}/guest/master/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then(fetchGuestList);
  };

  const createUser = () => {
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
      .then((json) => fetchGuest(json.id));
  };

  const fetchGuest = (id) => {
    fetch(`${APIURL}/guest/master/${id}`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((json) => setNewGuest(json))
      .then(() => setOpenDialog(true));
  };

  const handleEditCellChange = (e) => {
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

  const handleDialogClose = () => {
    seOpenDialog(false);
    fetchGuestList();
    forceUpdate();
  };

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
      valueGetter: (params) => groups[params.value],
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
            role === 'Admin' ? 'Delete Guest' : 'Only admins may delete users'
          }
        >
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              aria-label='delete'
              onClick={deleteUser(params.id)}
              disabled={role !== 'Admin' ? true : false}
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
        <IconButton aria-label='edit' onClick={() => fetchGuest(params.id)}>
          <EditIcon color='primary' />
        </IconButton>
      ),
    },
  ];

  return (
    <Grid container>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
      >
        {newGuest ? (
          <EditGuest
            guest={newGuest}
            fetchGuestList={fetchGuestList}
            groups={groups}
          />
        ) : null}

        <DialogActions>
          <Typography variant='subtitle2' style={{ color: 'white' }}>
            Changes saved automatically
          </Typography>
          <Button
            onClick={handleDialogClose}
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
          {guests ? (
            <DataGrid
              id='datagrid'
              density='comfortable'
              columns={columns}
              disableColumnMenu
              rows={filteredGuests}
              onEditCellChangeCommitted={handleEditCellChange}
              components={{ Toolbar: CustomToolbar }}
            />
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GuestList;
