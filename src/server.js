import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import viewEngine from "./config/viewEngine";
import initWebRoutes from './route/web';
import connectDB from './config/connectDB';

require('dotenv').config();

let app = express();

app.use(cors({
   origin: 'http://localhost:3000',
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

viewEngine(app);
initWebRoutes(app);
connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
   console.log("Dự án NguyenLien đã chạy THÀNH CÔNG trên CỔNG " + port + " !!!");
});
