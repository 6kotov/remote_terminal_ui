import React from "react";

function LoginWindow() {


  return (
    <div className="modal">
      <form className="modal-body">
          <h2>Welcome to remote terminal</h2>
        <label for='login'>Login</label>
        <input name="login" />
        <label for='pass'>Password</label>
        <input name="pass" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginWindow;
