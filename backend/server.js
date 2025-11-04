require('dotenv').config();

const cookieParser = require('cookie-parser')
const app = require('./src/app')
const ConnectDB = require('./src/db/db')
const cors = require('cors');
app.use(cors())
ConnectDB();
app.use(cookieParser());

app.listen(process.env.PORT, ()=>{
    console.log('Server is Listening on the PORT', process.env.PORT);
})