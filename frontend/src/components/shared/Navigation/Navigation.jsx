import React from 'react';
import { Link } from 'react-router-dom';
import { LOGOUT_API } from '../../../http';
import styles from './Navigation.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import { Emoji, logout_png, profile_default } from '../../../assets/images';


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
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.authSlice);
    async function logoutUser() {
        try {
            const { data } = await LOGOUT_API();
            console.log(data)
            dispatch(setAuth(data));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to="/">
                <img src={Emoji} alt="logo" />
                <span style={logoText}>Codershouse</span>
            </Link>
            {(isAuth && user.activated) && (
                <div className={styles.navRight}>
                    <h3>{user?.name}</h3>
                    <Link to="/">
                        <img
                            className={styles.avatar}
                            src={
                                user.avatar
                                    ? user.avatar
                                    : profile_default
                            }
                            width="40"
                            height="40"
                            alt="avatar"
                        />
                    </Link>
                    <button
                        className={styles.logoutButton}
                        onClick={logoutUser}
                    >
                        <img src={logout_png} alt="logout" />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;