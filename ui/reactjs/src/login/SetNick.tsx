import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';

function Login()
{
  // State variables
    const [state, setState] = useState({
        errorMsg: '',
        nickname:''
    });

    // Set navigate to redirect
    const navigate = useNavigate();

    // Function if param is found on hook bellow
    const setNick = async function (context: any)
    {
      context.preventDefault();
      console.log('Trying to set nick');

      // Fetch from server auth module
      const res = await fetch('http://localhost:3000/auth/login/setnick', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('pongJwtAccessToken')}`,
        },
        body: JSON.stringify({
            nickname: context.target[0].value,
            refresh_token: window.localStorage.getItem('pongJwtRefreshToken'),
        })
      });

      navigate('/');
    }



    return (        
        <div className='flex-container'>
          <div className='content-container'>
            <div className='form-container'>

            <form onSubmit={ setNick }>
              <h1>
                Login
              </h1>
              <br />
              <br />
              <span className="subtitle">SET NICKNAME:</span>
              <br />
              <input type="text" name="nickname" value={ state.nickname } onChange={(e) => { setState({...state, nickname: e.target.value}) }} />
              <br /><br />
              <input type="submit" value="SUBMIT" className="submit-btn" />
            </form>
              
            </div>
          </div>
        </div>
    );
}

export default Login;