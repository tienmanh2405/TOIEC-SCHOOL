import express from 'express';
import { getCoSoDaoTaos, getCoSoDaoTaoById, createCoSoDaoTao, updateCoSoDaoTao, deleteCoSoDaoTao } from '../controllers/cosodaotao.controller.js';
import { verify } from '../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getCoSoDaoTaos);
router.get('/:id', getCoSoDaoTaoById);
router.post('/create',verify, createCoSoDaoTao);
router.put('/update/:id',verify, updateCoSoDaoTao);
router.delete('/delete/:id',verify, deleteCoSoDaoTao);

export default router;
