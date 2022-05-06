import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';

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
    return ;
    // Fetch from server auth module
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          code: code,
      })
    });
    const data = await res.json();
    window.localStorage.setItem('pongJwtAccessToken', data.access_token);
    window.localStorage.setItem('pongJwtRefreshToken', data.refresh_token);
    
    console.log(`AccessToken: ${data.access_token}\nRefreshToken: ${data.refresh_token}`);
    navigate('/');
  }

  // Request login
  const requestLogin = async function (accessToken, refreshToken)
  {
    console.log(accessToken, refreshToken);
    return new Promise(async function (resolve, reject)
    {
      let response = await fetch('http://localhost:3000/auth/checkToken', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${accessToken}`,
        }
      });
      let data = await response.json();
      if (data.statusCode === 200)
      {
        navigate('/');
      }
      else
      {
        response = await fetch ('http://localhost:3000/auth/checkRefreshToken', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${refreshToken}`,
          }
        });
        data = await response.json();
        if (data.statusCode === 200)
        {
          console.log('Refresh token detected, attempting to refresh access token');
          accessToken = await refresh(refreshToken);
          return await requestLogin(accessToken, refreshToken);
        }
        else
        {
          return false;
        }
      }
    });
  }

  // Refresh token if needed
  const refresh = function (refreshToken)
  {
    console.log("Refreshing token!");
    return (new Promise(async function (resolve, reject)
    {
      const response = await fetch('http://localhost:3000/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        }
      });
      const data = await response.json();
      if (data.statusCode === 200)
      {
        window.localStorage.setItem('pongJwtAccessToken', data.access_token);
        window.localStorage.setItem('pongJwtRefreshToken', data.refresh_token);
        resolve(data.access_token);
      }
      else
      {
        resolve(false);
      }
    }));
  }

  const hasAccess = async function (accessToken, refreshToken)
  {
    if (!refreshToken) return null;

    if (accessToken === undefined) {
        // generate new accessToken
        accessToken = await refresh(refreshToken);
        return accessToken;
    }

    return accessToken;
  }

  const protect = async function ()
  {
    let accessToken = window.localStorage.getItem('pongJwtAccessToken');
    let refreshToken = window.localStorage.getItem('pongJwtRefreshToken');

    accessToken = await hasAccess(accessToken, refreshToken);

    if (!accessToken)
    {
        setState({...state, errorMsg: 'Timed out, log in again.',});
    }
    else
    {
        await requestLogin(accessToken, refreshToken);
    }
  }


  // Hook for grabbing params is available
  const [searchParams, setSearchParams] = useSearchParams();
  const codeParam: any = searchParams.get("code");
  if (typeof(codeParam) !== 'object')
  {
    handleParam(codeParam);
  }

  //protect();


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