const Tour = require('./../models/tourModel')


exports.getAllTours = async (req, res) => {

    try {
        //BUILD QUERY
        //1) FILTERING
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //2) ADVANCED FITERING
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        console.log(JSON.parse(queryStr))
        //MONGODB OPERATORS USED --> gte, gt, lte, lt
        console.log(queryObj)

        const query = Tour.find(JSON.parse(queryStr))

        // { duration:{$gte: '5'}, difficulty: 'easy', limit: '4' } --> queryString after parsing
        // { duration: { gte: '5' }, difficulty: 'easy', limit: '4' }---> queryObj


        //EXECUTE QUERY
        const tours = await query

        //SEND RESPONSE
        res.status(200).json({
            status: "sucess",
            results: tours.length,
            data: {
                tours
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }

}

exports.getTour = async (req, res) => {

    try {
        const tour = await Tour.findById(req.params.id) // by default it checks the _id field only
        // equivalent to this Tour.findOne({_id:req.params.id})
        res.status(200).json({
            status: "sucess",
            data: {
                tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createTour = async (req, res) => {

    try {

        const newTour = await Tour.create(req.body)

        res.status(201).json({
            status: "sucess",
            data: {
                tour: newTour
            }
        })
    }

    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }

}

exports.updateTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "sucess",
            data: {
                tour
            }
        })
    }
    catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.deleteTour = async (req, res) => {

    try {

        const tour = await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: "sucess",
            data: null
        })

    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

