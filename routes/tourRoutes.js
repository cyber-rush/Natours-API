const express = require('express')
const router = express.Router()
const { getAllTours, createTour, getTour, updateTour, deleteTour, aliasTopTours } = require('./../controllers/tourController')

router
    .route('/top-5-cheap')
    .get(aliasTopTours, getAllTours) // aliasTopTours is the middleware func 

router
    .route('/')
    .get(getAllTours)
    .post(createTour)

router
    .route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router