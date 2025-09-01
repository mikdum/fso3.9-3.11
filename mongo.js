import mongoose from 'mongoose'

// console.log("🚀 ~ process:", process.argv)

const url = process.env.MONGODB_URI;
mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})


const Person = mongoose.model('Person', personSchema)



export default Person