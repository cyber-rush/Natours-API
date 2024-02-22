const fs = require('fs')

// JSON.parse converts to an array of JS objects
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: "sucess",
        results: tours.length,
        data: {
            tours
        }
    })
}

exports.getTour = (req, res) => {

    const id = req.params.id * 1 // converts string to Number

    if (id >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: "sucess",
        data: {
            tour
        }
    })
}

exports.createTour = (req, res) => {
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
}

exports.updateTour = (req, res) => {

    const id = req.params.id * 1 // converts string to Number

    if (id >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(200).json({
        status: "sucess",
        data: {
            tour: '<Updated Tour here...'
        }
    })
}

exports.deleteTour = (req, res) => {

    const id = req.params.id * 1 // converts string to Number

    if (id >= tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        })
    }

    res.status(204).json({
        status: "sucess",
        data: null
    })
}

