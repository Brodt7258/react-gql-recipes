import React from 'react';
import { NavLink } from 'react-router-dom';
import Signout from './Auth/Signout';

const NavBar = ({ session }) => (
  <nav>
    {session && session.getCurrentUser ? <NavBarAuth session={session} /> : <NavBarUnAuth />}
  </nav>
);

const NavBarAuth = ({ session }) => (
  <>
    <ul>
      <li>
        <NavLink to="/" exact>Home</NavLink>
      </li>
      <li>
        <NavLink to="/search" exact>Search</NavLink>
      </li>
      <li>
        <NavLink to="/recipe/add" exact>Add Recipe</NavLink>
      </li>
      <li>
        <NavLink to="/profile" exact>Profile</NavLink>
      </li>
      <li>
        <Signout />
      </li>
    </ul>
    <h4>Welcome, <strong>{session.getCurrentUser.username}</strong></h4>
  </>
);

const NavBarUnAuth = () => (
  <ul>
    <li>
      <NavLink to="/" exact>Home</NavLink>
    </li>
    <li>
      <NavLink to="/search">Search</NavLink>
    </li>
    <li>
      <NavLink to="/signin">Signin</NavLink>
    </li>
    <li>
      <NavLink to="/signup">Signup</NavLink>
    </li>
  </ul>
);

export default NavBar;