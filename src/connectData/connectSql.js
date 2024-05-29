import mysql from "mysql";
import { DB_CONFID } from "../configs/db.config.js"

const connection = mysql.createConnection(DB_CONFID.mysql_connect);

connection.connect((err) => {
    if(err) {
        console.log(err);
        return;
    }
});

connection.commit(); 
export default connection;