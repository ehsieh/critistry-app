import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from "react-router-dom"

const useStyles = makeStyles(theme => ({

  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(12),
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
  image: {
    width: '700px'
  }
}));

const GET_CRIT_POST_QUERY = gql`
  query GetCritPost($id: String!) {
    critPost(id: $id) {
      id
      postText
      annotation
      critRequest
      {
        id
        title
        image
        user
        {
          username
        }
      }        
    }
  }
`;

export default function Post() {
  const classes = useStyles();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CRIT_POST_QUERY, {
    variables: { "id": id }
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log(data);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          {data.critPost.critRequest.title}
        </Typography>
        <img alt="" class={classes.image} src={data.critPost.critRequest.image} />
        <Typography component="h5" variant="h6">
          {data.critPost.postText}
        </Typography>
        <Typography component="h5" variant="h6">
          {data.critPost.annotation}
        </Typography>
      </div>
    </Container>
  );
}
