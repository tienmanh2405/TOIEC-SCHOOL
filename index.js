import express from 'express';
import userRouter from "./src/routers/user.router.js"
import { SERVER_CONFIG } from './src/configs/server.config.js';

const app = express();

app.use(express.json());

app.use('/users',userRouter);
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