import React from 'react'
import styles from './Rooms.module.css'
import { add_room_png, monkey_png, search_png } from '../../assets/images'
import RoomCard from '../../components/RoomCard/RoomCard';


const Rooms = () => {
  const rooms = [
    {
      id: 1,
      topic: 'Which framework best for frontend ?',
      speakers: [
        {
          id: 1,
          name: 'John Doe',
          avatar: monkey_png,
        },
        {
          id: 2,
          name: 'Jane Doe',
          avatar: monkey_png,
        },
      ],
      totalPeople: 40,
    },
    {
      id: 3,
      topic: 'What’s new in machine learning?',
      speakers: [
        {
          id: 1,
          name: 'John Doe',
          avatar: monkey_png,
        },
        {
          id: 2,
          name: 'Jane Doe',
          avatar: monkey_png,
        },
      ],
      totalPeople: 40,
    },
    {
      id: 4,
      topic: 'Why people use stack overflow?',
      speakers: [
        {
          id: 1,
          name: 'John Doe',
          avatar: monkey_png,
        },
        {
          id: 2,
          name: 'Jane Doe',
          avatar: monkey_png,
        },
      ],
      totalPeople: 40,
    },
    {
      id: 5,
      topic: 'Artificial inteligence is the future?',
      speakers: [
        {
          id: 1,
          name: 'John Doe',
          avatar: monkey_png,
        },
        {
          id: 2,
          name: 'Jane Doe',
          avatar: monkey_png,
        },
      ],
      totalPeople: 40,
    },
  ];
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
              // onClick={openModal}
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
    </>
  )
}

export default Rooms
