import React from "react"
import { useQuery } from "react-apollo-hooks";
import gql from "graphql-tag";
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

export function RequestList() {
  const { loading, error, data } = useQuery(GET_REQUESTS);

  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  console.log(data.critRequests);
  return (
    <div>
        {data.critRequests.map(r => (
            <RequestCard key={r.id} request={r} />
        ))}
    </div>
  );
}

export default RequestList