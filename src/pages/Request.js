import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { useParams } from "react-router-dom"

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
    maxWidth: '400px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  title: {
    marginBottom: theme.spacing(2)
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

export default function Request() {
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
          </Grid>
        </Grid>
      </div>                  
                  
      {data.critRequest.critPosts.map(p => (
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.header}>Crit by: {p.user.username}</Typography>          
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {p.postText}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>      
      ))}
    </Container>
  );
}
