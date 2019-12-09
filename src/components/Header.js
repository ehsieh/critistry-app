import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import { useApolloClient } from 'react-apollo-hooks';
import { useHistory } from "react-router-dom";

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
    marginLeft: theme.spacing(2)
  }
}));

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const client = useApolloClient();
 

  const SignOut = () => {
    localStorage.removeItem('auth-token');
    client.writeData({ data: { isLoggedIn: false } });
    history.push('/');
  }

  function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget)
      console.log(event.currentTarget)
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    return data.isLoggedIn ?
      <React.Fragment>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AddIcon />}
          href="/new-request"
        >New Request</Button>        
        <Avatar 
          aria-controls="user-menu"
          aria-haspopup="true"
          className={classes.avatar} 
          src="http://localhost:4000/images/avatars/avatar-0.png"      
          onClick={handleClick}     
        />
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem component={Link} href="/profile">Profile</MenuItem>
          <MenuItem containerElement={<Link to="/my-requests" />}>My Requests</MenuItem>
          <MenuItem onClick={SignOut}>Sign Out</MenuItem>
        </Menu>

      </React.Fragment>
      :
      <React.Fragment>
        <Button href="/signin" color="inherit">Sign In</Button>
        <Button href="/signup" color="inherit">Sign Up</Button>
      </React.Fragment>
  }

  return (
    <div className={classes.root}>
      <AppBar>        
        <Toolbar>          
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" underline="none" href="/">Critistry</Link>
          </Typography>
          <IsLoggedIn />
        </Toolbar>
      </AppBar>
    </div>
  );
}