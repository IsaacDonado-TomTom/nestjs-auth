import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import styles from '../styles/Bootstrap.module.css';
import MainLayout from '../components/MainLayout'

const Home: NextPage<{ homeInfo: any }> = ( {homeInfo} ) => {
  // Set error message value
  const [errorMsg, setErrorMsg] = React.useState("");


  // Console log static props
  // console.log({homeInfo});
  //if (typeof({homeInfo}) === undefined)
  //{
  //  console.log("homeInfo is undefined");
  //}
  
  // signIn on form submit
  const signIn = async function (context: any)
  {
    // Prevent page from reloading.
    context.preventDefault();

    // Try fetch
    try
    {
      const response: any = await fetch('http://localhost:3000/auth/signin', {
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
        if (data.statusCode === 403)
        {
          setErrorMsg(data.message);
        }

        // Check for status code 201/200 and insert token into header, continue.
        if (data.statusCode === 200 || data.statusCode ===201)
        {
          console.log('Successfully logged in');
        }

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
    <h2>Login</h2>
    <form onSubmit={ signIn } className={ styles["login-forms"] }>
      <p>
      <input type="email" id="email" name="email" placeholder="Email Address" required={true} /><i className="validation"><span></span><span></span></i>
      </p>
      <p>
      <input type="password" id="password" name="password" placeholder="Password" required={true} /><i className="validation"><span></span><span></span></i>
      </p>
      <p className={ styles.errormsg }> { errorMsg } </p>
      <p>
      <input type="submit" id="login" value="Login" />
      </p>
    </form>
    <div className={ styles["create-account-wrap"] }>
      <p>Not a member? <a href="signup">Create Account</a></p><p>
    </p></div>
  </div>
  </MainLayout>
  );
};

export const getStaticProps: GetStaticProps = async function (context)
{
  try
  {
    // Gotta add second object parameter with info
    const response: any = await fetch('http://localhost:3000/home');
    try
    {
      const data: any = await response.json();

      // Logging response
      console.log(data);

      // If use is not authenticated
      if (data.statusCode === 401)
      {
        console.log("User is not authenticated");
        return ({
          props: {
            data: null,
          }
        });
      }
      
      // Return data
      return {
        props: {
          data: data,
        },
      };
    }
    catch (error)
    {
      console.log('response.json() failed!');
      console.log(error);
    }
  }
  catch (error)
  {
    console.log('Fetch function failed to load localhost/home');
    console.log(error);
  }

  // If an error was caught and return wasn't reached, return this
  return {
    props: {
      data: null,
    },
  };
};

export default Home;