import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';

//import OAuth2Login from 'react-simple-oauth2-login';
import OAuth2Login from '@okteto/react-oauth2-login';


function Login()
{
  // State variables
    const [state, setState] = useState({
        errorMsg: '',
    });

    // Set navigate to redirect
    const navigate = useNavigate();

    // Function if param is found on hook bellow
    const handleParam = async function (code: string)
    {
      console.log(`Code received in frontend param is: ${code}`);

      // Fetch from server auth module
      const res = await fetch('http://localhost:3000/auth/intra', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            code: code,
        })
      });
      const data = await res.json();

      console.log('Response from nestjs API: ');
      console.log(data);

      window.localStorage.setItem('pongJwtToken', data.access_token);

      navigate('/');
    }

    // Hook for grabbing params is available
    const [searchParams, setSearchParams] = useSearchParams();
    const codeParam: any = searchParams.get("code");

    console.log(`Type of codeParam: ${typeof(codeParam)}\ncodeParam: ${codeParam}`);
    
    if (typeof(codeParam) !== 'object')
    {
      handleParam(codeParam);
    }


    return (        
        <div className='flex-container'>
          <div className='content-container'>
            <div className='form-container'>
            <h1>Login</h1>
            <h2>
            with <a href='https://api.intra.42.fr/oauth/authorize?client_id=abca6ca80c3cfa53d70d3e5d123f009ab5b31cc0e5e9710aa1e93c967fb96e7d&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogin&response_type=code'>intra42!</a>
            </h2>
            <p className='errorMsg'>{state.errorMsg}</p>
              
            </div>
          </div>
        </div>
    );
}

export default Login;