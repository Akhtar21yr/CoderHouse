import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWebRtc from '../../hooks/useWebRtc';
import { useSelector } from 'react-redux';
import styles from './Room.module.css'
import { arrow_left, mic_off_png, mic_png } from '../../assets/images/index'
import { GET_ROOM_API } from '../../http';

const Room = () => {
  const { id: roomId } = useParams();
  const { user } = useSelector(state => state.authSlice);
  const { clients, provideRef } = useWebRtc({ roomId, user });
  const [room, setRoom] = useState(null)
  const navigate = useNavigate()

  const handleManualLeave = () => {
    navigate('/rooms')
  }

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await GET_ROOM_API(roomId)
      console.log(data)
      setRoom((prev) => data)
    }
    fetchRoom()
  }, [roomId])

  return (
    <div key={roomId}>
      <div className='container'>
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img src={arrow_left} alt="arrow-left" />
          <span>All Voice Room</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>🤚</button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>✌<span>Leave quietly</span></button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div className={styles.client} key={client.id}>
                <div className={styles.userHead}>
                  <img className={styles.userAvatar} src={client.avatar} alt="" />
                  <audio autoPlay ref={(instance) => { provideRef(instance, client.id); }} />
                  <button onClick={() => handleMuteClick(client.id)} className={styles.micBtn}>
                    {client.muted ? (<img className={styles.mic} src={mic_off_png} alt="mic" />) :
                      (<img className={styles.micImg} src={mic_png} alt="mic" />
                      )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default Room;
