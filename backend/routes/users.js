const router = require('express').Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const c = require('../controllers/userController');

router.use(authenticateUser, authorizeAdmin);
router.get('/', c.list);
router.get('/:id', c.getOne);
router.delete('/:id', c.remove);

module.exports = router;
