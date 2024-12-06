import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { ACTIVATE_API } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import { monkey_png, profile_default } from '../../../assets/images';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/shared/Loader/Loader';


const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activateSlice);
    const [image, setImage] = useState(profile_default);
    const [loading, setLoading] = useState(false)


    function captureImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }


    async function submit() {
        if (!name || !avatar) return
        setLoading(true)
        try {
            const { data } = await ACTIVATE_API({ name, avatar });
            if (data.auth) {
                dispatch(setAuth(data));
            }


        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader message='Activating...' />

    return (
        <>
            <Card title={`Okay, ${name}`} icon={monkey_png} >
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.outer}>
                    <div className={styles.avatarWrapper}>
                        <img
                            className={styles.avatarImage}
                            src={image}
                            alt="avatar"
                        />
                    </div>
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Not Good ?<b>Choose a different one</b>
                    </label>
                </div>
                <div>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;