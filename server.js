import express from "express";
import {readdirSync} from 'fs';
import cors from "cors";
import mongoose from "mongoose";


const morgan = require("morgan");
const swaggerjsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('swagger.yaml');

require("dotenv").config();

const app = express();

//swagger ui configuration
const swaggerOptions = {
  definition:{
  openapi : "3.0.0",
  info : {
    title: 'User Account Application',
    version: '1.0.0'
  },
  servers:[
  {
    url: 'http://localhost:8000/'
  },
  ],
},
apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerjsDoc(swaggerOptions);
//attaching swagger doc to the uri
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// app.get('/swagger', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerDocument);
// });
//Database Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

//middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//route and middlewares
readdirSync('./routes').map((r)=>app.use('/api',require(`./routes/${r}`)))

//connecion port configuration
const port = process.env.PORT || 8000;
app.listen(8000,()=>console.log(`Server is runing on port ${port}`));
