class APIFeatures {
    constructor(query, queryString) { // query--> Mongoose DB query, queryString --> Express query
        this.query = query
        this.queryString = queryString
    }

    filter() {
        //BUILD QUERY
        // 1(A) FILTERING
        const queryObj = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //1(B) ADVANCED FITERING( MONGODB OPERATORS USED --> gte, gt, lte, lt)
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        // { duration:{$gte: '5'}, difficulty: 'easy', limit: '4' } --> queryString after parsing
        // { duration: { gte: '5' }, difficulty: 'easy', limit: '4' }---> queryObj

        this.query = this.query.find(JSON.parse(queryStr))

        return this
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
            // sort('price ratingsAverage) --> The sortBy should be of this form
        }
        else {
            this.query = this.query.sort('-createdAt')   // sort according to newly created first if no sorting is there
        }

        return this
    }

    limitFields() {

        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ') // of the form 'name duration price'
            this.query = this.query.select(fields)

        }
        else {
            this.query = this.query.select('-__v')
        }

        return this
    }

    paginate() {

        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        // page=2&limit=10 --> here we requested page 2 which has 11-20 data. 1-10 on page 1, 11-20 on page 2, and so on...
        this.query = this.query.skip(skip).limit(limit)

        return this

    }
}

module.exports = APIFeatures