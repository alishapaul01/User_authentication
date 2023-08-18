
import { useContext } from 'react';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './Pages/AuthPage';
import HomePage from './Pages/HomePage';
import {Route, Switch , Redirect } from "react-router-dom";
import AuthContext from './Store/auth-context';


function App() {

  const authCtx= useContext(AuthContext);

  return (
    <Layout>
     <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
        <Route path='/auth'>
          <AuthPage />
        </Route>
        )}
        <Route path='/profile'>
        {authCtx.isLoggedIn && 
        <UserProfile />}
        {!authCtx.isLoggedIn &&  <Redirect to='/auth ' />}
        </Route>
      
        <Route path='*'>
          <Redirect to= '/' />
        </Route>
        </Switch>
    </Layout>
  );
}

export default App;