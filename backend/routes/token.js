const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// 生成新Token
router.post('/', tokenController.createToken);
// 获取所有Token
router.get('/', tokenController.getAllTokens);
// 删除Token
router.delete('/:id', tokenController.deleteToken);
// 作废/恢复Token
router.patch('/:id', tokenController.updateTokenStatus);
// 校验Token有效性
router.post('/validate', tokenController.validateToken);
// 批量生成Token
router.post('/batch', tokenController.batchCreateToken);
// 导出Token为TXT
router.get('/export', tokenController.exportTokens);
// 批量删除Token
router.post('/batch-delete', tokenController.batchDeleteToken);

module.exports = router;
