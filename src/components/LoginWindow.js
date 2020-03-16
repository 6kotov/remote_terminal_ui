import React from "react";
import { KeyIcon } from "@patternfly/react-icons";
import { UserIcon } from "@patternfly/react-icons";

function LoginWindow() {
  return (
    <div className="modal">
      <form className="modal-body">
        <div className="modal-header"> Welcome to remote terminal </div>
        <div className='login'>
        <label for="login">Login</label>
        <div>
          <UserIcon />
          <input name="login" />
        </div>
        <label for="pass">Password</label>
        <div>
          <KeyIcon /> <input name="pass" />
        </div>
        <button type="submit" className="loginButton margin">
          Login
        </button>
        </div>
      </form>
    </div>
  );
}

export default LoginWindow;
