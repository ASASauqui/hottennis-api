const express = require('express');
require('dotenv').config();
const { readdirSync } = require('fs');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());    

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(console.log('Mongo DB Connected'))
.catch((err) => console.log("DB Connection Error: ", err));

readdirSync("./routes").map((r) => app.use(`/${r.split('.')[0]}`, require(`./routes/${r}`)));

app.listen(process.env.PORT, () => {
    console.log(`Hottennis running on port ${process.env.PORT}`);
})
