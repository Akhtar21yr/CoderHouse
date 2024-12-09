import React from 'react'
import { useLocation } from 'react-router-dom'

const Room = () => {
    const {path} = useLocation()
   return (
    <div>
      Room
      Room
      {path}
    </div>
  )
}

export default Room
