import React, { useState } from 'react'
import styles from './AddRoomModal.module.css'
import TextInput from '../shared/TextInput/TextInput'
import { celebration_png, close_png, Globe_png, Lock_png, lock_png, users_png } from '../../assets/images'
import {useNavigate} from 'react-router-dom'
import { CREATE_ROOM_API } from '../../http'

const AddRoomModal = ({ onClose }) => {
    const [roomType, setRoomType] = useState('open');
    const [topic, setTopic] = useState('');
    const navigate = useNavigate()

    async function createRoom() {
        console.log('jhfdgehkjhdfkhkfh')
        try {
            if (!topic) return;
            const { data } = await CREATE_ROOM_API({ topic, roomType });
            navigate(`/room/${data.id}`);
        } catch (err) {
            console.log(err.message);
        }
    }



    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button
                    onClick={onClose}
                    className={styles.closeButton}>
                    <img src={close_png} alt="close" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>
                        Enter the topic to be disscussed
                    </h3>
                    <TextInput
                        fullwidth="true"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <h2 className={styles.subHeading}>Room types</h2>
                    <div className={styles.roomTypes}>
                        <div className={`${styles.typeBox} ${roomType === 'open' ? styles.active : ''
                            }`} onClick={() => setRoomType('open')}>
                            <img src={Globe_png} alt="Globe_png" />
                            <span>Open</span>
                        </div>
                        <div className={`${styles.typeBox} ${roomType === 'social' ? styles.active : ''
                            }`} onClick={() => setRoomType('social')}>
                            <img src={users_png} alt="users_png" />
                            <span>Social</span>
                        </div>
                        <div className={`${styles.typeBox} ${roomType === 'private' ? styles.active : ''
                            }`} onClick={() => setRoomType('private')}>
                            <img src={Lock_png} alt="Lock_png" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone</h2>
                    <button
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <img src={celebration_png} alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default AddRoomModal
