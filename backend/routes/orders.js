const router = require('express').Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const c = require('../controllers/orderController');

router.post('/', authenticateUser, c.place);
router.get('/my-orders', authenticateUser, c.myOrders);
router.get('/', authenticateUser, authorizeAdmin, c.listAll);
router.get('/:id', authenticateUser, c.getOne);
router.put('/:id/status', authenticateUser, authorizeAdmin, c.updateStatus);

module.exports = router;
