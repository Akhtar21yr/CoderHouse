import React from 'react';
import styles from './Button.module.css';
import { arrow_forward } from '../../../assets/images';

const Button = ({ text, onClick }) => {
    return (
        <button onClick={onClick} className={styles.button}>
            <span>{text}</span>
            <img
                className={styles.arrow}
                src={arrow_forward}
                alt="arrow"
            />
        </button>
    );
};
export default Button;