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
    </React.Fragment>
  )
};
