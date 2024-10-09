require('dotenv').config()

const mongoose=require('mongoose')

const mongoURL=process.env.MONGODB_URL

// Connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Connection
mongoose.connect(mongoURL, options)
    .then(() => {
        console.log("Connected to MongoDB >>>>>>>>>>HI MAN");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

const db = mongoose.connection;

db.on('connected', () => {
    console.log(`Mongoose connected to MongoDB at ${mongoURL}`);
});

db.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});


module.exports = db;