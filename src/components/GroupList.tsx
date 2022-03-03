//@ts-nocheck
import React, { useEffect, useState } from 'react';
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
import EditGroup from './EditGroup';
import APIURL from '../helpers/environment';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
var _ = require('lodash');

const CustomToolbar = ({ handleChange, createGroup }) => {
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
          onChange={_.debounce(handleChange, 300)}
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
        <Tooltip arrow placement='right' title={'Add A Guest'}>
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
              onClick={createGroup}
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
const GroupList = () => {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogClose = () => {
    setOpenDialog(false);
    fetchGroupList();
  };
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => searchFunction(), [searchTerm]);
  const createGroup = () => {
    fetch(`${APIURL}/group/`, {
      method: 'POST',
      body: JSON.stringify({
        groupName: null,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    }).then((json) => fetchGroup(json.id));
  };
  const deleteUser = (id) => () => {
    fetch(`${APIURL}/group/${id}`, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    }).then(fetchGroupList);
  };
  const searchFunction = () => {
    let items = groups?.sort().filter((item1) => {
      let search =
        (item1.groupName ? item1.groupName.toLowerCase() : '') +
        ' ' +
        (item1.guests
          ? item1.guests
              ?.map(
                (item) =>
                  (item.firstName ? item.firstName.toLowerCase() : '') +
                  (item.firstName && item.lastName ? ' ' : '') +
                  (item.lastName ? item.lastName.toLowerCase() : '')
              )
              .join(' ')
          : '');
      return search.includes(searchTerm.toLowerCase());
    });

    setFilteredGroups(items);
  };

  const handleOpen = () => setOpen(true);

  useEffect(() => fetchGroupList(), []);
  const handleErrors = (response) => {
    if (response.message === 'Not Authorized') {
      handleOpen();
    } else {
      return response;
    }
  };

  const fetchGroupList = () => {
    if (localStorage.token) {
      fetch(`${APIURL}/group/`, {
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
          setFilteredGroups(groupData);
        });
    } else {
      handleOpen();
    }
  };

  const fetchGroup = (id) => {
    if (localStorage.token) {
      fetch(`${APIURL}/group/${id}`, {
        method: 'GET',
        headers: new Headers({
          'Content-Type': 'application/json',
          Authorization: localStorage.token,
        }),
      })
        .then((response) => response.json())
        .then((response) => handleErrors(response))
        .then((guestData) => {
          setGroup(guestData);
        })

        .then(() => setOpenDialog(true));
    } else {
      handleOpen();
    }
  };
  const handleEditCellChange = (e) => {
    fetch(`${APIURL}/group/${e.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        [e.field]: e.value,
      }),
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: localStorage.token,
      }),
    });
  };

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
      field: 'members',
      headerName: 'Members',
      valueGetter: (params) =>
        params.row.guests
          ?.map((item) => item.firstName + ' ' + item.lastName)
          .join(', '),
      flex: 1,
    },
    {
      field: 'children',
      headerName: 'Children',

      flex: 0.5,
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
            params.row.guests.length > 0
              ? 'Can only delete groups with no members'
              : 'Delete group'
          }
        >
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton
              aria-label='delete'
              onClick={deleteUser(params.id)}
              disabled={params.row.guests.length > 0 ? true : false}
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
        <IconButton aria-label='edit' onClick={() => fetchGroup(params.id)}>
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
        {group ? (
          <EditGroup
            group={group}
            fetchGroupList={fetchGroupList}
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
          {groups ? (
            <DataGrid
              density='comfortable'
              //@ts-ignore
              columns={columns}
              //@ts-ignore
              rows={filteredGroups}
              onEditCellChangeCommitted={handleEditCellChange}
              disableColumnMenu
              components={{ Toolbar: CustomToolbar }}
              componentsProps={{
                toolbar: {
                  setSearchTerm: setSearchTerm,
                  createGroup: createGroup,
                  handleChange: handleChange,
                },
              }}
            />
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};

export default GroupList;
