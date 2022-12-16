const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWOR}@cluster0.asxi1ae.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
/* 
{
  "userName": "developer-munir",
  "email": "devolopermunir@gmail.com",
  "password": "password",
}
*/

async function run() {}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("crud-api-server is running");
});
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
