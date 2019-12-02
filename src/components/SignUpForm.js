import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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

export default function SignUpForm() {
  const SIGNUP_MUTATION = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        username
      }
    }
  }
  `;

  const history = useHistory();
  const classes = useStyles();
  const client = useApolloClient();
  const [signUp, { data }] = useMutation(SIGNUP_MUTATION);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    usernameError: null,
    emailError: null,
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
      user.email.length > 0 &&
      user.password.length > 0
    );
  };

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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={e => {
            e.preventDefault();
            signUp({
              variables:
              {
                username: user.username,
                email: user.email,
                password: user.password
              }
            })
              .then((result) => {
                console.log(result.data.signup.token);
                localStorage.setItem('auth-token', result.data.signup.token);
                client.writeData({ data: { isLoggedIn: true } });
                history.push('/');
              })
              .catch(error => {
                handleErrors(error.graphQLErrors);
              });
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="username"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="User Name"
                value={user.username}
                onChange={handleChange('username')}
                autoFocus
                error={user.usernameError != null}
                helperText={user.usernameError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={user.email}
                onChange={handleChange('email')}
                autoComplete="email"
                error={user.emailError != null}
                helperText={user.emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={user.password}
                onChange={handleChange('password')}
                autoComplete="current-password"
                error={user.passwordError != null}
                helperText={user.passwordError}
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
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}