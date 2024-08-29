import React, { useState }  from 'react';

import UserPool from "../userPool";
import {CognitoUserPool} from "amazon-cognito-identity-js";

function SignUp(props) {

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [password, setPassword] = useState("");

    const onSubmit = (event) => {
      event.preventDefault();

      UserPool.signUp(email, password, [], null, (err, data) => {
        if (err) {
          console.error(err);
          setMessage(err.message);
        }else{
          console.log(data);
          window.location = "/login"
        }

      });
    };

    return (
      <div>
      <div style={{textAlign: "center", position: 'relative', left: '35%', marginTop: '45px'}}>
        <div className="form" style={{height: "450px"}}>
          <div className="title">Sign Up</div>
          <div className="input-container ic1">
              <input id="email" className="input" type="email" onChange={(event) => setEmail(event.target.value)} value={email} placeholder=" " />
              <label htmlFor="email" className="placeholder">Email</label>
          </div>
          <div className="input-container ic2">
              <input id="password" className="input" type="password" placeholder=" " onChange={(event) => setPassword(event.target.value)} value={password} />
              <label htmlFor="password" className="placeholder">Password</label>
          </div>

          <button type="text" className="submit" onClick={(e)=>onSubmit(e)}>Sign Up</button>

        </div>
      </div>
      <div>
      {
        message &&
        <h4 style={{backgroundColor: '#f88379', padding:"20px", borderRadius: "10px"}}>{message}</h4>
      }
      </div>
      </div>
    );
}

export default SignUp;