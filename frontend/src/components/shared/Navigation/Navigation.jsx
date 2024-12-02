import React from 'react'
import { Link } from 'react-router-dom'
import { arrow_forward, Emoji } from '../../../assets/images'
import style from './Navigation.module.css'

const Navigation = () => {
  const brandStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '22px',
    display: 'flex',
    alignItems: 'center',
  };

  const logoText = {
    marginLeft: '10px',
};

  return (
    <nav className={`${style.navbar} container`}>
      <Link style={brandStyle} to='/' >
        <img src={Emoji} alt="logo" />
        <span style={logoText}>Coderhouse</span>
      </Link>
    </nav>
  )
}

export default Navigation
