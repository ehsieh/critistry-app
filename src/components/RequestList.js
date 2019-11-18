import React from "react"
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
import { ThemeProvider, useTheme, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import RequestCard from "../components/RequestCard"

const GET_REQUESTS = gql`
{
    critRequests
    {
      id
      title
      description
      image
      user
      {
        username
        id
      }
    }
  }
`;

function useWidth() {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
      keys.reduce((output, key) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const matches = useMediaQuery(theme.breakpoints.up(key));
        return !output && matches ? key : output;
      }, null) || 'xs'
    );
  }

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    gridList: {
      width: '100%',
      
    },
  }));

export function RequestList() {
  const { loading, error, data } = useQuery(GET_REQUESTS);
  const classes = useStyles();
  const width = useWidth();

  const getGridListCols = () => {
    if (width === 'xl') {
      return 4;
    }

    if (width ==='lg') {
      return 3;
    }

    if (width === 'md') {
      return 2;
    }

    return 1;
  }

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log("width: " + width);
  return (    
    <GridList cellHeight={300} className={classes.gridList} cols={getGridListCols()}>
    {data.critRequests.map(r => (
      <GridListTile key={r.id} cols={1}>
        <img src={r.image} alt={r.title} />
        <GridListTileBar
            title={r.title}
            subtitle={<span>by: {r.user.username}</span>}        
        />
      </GridListTile>
    ))}
  </GridList>
  );
}

export default RequestList