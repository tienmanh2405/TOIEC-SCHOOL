import express from 'express';
import {
    getCauHois,
    getCauHoiByMaBaiKiemTra,
    createCauHoi,
    deleteCauHoi,
    updateCauHoi,
    scoreBaiKiemTra
} from '../../controllers/cauhoi.controller.js';
import { verify } from '../../middlewares/verifytoken.middleware.js';

const router = express.Router();

router.get('/', getCauHois);

router.get('/:MaBaiKiemTra', getCauHoiByMaBaiKiemTra);

router.post('/create', createCauHoi);

router.delete('/delete/:MaCauHoi', verify, deleteCauHoi);

router.put('/update/:MaCauHoi', verify, updateCauHoi);

router.post('/score/:MaBaiKiemTra', scoreBaiKiemTra); // router cham diem
export default router;
