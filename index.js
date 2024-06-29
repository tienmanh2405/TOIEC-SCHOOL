import express from 'express';
import userRouter from "./src/routers/user.router.js"
import adminRouter from "./src/routers/admin.router.js"
import giangvienRouter from "./src/routers/giangvien.router.js"
import quanlyRouter from "./src/routers/quanly.router.js"
import { SERVER_CONFIG } from './src/configs/server.config.js';
import { DB_CONFID } from './src/configs/db.config.js';
import lophocRouter from "./src/routers/lophoc.router.js"
import khoahocRouter from "./src/routers/khoahoc.router.js"
import dangkyhocRouter from "./src/routers/dangkyhoc.router.js"
import webhookRouter from "./src/routers/webhook.router.js"
import baikiemtraRouter from './src/routers/baikiemtra.router.js';
import baigiangRouter from './src/routers/baigiang.router.js';
import chitietbaigiangRouter from './src/routers/chitietbaigiang.router.js';
import cauhoiRouter from './src/routers/cauhoi.router.js';
import buoiHocRouter from './src/routers/buoihoc.router.js';
import diemDanhRouter from './src/routers/diemdanh.router.js';
import hocVienRouter from './src/routers/hocvien.router.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(express.raw({type: 'application/json'}));
app.use(cors());

app.use(DB_CONFID.resourses.user.contextPath,userRouter);
app.use(DB_CONFID.resourses.admin.contextPath,adminRouter);
app.use(DB_CONFID.resourses.giangvien.contextPath,giangvienRouter);
app.use('/quanly',quanlyRouter);
app.use('/lophoc', lophocRouter);
app.use('/khoahoc', khoahocRouter);
app.use('/dangkyhoc', dangkyhocRouter);
app.use('/webhook', webhookRouter);
app.use('/baikiemtra', baikiemtraRouter);
app.use('/baigiang', baigiangRouter);
app.use('/chitietbaigiang', chitietbaigiangRouter);
app.use('/cauhoi', cauhoiRouter);
app.use('/buoihoc', buoiHocRouter);
app.use('/diemdanh', diemDanhRouter);
app.use('/hocvien', hocVienRouter);
async function main() {
    try {

        app.listen(SERVER_CONFIG.PORT, () => {
            console.log(`Server start thành công ${SERVER_CONFIG.PORT}`)
        })
    } catch (error) {
        console.log("error connect to database with error: " + error.message)
    }
}
main()