import React, { useEffect, useState } from 'react'
import styles from './Rooms.module.css'
import { add_room_png, monkey_png, search_png } from '../../assets/images'
import RoomCard from '../../components/RoomCard/RoomCard';
import AddRoomModal from '../../components/AddRoomModal/AddRoomModal';
import { GET_ALL_ROOMS_API } from '../../http';


const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const fetchRooms = async () => {
        const { data } = await GET_ALL_ROOMS_API();
        setRooms(data);
    };
    fetchRooms();
}, []);

  function openModal() {
    setShowModal(true);
  }

  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src={search_png} alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button
              onClick={openModal}
              className={styles.startRoomButton}
            >
              <img
                src={add_room_png}
                alt="add-room"
              />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={styles.roomList}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default Rooms
