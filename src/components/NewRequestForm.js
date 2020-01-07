import React, { useState, useCallback, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ImageSearchOutlinedIcon from '@material-ui/icons/ImageSearchOutlined';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { useHistory } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import ImagePicker from './ImagePicker';

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
  upload: {
    width: '100%',
    height: '300px',
    textAlign: 'center',    
  },
  thumbnail: {
    width: '100%',
    height: '300px'
  },
  icon: {
    width: '100px',
    height: '100px',
    marginTop: theme.spacing(7),
    marginLeft: theme.spacing(2)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  description: {    
  },
  input: {
    display: 'none',
  },
}));

export default function NewRequestFrom() {
  const NEW_REQUEST_MUTATION = gql`
  mutation create_crit_request($title: String!, $description: String!, $thumbnail: String!, $file: Upload!) {
    create_crit_request(title: $title, description: $description, thumbnail: $thumbnail, file: $file) {      
      id
      title
      description
      image
    }
  }
  `;

  const history = useHistory();
  const classes = useStyles();
  const [create_new_request, { data }] = useMutation(NEW_REQUEST_MUTATION, {
    onCompleted: (data) => {      
      history.push('/');
    }
  });
  const [request, setRequest] = useState({
    title: "",
    description: "",
    hasImage: false,    
    image: null,    
    imageData: null,
    thumbnail:null,
    hasThumbnail: false
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
      request.image != null
    );
  };
  
  const onImagePicked = (image, thumbnail) => {
    setRequest({
      ...request,
      image: image,
      thumbnail: thumbnail,
      hasThumbnail: true
    });
    console.log(image);
    console.log(thumbnail);
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>        
        <Typography component="h1" variant="h5">
          Create Crit Request
        </Typography>
        <form
          className={classes.form}
          noValidate
          onSubmit={e => {
            console.log(request);
            e.preventDefault();
            
            create_new_request({
              variables:
              {
                title: request.title,
                description: request.description,
                file: request.image,
                thumbnail: request.thumbnail
              }
            })             
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={4}>
              {request.hasThumbnail ?               
                <img className={classes.thumbnail} src={request.thumbnail} />
                :
                <ImagePicker onImagePicked={onImagePicked} />                
              }
            </Grid>                         
            <Grid item xs={8}>
              <TextField
                name="title"
                variant="outlined"
                required
                fullWidth
                id="title"
                label="Title"
                value={request.title}
                className={classes.title}
                onChange={handleChange('title')}
                autoFocus              
              />
              <TextField
                variant="outlined"
                required
                fullWidth
                multiline
                rows="12"
                id="description"
                label="Description"
                name="description"
                value={request.description}
                className={classes.description}
                onChange={handleChange('description')}     
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