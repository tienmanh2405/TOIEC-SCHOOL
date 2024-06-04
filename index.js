import express from 'express';
import userRouter from "./src/routers/user.router.js"
import adminRouter from "./src/routers/admin.router.js"
import giangvienRouter from "./src/routers/giangvien.router.js"
import { SERVER_CONFIG } from './src/configs/server.config.js';
import { DB_CONFID } from './src/configs/db.config.js';

const app = express();

app.use(express.json());

app.use(DB_CONFID.resourses.user.contextPath,userRouter);
app.use(DB_CONFID.resourses.admin.contextPath,adminRouter);
app.use(DB_CONFID.resourses.giangvien.contextPath,giangvienRouter);
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