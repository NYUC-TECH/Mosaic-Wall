const express = require('express')
const router = express.Router()

// const mainController = require('../app/controllers/mainController')



router.get('/', (req, res) => {

    try {
        res.render('mosiac', )
        
    } catch (error) {
        res.render('mosiac', )
    }
})


router.get('/user', (req, res) => {

    try {
        res.render('uploadphoto', )
        
    } catch (error) {
        res.render('uploadphoto', )
    }
})

router.get('/dashboard', (req, res) => {

    try {
        res.render('dashboard', )
        
    } catch (error) {
        res.render('dashboard', )
    }
})











module.exports = router
