import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import './Login.css';

import GoogleLogin from 'react-google-login';

function Login()
{
  // State variables
    const [state, setState] = useState({
        email: '',
        password: '',
        errorMsg: '',
    });
    

    // Set navigate to redirect
    const navigate = useNavigate();

    // Function called when google login fails.
    const handleLoginFail = function (googleData)
    {
      console.log(googleData);
      setState({...state, errorMsg: `Error, ${googleData.error}`,});
    }

    // Function called when form submit succeeds
    const handleLogin = async function (googleData)
    {

        console.log(googleData);

        // Fetch request from API server with response from google
        const res = await fetch("http://localhost:3000/auth/google", {
            method: "POST",
            body: JSON.stringify({
            token: googleData.tokenId
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await res.json()
        
        console.log(data);

        if (!data.access_token)
        {
          setState({...state, errorMsg: `Error! ${data.message}.`});
        }
        else
        {
          window.localStorage.setItem('pongJwtToken', data.access_token);
          navigate('/');
        }

        return;


        // Fetch from server auth module
        //const res = await fetch('http://localhost:3000/auth/signin', {
        //  method: 'POST',
        //  headers: {
        //    'Content-Type': 'application/json',
        //  },
        //  body: JSON.stringify({
        //      email: context.target[0].value,
        //      password: context.target[1].value
        //  })
        //});
        //const data = await res.json();
//
        //// If access_token doesnt exist in response, fail
        //console.log(data);
        //if (!data.access_token)
        //{
        //  setState({...state, errorMsg: `Error! ${data.message}.`});
        //}
        //else
        //{
        //  window.localStorage.setItem('pongJwtToken', data.access_token);
        //  navigate('/');
        //}
        //return ;
    }


    return (
      <div>
        <Header />
        <p>
          <GoogleLogin
          clientId="199578032568-g8jeh6h9af506i4dhcvucvpmfjghs69u.apps.googleusercontent.com"
          buttonText="Log in with Google"
          onSuccess={handleLogin}
          onFailure={handleLoginFail}
          cookiePolicy={'single_host_origin'}
          />
        </p>
        <p className='errorMsg'>{state.errorMsg}</p>
      </div>
    );
}

export default Login;
