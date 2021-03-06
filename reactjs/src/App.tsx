import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header.tsx';


function App()
{
  // State variables
  const [state, setState] = useState({
    pongJwtToken: '',
    userEmail: '',
    userNickname: ''
  });

  // Set navigate for redirecting
  let navigate = useNavigate();

  // fetch data logic from home module of server
  useEffect(function ()
  {
    const fetchHome = async function ()
    {
      // If pongJWtToken is not found in window.localStorage, navigate to loginpage
      if (typeof(window.localStorage.getItem('pongJwtToken')) === 'object')
      {
        navigate('/login');
      }

      // Logging token for debug
      console.log(`Attempting with token: ${window.localStorage.getItem('pongJwtToken')}`);

      // Fetch data
      const res = await fetch('http://localhost:3000/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('pongJwtToken')}`,
        }
      });
      const data = await res.json();

      // If 401 unauthorized, navigate to login, else set state.
      if (data.statusCode === 401)
      {
        navigate('/login');
      }
      else
      {
        setState({...state, pongJwtToken: window.localStorage.getItem('pongJwtToken'), userEmail: data.email, userNickname: data.nickname});
      }
    }

      fetchHome();

  }, []);

  const logOut = function (): void
  {
    window.localStorage.removeItem('pongJwtToken');
    navigate('/login');
  }


  return (
    <div>
      <Header />
      <p>Hello, {state.userNickname ? state.userNickname : 'loading...'}!</p>
      <p>Your email is {state.userEmail ? state.userEmail : 'loading...'}</p>
      <p><button onClick={logOut}>Log out</button></p>
    </div>
  );

  
}

export default App;
