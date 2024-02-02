const router = require('express').Router();
const orderController = require('../controllers/order_controller')
const  authJwt  = require('../middlewares/auth_jwt');


router.post('/api/order-food', [authJwt.verifyToken],orderController.orderController);

router.post('/api/process-order', [authJwt.verifyToken],orderController.processOrder);

module.exports = router;