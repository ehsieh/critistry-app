import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from '@material-ui/core/Link';
import { useApolloClient } from 'react-apollo-hooks';
import { useHistory } from "react-router-dom";
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  avatar: {
    width: 50,
    height: 50,    
    cursor: 'pointer',    
  },
  avatarButton: {
    marginLeft: theme.spacing(2)
  }
}));

const IS_LOGGED_IN = gql`
  query Me {
    me 
    {
      username
      id
      avatar
    }
  }
`;

export function LoggedInMenu() {
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
    console.log(event.currentTarget)
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const SignOut = () => {
    localStorage.removeItem('auth-token');
    client.writeData({ data: { isLoggedIn: false } });
    history.push('/');
  }

  const classes = useStyles();  
  const history = useHistory();
  const client = useApolloClient();
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  const [anchorEl, setAnchorEl] = useState(null);

  if (loading) return (<React.Fragment/>);
  return (
    <React.Fragment>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AddIcon />}
          href="/new-request"
        >New Request</Button>        
        <IconButton className={classes.avatarButton} >
          <Avatar 
            aria-controls="user-menu"
            aria-haspopup="true"     
            className={classes.avatar}       
            src={data.me.avatar}
            onClick={handleClick}     
          />
        </IconButton>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} href="/profile">Profile</MenuItem>
          <MenuItem component={Link} href="/my-requests">My Requests</MenuItem>
          <MenuItem onClick={SignOut}>Sign Out</MenuItem>
        </Menu>

      </React.Fragment>
  )
};

export default LoggedInMenu;