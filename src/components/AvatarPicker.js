import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import  Loading from "./Loading";

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(10),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(2),    
    width: '120px',
    height: '120px'
  },
  avatarSmall: {    
    width: '70px',
    height: '70px'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function AvatarPicker(props) {

  const DEFAULT_AVATARS = gql`
    query DefaultAvatars {
      defaultAvatars
    }
  `;

  const [state, setState] = useState({      
    avatar: "",  
    avatarPickerOpen: false
  })

  const handleAvatarPickerOpen = () => {
    setState({      
      ...state,
      avatarPickerOpen: true
    })
  };

  const handleAvatarPickerClose = () => {
    setState({ 
      ...state,     
      avatarPickerOpen: false
    })
  };

  const handleAvatarClick = (avatar) => {
    setState({ 
      avatar: avatar,
      avatarPickerOpen: false
    })
    props.onAvatarSelected(avatar);    
  };

  const classes = useStyles();
  const { loading, error, data } = useQuery(DEFAULT_AVATARS, {
    onCompleted: () => {
      console.log('onCompleted')
      setState({
        ...state,
        avatar: data.defaultAvatars[0]
      })
      props.onAvatarSelected(data.defaultAvatars[0]);
    }
  });

  if (loading) return (<Loading/>);  
  return (
    <React.Fragment>
      <Dialog
        onClose={handleAvatarPickerClose}
        aria-labelledby="avatar-picker" 
        open={state.avatarPickerOpen}>
          <DialogTitle id="avatar-picker">Pick your avatar</DialogTitle>            
          <List>
            {data.defaultAvatars.map(avatar => (
               <Grid 
                container
                direction="row"
                justify="center"
                alignItems="center">
                  <Grid item>
                    <IconButton onClick={() => handleAvatarClick(avatar)}>
                      <Avatar className={classes.avatarSmall} src={avatar} />
                    </IconButton>
                  </Grid>
                </Grid>               
             ))

            }
          </List>
      </Dialog>

      <Avatar 
        className={classes.avatar} 
        src={state.avatar}
      />
      <Button 
        variant="contained"
        color="primary"
        onClick={handleAvatarPickerOpen}
      >
          Change Avatar
      </Button>
    </React.Fragment>
  )
};

export default AvatarPicker;