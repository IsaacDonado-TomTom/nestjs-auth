import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header.tsx';
import './Signup.css';


function Signup()
{
  // State variables
  const [state, setState] = useState({
      email: '',
      password: '',
      nickname: '',
      errorMsg: '',
  });

  // Set naviate for redirection
  const navigate = useNavigate();


  // Function called when form submit button is pressed
  const submitSignUp = async function (context)
  {
    
    context.preventDefault();

    const res = await fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          email: context.target[0].value,
          nickname: context.target[1].value,
          password: context.target[2].value
      })
    });
    const data = await res.json();

    console.log(data);

    // If access_token doesn't exist in response, fail
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
        <form onSubmit={submitSignUp}>
            <p><label>Email: </label><input type='text' value={state.email}  onChange={(e) => { setState({...state, email: e.target.value}) }} /></p>
            <p><label>Nickname: </label><input type='text' value={state.nickname}  onChange={(e) => { setState({...state, nickname: e.target.value}) }} /></p>
            <p><label>Password: </label><input type='password' value={state.password} onChange={(e) => { setState({...state, password: e.target.value}) }} /></p>
            <p><input type='submit' value='submit' /></p>
        </form>
        <p className='errorMsg'>{state.errorMsg}</p>
        <p>Already a member? <Link to='/login'>Log in</Link></p>
      </div>
    );
}

export default Signup;
