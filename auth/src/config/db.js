import mongoose from 'mongoose'

function connectDB() {
    mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log('DB Connected')
        })
        .catch((error) => {
            console.log('DB connection failed', error);
            
        })
}

export default connectDB