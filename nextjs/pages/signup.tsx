import React from 'react';
import { NextPage } from 'next';
import styles from '../styles/Bootstrap.module.css';
import MainLayout from '../components/MainLayout'

const Home: NextPage = () => {

  // Set error message value
  const [errorMsg, setErrorMsg] = React.useState("");

  // signIn on form submit
  const signUp = async function (context: any)
  {
    // Prevent page from reloading.
    context.preventDefault();

    // Try fetch
    try
    {
      const response: any = await fetch('http://localhost:3000/auth/signup', {
        body: JSON.stringify({
          email: context.target[0].value,
          password: context.target[1].value,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
      try
      {
        const data: any = await response.json();

        // If error code is 403, set the error msg in form
        if (data.statusCode === 403)
        {
          setErrorMsg(data.message);
        }
        console.log(data);
      }
      catch (error)
      {
        console.log('Failed trying to convert response to json!');
        console.log(error);
      }
      
    }
    catch(error)
    {
      console.log('Fetch request to server failed!');
      console.log(error);
    }
    console.log(context.target[0].value);
    console.log(context.target[1].value);
  }

  return (
  <MainLayout>
  <div className={ styles["login-form-wrap"] }>
    <h2>Sign up</h2>
    <form onSubmit={ signUp } className={ styles["login-forms"] }>
      <p>
      <input type="email" id="email" name="email" placeholder="Email Address" required={true} /><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="password" id="password" name="password" placeholder="Password" required={true} /><i className="validation"><span></span><span></span></i>
      </p>
      <p className={styles.errormsg}>{errorMsg}</p>
      <p>
      <input type="submit" id="signup" value="Sign up" />
      </p>
    </form>
    <div className={ styles["create-account-wrap"] }>
      <p>Already a member? <a href="./">Log in</a></p><p>
    </p></div>
  </div>
  </MainLayout>
  );
};

export default Home;
