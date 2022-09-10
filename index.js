import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { port, dbUri } from "#config/env";
import api from "#route/api";

const app = express();

mongoose
	.connect(dbUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log("Connected to database");
	})
	.catch((err) => {
		console.log(err);
	});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(api);

app.listen(port, () => {
	console.log(`Server running on port: http://localhost:${port}`);
});
