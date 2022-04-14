import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import './Login.css';


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

    // Function called when form submit is pressed
    const submitLogin = async function (context)
    {
        // Disable default page refresh
        context.preventDefault();

        // Fetch from server auth module
        const res = await fetch('http://localhost:3000/auth/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              email: context.target[0].value,
              password: context.target[1].value
          })
        });
        const data = await res.json();

        // If access_token doesnt exist in response, fail
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
        return ;
    }


    return (
      <div>
        <Header />
        <form onSubmit={submitLogin}>
            <p><label>Email: </label><input type='text' value={state.email}  onChange={(e) => { setState({...state, email: e.target.value}) }} /></p>
            <p><label>Password: </label><input type='password' value={state.password} onChange={(e) => { setState({...state, password: e.target.value}) }} /></p>
            <p><input type='submit' value='submit' /></p>
        </form>
        <p className='errorMsg'>{state.errorMsg}</p>
        <p>Not a member? <Link to='/signup'>Create Account</Link></p>
      </div>
    );
}

export default Login;
