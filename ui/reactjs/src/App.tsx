import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header.tsx';


function App()
{
  // State variables
  const [state, setState] = useState({
    userEmail: '',
    userNickname: '',
    defaultPic: '',
  });

  // Set navigate for redirecting
  let navigate = useNavigate();

  // fetch data logic from home module of server
  useEffect(function ()
  {
    const fetchHome = async function ()
    {
      // If pongJWtToken is not found in window.localStorage, navigate to loginpage
      if (typeof(window.localStorage.getItem('pongJwtAccessToken')) === 'object')
      {
        console.log('localStorage.pongJwtToken seems to be an object!');
        navigate('/login');
      }

      // Logging token for debug
      console.log(`Attempting with token: ${window.localStorage.getItem('pongJwtAccessToken')}`);

      // Fetch data
      const res = await fetch('http://localhost:3000/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('pongJwtAccessToken')}`,
          'refresh_token': window.localStorage.getItem('pongJwtRefreshToken'),
        },
      });
      const data = await res.json();

      console.log('Logging response from api/home');
      console.log(data);

      // If 401 unauthorized, navigate to login, else set state.
      if (data.statusCode === 401)
      {
        navigate('/login');
      }
      else if (data.statusCode === 418)
      {
        navigate('login/setnick');
      }
      else
      {
        console.log(data);
        setState({...state, userEmail: data.email, userNickname: data.nickname, defaultPic: data.defaultPic});
      }
    }

      fetchHome();

  }, []);

  const logOut = function (): void
  {
    window.localStorage.removeItem('pongJwtAccessToken');
    window.localStorage.removeItem('pongJwtRefreshToken');
    navigate('/login');
  }


  return (
    <div className='subtitle'>
      <Header />
      <img className='profilePic' src={ state.defaultPic }></img>
      <p>Hello, {state.userNickname ? state.userNickname : 'loading...'}!</p>
      <p>Your email is {state.userEmail ? state.userEmail : 'loading...'}</p>
      <p><button onClick={logOut}>Log out</button></p>
    </div>
  );

  
}

export default App;