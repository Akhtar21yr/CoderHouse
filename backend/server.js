require('dotenv').config();

const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express();
const router = require('./routes')
const dbConnect = require('./database')
dbConnect()

const PORT = process.env.PORT || 5500 ;
app.use(cookieParser())
app.use(express.json())
app.use('/storage',express.static('storage'))
app.use(cors({
    credentials:true,
    origin: [
        'http://localhost:5173'
    ]
}))

app.use(router)


app.get('/',(req,res) => {
    res.send("Hello world")
})




app.listen(PORT, () =>console.log(`Running on port ${PORT}`))