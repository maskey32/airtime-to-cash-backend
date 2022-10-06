import express from 'express';

const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('dummy user');
});

export default router;
