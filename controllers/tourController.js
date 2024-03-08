const Tour = require('./../models/tourModel')


exports.getAllTours = async (req, res) => {

    try {
        console.log(req.query)
        //BUILD QUERY
        // 1(A) FILTERING
        const queryObj = { ...req.query }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //1(B) ADVANCED FITERING( MONGODB OPERATORS USED --> gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // { duration:{$gte: '5'}, difficulty: 'easy', limit: '4' } --> queryString after parsing
        // { duration: { gte: '5' }, difficulty: 'easy', limit: '4' }---> queryObj

        let query = Tour.find(JSON.parse(queryStr))

        // 2) SORTING
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
            // sort('price ratingsAverage) --> The sortBy should be of this form
        }
        else {
            query = query.sort('-createdAt')   // sort according to newly created first if no sorting is there
        }

        // 3) FIELD LIMITING
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ') // of the form 'name duration price'
            query = query.select(fields)

        }
        else {
            query = query.select('-__v')
        }

        // 4) Pagination
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 100
        const skip = (page - 1) * limit
        // page=2&limit=10 --> here we requested page 2 which has 11-20 data. 1-10 on page 1, 11-20 on page 2, and so on...
        query = query.skip(skip).limit(limit)

        if (req.query.page) {
            const numTours = await Tour.countDocuments()
            if (skip >= numTours) throw new Error('This page does not exist')
        }

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

