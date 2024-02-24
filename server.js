const dotenv = require('dotenv')
dotenv.config({ path: './config.env' }) // Reads the variables from the file and saves them into the Nodejs env variables
const app = require('./app')

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})