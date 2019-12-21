import React from "react";
import Button from '@material-ui/core/Button';

export function LoggedOutMenu() {  

  return (
    <React.Fragment>
      <Button href="/signin" color="inherit">Sign In</Button>
      <Button href="/signup" color="inherit">Sign Up</Button>
    </React.Fragment>
  )
};

export default LoggedOutMenu;