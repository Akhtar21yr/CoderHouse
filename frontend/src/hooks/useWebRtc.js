import React, { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "./useStateWithCallBack";
import socketInit from "../socket/index";
import { ACTIONS } from "../actions";
import freeice from "freeice";

const useWebRtc = ({ roomId, user }) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  // listen for mute and unmute
  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });
    socket.current.on(ACTIONS.UNMUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      console.log('mute/unmute',mute)
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === userId ? { ...client, muted: mute } : client
        )
      );

      const audioElement = audioElements.current[userId];
      if (audioElement) {
        audioElement.muted = mute;
      }
    };

    return () => {
      socket.current.off(ACTIONS.MUTE);
      socket.current.off(ACTIONS.UNMUTE);
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      setClients((prev) => {
        if (prev.find((client) => client.id === newClient.id)) {
          return prev; // Client already exists
        }
        return [...prev, newClient];
      }, cb);
    },
    [setClients]
  );

  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };

    startCapture().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      // Leaving room
      if (localMediaStream.current) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
      }
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, [roomId, user, addNewClient]);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      if (peerId in connections.current) {
        console.warn("Already connected to this peer:", peerId);
        return;
      }

      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });

      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(interval);
              }
            }, 500);
          }
        });
      };

      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });

      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDes: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, [addNewClient]);

  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });

    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDes: remoteSessionDes,
    }) => {
      await connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDes)
      );

      if (remoteSessionDes.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);

        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDes: answer,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DES, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DES);
    };
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[userId];

      setClients((prev) => prev.filter((client) => client.id !== userId));
    };

    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);

  const handleMute = (isMute, userId) => {
    
    let settled = false;
    if (userId === user.id) {
      let interval = setInterval(() => {
        if (localMediaStream.current) {
          localMediaStream.current.getTracks()[0].enabled = !isMute;
          if (isMute) {
            socket.current.emit(ACTIONS.MUTE, {
              roomId,
              userId: userId,
            });
          } else {
            socket.current.emit(ACTIONS.UNMUTE, {
              roomId,
              userId: user.id,
            });
          }
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 2000);
    }
  };

  return { clients, provideRef, handleMute };
};

export default useWebRtc;
