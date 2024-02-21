const fs = require('fs')
const express = require('express')

const app = express()

app.use(express.json())

// JSON.parse converts to an array of JS objects
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
)

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: "sucess",
        results: tours.length,
        data: {
            tours
        }
    })
})

app.post('/api/v1/tours', (req, res) => {
    const newId = tours[tours.length - 1].id + 1
    const newTour = { id: newId, ...req.body };
    // or use this : const newTour = Object.assign({ id: newId }, req.body)

    tours.push(newTour)

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        err => {
            res.status(201).json({
                status: "success",
                "data": {
                    tour: newTour
                }
            })
        })
})

const port = 3000
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
})