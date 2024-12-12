import React from 'react';
import { useParams } from 'react-router-dom';
import useWebRtc from '../../hooks/useWebRtc';
import { useSelector } from 'react-redux';
import styles from './Room.module.css'

const Room = () => {
  const { id: roomId } = useParams();
  const { user } = useSelector(state => state.authSlice);
  const { clients, provideRef } = useWebRtc({ roomId, user });

  return (
    <div key={roomId}>
      <h1>All connected clients</h1>
      {
        clients.map(client => (
          <div className={styles.userHead} key={client.id}>

            <audio key={`audio-${client.id}`} ref={(instance) => provideRef(instance, client.id)} controls autoPlay />
              <img src={client.avatar} className={styles.userAvatar} alt="" />
            <h4 key={`name-${client.id}`}>{client.name}</h4>
          </div>
        ))
      }
    </div>
  );
};

export default Room;
