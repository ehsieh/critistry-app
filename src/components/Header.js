import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Link from '@material-ui/core/Link';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import LoggedOutMenu from "./LoggedOutMenu";
import LoggedInMenu from "./LoggedInMenu";

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
  const { data } = useQuery(IS_LOGGED_IN);

  return (
    <div className={classes.root}>
      <AppBar>        
        <Toolbar>          
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" underline="none" href="/">Critistry</Link>
          </Typography>
          {data.isLoggedIn ? <LoggedInMenu/> : <LoggedOutMenu/>}
        </Toolbar>
      </AppBar>
    </div>
  );
}