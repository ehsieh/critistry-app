import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useMutation, useApolloClient } from 'react-apollo-hooks';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function NewRequestFrom() {
  const NEW_REQUEST_MUTATION = gql`
  mutation create_crit_request($title: String!, $description: String!, $image: String!) {
    create_crit_request(title: $title, description: $description, image: $image) {      
      id
      title
      description
      image
    }
  }
  `;

  const history = useHistory();    
  const classes = useStyles();
  const client = useApolloClient();
  const [create_new_request, { data }] = useMutation(NEW_REQUEST_MUTATION);    
  const [request, setRequest] = useState({
    title: "",
    description: "",
    image: ""
  })

  const handleChange = name => event => {
    setRequest({
      ...request,
      [name]: event.target.value
    }
    );
  };

  const isFormValid = event => {
    return (
      request.title.length > 0 &&
      request.description.length > 0 &&
      request.image.length > 0
    );
  };

  /*
  const handleErrors = (errors) => {
    console.log(errors);        
    user.usernameError = null;
    user.emailError = null;
    user.passwordError = null;
    
    console.log(user);

    if (errors[0].details) {
      if (errors[0].details.username) {        
        user.usernameError = errors[0].details.username[0];        
      }

      if (errors[0].details.email) {
        user.emailError = errors[0].details.email[0];  
      }

      if (errors[0].details.password) {
        user.passwordError = errors[0].details.password[0];    
      }      
    }

    setUser({
      ...user,     
    });
  };
*/
  return (  
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddCircleOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Crit Request
        </Typography>
        <form 
          className={classes.form} 
          noValidate
          onSubmit={e => {
            console.log(request);
            e.preventDefault();
            create_new_request({ variables: 
              { 
                title: request.title, 
                description: request.description, 
                image: request.image
              } })
              .then((result) => {
                console.log(result);                
                history.push('/');
              })
              .catch(error => {
                console.log(error.graphQLErrors);
                //handleErrors(error.graphQLErrors);
              });
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField                
                name="title"
                variant="outlined"
                required
                fullWidth
                id="title"
                label="Title"
                value={request.title}
                onChange={handleChange('title')}
                autoFocus
                //error={user.usernameError != null}
                //helperText={user.usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                rows="5"                
                id="description"
                label="Description"
                name="description"
                value={request.description}
                onChange={handleChange('description')}                
                //error={user.emailError != null}
                //helperText={user.emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="image"
                label="Image"                
                id="image"
                value={request.image}
                onChange={handleChange('image')}
                //error={user.passwordError != null}
                //helperText={user.passwordError}
              />
            </Grid>                      
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isFormValid()}
            className={classes.submit}
          >
            Submit
          </Button>          
        </form>
      </div>
    </Container>
  );
}