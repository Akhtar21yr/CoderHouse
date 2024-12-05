import axios from 'axios'

const api = axios.create({
    baseURL : 'http://localhost:5500',
   
})

export const SEND_OTP_API = (data) => api.post('/api/send-otp',data)

export const VERIFY_OTP_API = (data) => api.post('/api/verify-otp',data)
