const router = require('express').Router();
const foodController = require('../controllers/food_controller');
const  authJwt  = require('../middlewares/auth_jwt');


router.post('/api/add-food', [authJwt.verifyToken],foodController.postAddFood);

router.get('/api/search', [authJwt.verifyToken],foodController.searchFood);

module.exports = router;