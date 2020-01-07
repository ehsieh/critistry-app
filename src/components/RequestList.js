import React from "react"
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Link from '@material-ui/core/Link';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Loading from "./Loading"

const GET_REQUESTS = gql`
{
    critRequests
    {
      id
      title
      description
      image
      thumbnail
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
    link: {
      color: theme.palette.common.white,      
    }
  }));

export function RequestList() {
  const { loading, error, data } = useQuery(GET_REQUESTS);
  const classes = useStyles();
  const width = useWidth();

  const getGridListCols = () => {
    if (width === 'xl') {
      return 8;
    }

    if (width ==='lg') {
      return 6;
    }

    if (width === 'md') {
      return 4;
    }

    if (width === 'sm') {
      return 2;
    }

    return 1;
  }

  if (loading) return (<Loading/>);
  if (error) return `Error! ${error.message}`;
  console.log("width: " + width);
  return (    
    <GridList cellHeight={260} className={classes.gridList} cols={getGridListCols()}>
    {data.critRequests.map(r => (
      <GridListTile key={r.id} cols={1}>
        <img src={r.thumbnail == null ? r.image : r.thumbnail} alt={r.title} />
        <GridListTileBar
            title={<Link className={classes.link} href={`/request/${r.id}`}>{r.title}</Link>}
            subtitle={<span>by: {r.user.username}</span>}        
        />
      </GridListTile>
    ))}
  </GridList>
  );
}

export default RequestList