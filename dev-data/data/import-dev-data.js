const fs = require('fs')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' }); // Reads the variables from the file and saves them into the Nodejs env variables


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD,
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB Connection successful'));



// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

//IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours)
        console.log('Data successfully loaded!')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

//DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany()
        console.log('Data successfully deleted!')
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

if (process.argv[2] == '--import') {
    importData()
}
else if (process.argv[2] == '--delete') {
    deleteData()
}
console.log(process.argv)