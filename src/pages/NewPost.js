import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { useParams } from "react-router-dom"
import { SliderPicker } from 'react-color';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const fabric = require('fabric').fabric;


const useStyles = makeStyles(theme => ({

  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(2),
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
    maxWidth: '600px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  tool: {
    marginTop: theme.spacing(2)
  },
  submit: {
    width: '200px',
    margin: theme.spacing(3, 0, 2),
  },
  canvas: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0
  },
  canvasContainer: {
    position: 'relative'
  }
}));

const GET_CRIT_REQUEST_QUERY = gql`
  query GetCritRequest($id: String!) {
    critRequest(id: $id) {
      id
      title
      description
      image
      critPosts
      {
        id
        postText
        user
        {
          username
        }
      }
      user
      {
        id
        username
      }
    }
  }
`;

export default function NewPost() {
  let canvas = null;

  const onImageLoad = event => {
    const img = event.target;
    var context = document.getElementById('layer1').getContext("2d");
    var context2 = document.getElementById('layer2').getContext("2d");
    context.canvas.width  = img.width;
    context.canvas.height = img.height;
    context2.canvas.width  = img.width;
    context2.canvas.height = img.height;
    context.drawImage(img, 0, 0, img.width, img.height);
    img.style.display = "none"
    canvas = new fabric.Canvas('layer2', {
          isDrawingMode: true
    });
    canvas.freeDrawingBrush.color = '#22194d';
    canvas.freeDrawingBrush.width = 4;
  };

  const handleColorChange = (color) => {
    canvas.freeDrawingBrush.color = color.hex;    
    console.log(color.hex);
  };

  const handleBrushSizeChange = (event, value) => {
    canvas.freeDrawingBrush.width = value;    
  };

  const classes = useStyles();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CRIT_REQUEST_QUERY, {
    variables: { "id": id }
  });

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log(data);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography className={classes.title} component="h1" variant="h5">
          {data.critRequest.title}
        </Typography>
        <div className={classes.canvasContainer}>
          <img hide alt="" onLoad={onImageLoad} className={classes.image} src={data.critRequest.image} />        
          <canvas id="layer1" className={classes.canvas}></canvas>
          <canvas id="layer2" className={classes.canvas}></canvas>
          <div className={classes.tool}>
          <Typography>
            Brush Color
          </Typography>
          <SliderPicker
            onChangeComplete={ handleColorChange }
          />          
          </div>
          <div className={classes.tool}>
          <Typography>
            Brush Size
          </Typography>
          <Slider
            defaultValue={4}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={1}
            marks
            min={1}
            max={20}
            onChange={handleBrushSizeChange}
          />
          </div>
        </div>

        <TextField
          className={classes.tool}
          variant="outlined"
          required
          fullWidth
          multiline
          rows="10"
          id="postText"
          label="Your Crit"
          name="postText"                              
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Submit
        </Button>
        
      </div>
    </Container>
  );
}
