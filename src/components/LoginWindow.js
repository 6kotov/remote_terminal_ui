import React, {useState} from "react";
import { KeyIcon, UnlockedIcon, UserIcon  } from "@patternfly/react-icons";

function LoginWindow() {
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');

  function onChangeHandle (event) {
    const name = event.target.name,
          value = event.target.value;

    switch (name) {
      case "login":
        return setLogin(value)
      case 'pass':
        return setPassword(value)
      default:return
    }
  }
  return (
    <div className="modal">
      <form className="modal-body">
        <div className="modal-header"> Welcome to remote terminal </div>
        <div className='login'>
        <label htmlFor="login" className='yes'>Login</label>
        <div>
          <UserIcon />
          <input className='yes' name="login" value={login} onChange={onChangeHandle} />
        </div>
        <label htmlFor="pass" className='yes'>Password</label>
        <div>
         <UnlockedIcon/> <input className='yes' name="pass" value={password}  onChange={onChangeHandle} />
        </div>
        <button type="submit" className="loginButton margin">
          Login  <KeyIcon />
        </button>
        </div>
      </form>
    </div>
  );
}

export default LoginWindow;
