import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCallBack";
import socketInit from '../socket/index'
import { ACTION } from "../actions";
const useWebRtc = ({ roomId, user }) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null)

  useEffect(()=>{
    socket.current = socketInit()
  },[])

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClients = useCallback((newClient, cb) => {
        console.log(newClient)
      const lookingFor = clients.find((client) => client.id === newClient.id);
      if (lookingFor === undefined) {
        setClients((prev) => [...prev, newClient], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
        addNewClients(clients,()=>{
            const loacalElement = audioElements.current[user.id];
            if (loacalElement) {
                loacalElement.volume = 0;
                loacalElement.srcObject = localMediaStream.current
            }
            socket.current.emit(ACTION.JOIN,{roomId,user})
        })
    });
  }, []);

  return { clients, provideRef };
};

export default useWebRtc;