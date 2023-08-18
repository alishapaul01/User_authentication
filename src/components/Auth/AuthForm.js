import { useState, useRef, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import classes from './AuthForm.module.css';
import AuthContext from '../../Store/auth-context';

const AuthForm = () => {
  const history=useHistory();
  const emailInputRef= useRef('');
  const passwordInputRef= useRef('');
  const [isLogin, setIsLogin] = useState(true);

  const authCtx= useContext(AuthContext);
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  async function submitHandler(event){
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    if(isLogin){
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB0nyXEjeGMujuH-a5fM19cFXHeK1m12IU'
    }
    else{
      url ='https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB0nyXEjeGMujuH-a5fM19cFXHeK1m12IU'
    }

    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
      }),
      headers: {
          'Content-Type': 'application/json'
      },
  }).then((res) => {
      if (res.ok) {
          return res.json();
      } else {
          return res.json().then((data) => {
              let errorMessage = "Authenticatiion failed";
              throw new Error(errorMessage)
          })
      }
  })
      .then((data) => {
          
          authCtx.login(data.idToken);
          localStorage.setItem('token', data.token)
          setTimeout(()=>{
            localStorage.removeItem('token')
            history.replace('/');
          }, 300000)
          
      })
      .catch((err) => {
          alert(err.message);
      })
}

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input 
          type='email' 
          id='email' 
          ref={emailInputRef} 
          required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            ref={passwordInputRef}
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          > 
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
