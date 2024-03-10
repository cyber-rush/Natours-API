const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures')


exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage, price'
    req.query.fields = 'name, price, ratingsAverage, summary, difficulty'
    next()
}

exports.getAllTours = async (req, res) => {

    try {
        //EXECUTE QUERY
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()
        const tours = await features.query

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

exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { // match is used to select documents..similar to select command in sql
                    ratingsAverage: { $gte: 4.5 }
                }
            },
            {
                $group: {
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 } // 1 for ascending(-1 for descending) and now in sort only group variables are used
            }
        ])

        res.status(200).json({
            status: "sucess",
            data: {
                stats
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getMonthlyPlan = async (req, res) => {
    try {

        const year = req.params.year * 1 // Inputted year on Postman : 2021
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$startDates' }, // $month is a operator which extracts the month as an integer
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' } // adds a new field
            },
            {
                $project: {
                    _id: 0 // 0 means dont show id field and 1 means show
                }
            },
            {
                $sort: { numTourStarts: -1 }
            }
        ])

        res.status(200).json({
            status: "sucess",
            data: {
                plan
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

