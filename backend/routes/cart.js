const router = require('express').Router();
const { authenticateUser } = require('../middleware/auth');
const c = require('../controllers/cartController');

router.use(authenticateUser);
router.get('/', c.get);
router.post('/add', c.add);
router.put('/update', c.update);
router.delete('/remove/:bookId', c.remove);
router.delete('/clear', c.clear);

module.exports = router;
