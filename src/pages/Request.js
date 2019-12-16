import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { useParams } from "react-router-dom"
import Loading from "../components/Loading"
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';

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
    width: '70px',
    height: '70px',
    margin: theme.spacing(2),    
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  image: {
    maxWidth: '400px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  button: {
    marginTop: theme.spacing(2)
  },  
  list: {
    width: '100%',    
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  postTitle: {
    color: theme.palette.primary.main
  },
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
          avatar
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

export default function Request() {

  const truncate = (input, max) => input.length > max ? `${input.substring(0, max)}...` : input;

  const classes = useStyles();
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_CRIT_REQUEST_QUERY, {
    variables: { "id": id }
  });

  if (loading) return (<Loading/>);
  if (error) return `Error! ${error.message}`;
  console.log(data);
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <img alt="" className={classes.image} src={data.critRequest.image} />            
          </Grid>
          <Grid item xs={6}>
          <Typography className={classes.title} component="h1" variant="h5">
            {data.critRequest.title}
          </Typography>
            <Typography>
              {data.critRequest.description}
            </Typography>
            <Button
              variant="contained"
              color="default"
              className={classes.button}
              startIcon={<AddIcon />}
              href={`/request/${data.critRequest.id}/new-post`}
            >New Crit</Button>       
          </Grid>
        </Grid>
      </div>                  
      <List className={classes.list}>
        {data.critRequest.critPosts.map(p => (
          <React.Fragment>
            <Divider component="li" />
            <Tooltip title="Click to view post details">
            <ListItem component="a" href={`/post/${p.id}`}>
              <ListItemAvatar>
                <Avatar className={classes.avatar} src={p.user.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography className={classes.postTitle}>{p.user.username}</Typography>                
                }
                secondary={truncate(p.postText, 300)}
              />                            
            </ListItem>               
            </Tooltip>
          </React.Fragment>     
        ))}
      </List>                      
    </Container>
  );
}
