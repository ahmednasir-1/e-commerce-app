const router = require('express').Router();
const { authenticateUser, authorizeAdmin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const c = require('../controllers/bookController');

router.get('/', c.list);
router.get('/:id', c.getOne);
router.post('/', authenticateUser, authorizeAdmin, upload.single('image'), c.create);
router.put('/:id', authenticateUser, authorizeAdmin, upload.single('image'), c.update);
router.delete('/:id', authenticateUser, authorizeAdmin, c.remove);

module.exports = router;
