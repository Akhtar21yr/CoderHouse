import React from 'react';
import { useParams } from 'react-router-dom';
import useWebRtc from '../../hooks/useWebRtc';
import { useSelector } from 'react-redux';

const Room = () => {
  const { id: roomId } = useParams();
  const { user } = useSelector(state => state.authSlice);
  const { clients, provideRef } = useWebRtc({ roomId, user });

  return (
    <div key={roomId}>
      <h1>All connected clients</h1>
      {
        clients.map(client => (
          <div key={client.id}>
            
            <audio key={`audio-${client.id}`} ref={(instance) => provideRef(instance, client.id)} controls autoPlay />
            <h1 key={`name-${client.id}`}>{client.name}</h1>
          </div>
        ))
      }
    </div>
  );
};

export default Room;
