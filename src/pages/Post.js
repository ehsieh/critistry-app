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
    maxWidth: '700px'
  },
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0
  },
  canvasContainer: {
    position: 'relative'
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  postText: {
    marginTop: theme.spacing(2)
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

  const fabric = require('fabric').fabric;

  const onImageLoad = event => {
    const img = event.target;
    var context = document.getElementById('layer1').getContext("2d");
    var context2 = document.getElementById('layer2').getContext("2d");
    context.canvas.width  = img.width;
    context.canvas.height = img.height;
    context2.canvas.width  = img.width;
    context2.canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    img.style.display = "none";
    const canvas = new fabric.Canvas('layer2', {
        isDrawingMode: true
    })
    canvas.loadFromJSON(data.critPost.annotation);
  };

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log(data);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography className={classes.title} component="h1" variant="h5">
          {data.critPost.critRequest.title}
        </Typography>
        <div className={classes.canvasContainer}>
          <img hide alt="" onLoad={onImageLoad} className={classes.image} src={data.critPost.critRequest.image} />        
          <canvas id="layer1" className={classes.canvas}></canvas>
          <canvas id="layer2" className={classes.canvas}></canvas>
        </div>
        <Typography className={classes.postText} component="h5" variant="h6">
          {data.critPost.postText}
        </Typography>        
      </div>
    </Container>
  );
}
