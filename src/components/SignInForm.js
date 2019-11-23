import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from "graphql-tag";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInForm() {

  const SIGNIN_MUTATION = gql`
    mutation SignIn($username: String!, $password: String!) {
      signin(username: $username, password: $password) {
        token
        user {
          username
        }
      }
    }
  `;
  const classes = useStyles();
  const history = useHistory();      
  const client = useApolloClient();
  const [signIn, { data }] = useMutation(SIGNIN_MUTATION);    
  const [user, setUser] = useState({
    username: "",    
    password: "",
    usernameError: null,
    passwordError: null
  })

  const handleChange = name => event => {
    setUser({
      ...user,
      [name]: event.target.value
    }
    );
  };

  const isFormValid = event => {
    return (
      user.username.length > 0 &&      
      user.password.length > 0
    );
  };

  const handleErrors = (errors) => {
    console.log(errors);    
    if (errors[0].field == 'username') {
      setUser({
        ...user,
        usernameError: errors[0].message,
        passwordError: null
      });
    } else if (errors[0].field == 'password') {
      setUser({
        ...user,
        passwordError: errors[0].message,
        usernameError: null
      });
    }
    console.log(user);
  };

  //if (error) handleError();
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form 
          className={classes.form} 
          noValidate
          onSubmit={e => {
            e.preventDefault();
            signIn({ variables: 
              { 
                username: user.username,                 
                password: user.password
              } })
              .then((result) => {                
                console.log(result.data.signin.token);
                localStorage.setItem('auth-token', result.data.signin.token);   
                client.writeData({ data: { isLoggedIn: true } });
                history.push('/');
              })
              .catch(error => {
                handleErrors(error.graphQLErrors);
              });
          }}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="User Name"
            name="username"
            value={user.username}
            onChange={handleChange('username')}
            autoComplete="username"
            autoFocus            
            helperText={user.usernameError}
            error={user.usernameError != null}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={user.password}
            onChange={handleChange('password')}
            autoComplete="current-password"            
            helperText={user.passwordError}
            error={user.passwordError != null}
          />          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!isFormValid()}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
            
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>     
    </Container>
  );
}
