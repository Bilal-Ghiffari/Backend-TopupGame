var express = require('express');
var router = express.Router();
const {isLoginPlayer} = require('../middleware/auth');
const multer = require('multer');
const os = require('os');

const {
    landingPage, 
    detailPage, 
    category, 
    checkout, 
    history, 
    historyDetails, 
    dashboard,
    profile,
    editProfile
} = require('./controller')

router.get('/landingpage', landingPage);
router.get('/:id/details', detailPage);
router.get('/category', category);
router.post('/checkout', isLoginPlayer ,checkout);
router.get('/history', isLoginPlayer, history);
router.get('/history/:id/detail', isLoginPlayer, historyDetails);
router.get('/dashboard', isLoginPlayer, dashboard);
router.get('/profile', isLoginPlayer, profile);
router.put('/profile', isLoginPlayer, 
    multer({dest: os.tmpdir() }).single('image'),
    editProfile
)

module.exports = router;