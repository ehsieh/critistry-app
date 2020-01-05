import React, { useState, useCallback, useRef } from 'react';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { useDropzone } from "react-dropzone";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
import ImageSearchOutlinedIcon from '@material-ui/icons/ImageSearchOutlined';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'none',
  },
  upload: {
    width: '100%',
    height: '300px',
    textAlign: 'center',    
  },
  preview: {
    paddingTop: theme.spacing(2),    
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  image: {
    maxWidth: '700px'
  },
  icon: {
    width: '100px',
    height: '100px',
    marginTop: theme.spacing(7),
    marginLeft: theme.spacing(2)
  },
  text: {
    marginBottom: theme.spacing(2)
  }
}));

export default function ImagePicker() {
  const classes = useStyles();
  const onDrop = useCallback(files => {        
    const reader = new FileReader();
    reader.onloadend = (e) => {
      console.log(files[0]);

      setState({
        ...state,
        isDialogOpen: true
      })
      /*
      setRequest({
        ...request,
        imageData: reader.result,
        hasImage: true,
        image: files[0]
      });*/      
    };    
    reader.readAsDataURL(files[0]);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const [state, setState] = useState({      
    image: null,
    thumbnail: null,
    isDialogOpen: false
  })

  const handleDialogClose = () => {
    setState({      
      ...state,
      isDialogOpen: false
    })
  };

  const onCrop = () => {        
    const img = cropper.current.getCroppedCanvas().toDataURL("image/jpeg", 0.7);    
    setState({
      ...state,
      thumbnail: img
    })    
    console.log(img);
  };

  const cropper = useRef(null);

  return (
    <React.Fragment>
      <Paper className={classes.upload} elevation={2}>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <React.Fragment>
              <ImageSearchOutlinedIcon className={classes.icon}/>
              <Typography className={classes.text}>
                Drop the file here!
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <ImageSearchOutlinedIcon className={classes.icon}/>
              <Typography className={classes.text}>
                Drag and drop your image here or
              </Typography>
              <input
                accept="image/*"
                className={classes.input}
                id="button-file"
                type="file"
              />
              <label htmlFor="button-file">
                <Button
                  component="span"
                  variant="contained"
                  color="primary"                                    
                >
                  Browse for image
                </Button>
              </label>
            </React.Fragment>
          )}
        </div>        
      </Paper>
      <Dialog
        onClose={handleDialogClose}
        aria-labelledby="image-picker" 
        open={state.isDialogOpen}>
          <DialogTitle id="image-picker">Select your image thumbnail</DialogTitle>            
          <Cropper
            ref={cropper}
            preview='.img-preview'
            src={"http://localhost:4000/images/crit-images/crit-image-9.jpg"}
            style={{height: '400px', width: '100%'}}
            // Cropper.js options
            aspectRatio={1 / 1}
            guides={false}
            scalable={false}
            zoomable={false}
            autoCrop={true}
            cropend={onCrop}
          />
          <Paper className={classes.preview} elevation={2}>
            <div className={"img-preview"} style={{overflow: 'hidden', width: '300px', height: '300px'}}/>          
            <Button
              component="span"
              variant="contained"
              color="primary"    
              className={classes.button}                                
            >
              Crop Thumbnail
            </Button>
          </Paper>
      </Dialog>
    </React.Fragment>
  )
};
