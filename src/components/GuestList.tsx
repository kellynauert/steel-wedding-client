//@ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Dialog,
  Box,
  IconButton,
  Button,
  DialogActions,
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
import APIURL from '../helpers/environment';
import Stats from './Stats';

var _ = require('lodash');
const CustomToolbar = ({ setSearchTerm, stats, createUser }) => {
  return (
    <Grid
      container
      alignItems='center'
      style={{
        padding: '12px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      }}
    >
      <Grid
        item
        container
        xs={12}
        style={{
          marginBottom: '24px',
        }}
      >
        <Stats data={stats} />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          fullWidth
          variant='outlined'
          key='search'
          placeholder='Search'
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Grid>
      <Grid item xs>
        <GridToolbarExport />
      </Grid>
      <Grid item xs={6} md={3}>
        <Button
          fullWidth
          variant='contained'
          color='secondary'
          style={{ whiteSpace: 'nowrap' }}
          startIcon={<AddIcon />}
          onClick={createUser}
        >
          Add Guest
        </Button>
      </Grid>
    </Grid>
  );
};
const GuestList = () => {
  const [guests, setGuests] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newGuest, setNewGuest] = useState(null);
  const [stats, setStats] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchGuestList();
    fetchGroups();
    fetchStats();
  }, []);
  useEffect(() => console.log(searchTerm), [searchTerm]);
  useEffect(() => {
    if (guests.length > 0) {
      let items = (guests || []).sort().filter((guest) => {
        let search =
          (guest.firstName ? guest.firstName.toLowerCase() : '') +
          ' ' +
          (guest.lastName ? guest.lastName.toLowerCase() : '');

        return searchTerm ? search.includes(searchTerm.toLowerCase()) : true;
      });
      setFilteredGuests(items);
    }
  }, [searchTerm, guests]);

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

  const fetchGroups = () => {
    fetch(`${APIURL}/group/names`, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    })
      .then((response) => response.json())
      .then((groupData) => {
        setGroups(groupData);
      });
  };

  const fetchGuestList = async () => {
    if (localStorage.token) {
      let thisData = await fetch(`${APIURL}/guest/master/`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      }).then((response) => response.json());

      fetch(`${APIURL}/plusone/`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((guestData) => {
          let allData = thisData;
          for (let guest of guestData) {
            let data = guest;
            data.id = `plusOne-${guest.id}`;
            data.attending = true;
            data.plusOneAllowed = false;
            data.over21 = null;
            allData.push(data);
          }
          console.log(allData, guests);
          setGuests(allData);
        });
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
    } else if (e.field === 'vegetarian') {
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
    setOpenDialog(false);
    fetchGuestList();
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
      valueGetter: (params) =>
        params.row.guest ? 'Plus One' : groups[params.value],
      flex: 0.5,
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
      field: 'vegetarian',
      headerName: 'Vegetarian',
      valueGetter: (params) => params.value,
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
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
      field: 'over21',
      headerName: 'Over 21',
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
      field: 'drinks',
      headerName: 'Drinks',
      flex: 0.5,
      headerAlign: 'center',
      align: 'center',
      editable: true,
      valueGetter: (params) => {
        let drinks = [];

        if (params.row.wine === true) {
          drinks.push('Wine');
        }
        if (params.row.beer === true) {
          drinks.push('Beer');
        }
        if (params.row.cider === true) {
          drinks.push('Cider');
        }
        return drinks;
      },
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
      field: 'plusone',
      headerName: 'Associated With',
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
          : params.row.guest
          ? !params.row.guest.firstName && !params.row.guest.lastName
            ? 'Unknown'
            : params.row.guest.firstName
            ? params.row.guest.firstName
            : null + ' ' + params.row.guest.lastName
            ? params.row.guest.lastName
            : null
          : null,
    },
    {
      field: 'delete',
      headerName: ' ',
      flex: 0.2,
      align: 'center',
      renderCell: (params) => (
        <IconButton aria-label='delete' onClick={deleteUser(params.id)}>
          <DeleteIcon />
        </IconButton>
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
              componentsProps={{
                toolbar: {
                  setSearchTerm: setSearchTerm,
                  stats: stats,
                  createUser: createUser,
                },
              }}
            />
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GuestList;
