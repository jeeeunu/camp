const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('늉늉');
});

module.exports = router;