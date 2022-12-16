const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

async function run() {
  const userCollection = client.db("crud-api").collection("userCollection");
  // post user
  app.post("/users", async (req, res) => {
    /* 
        {
            "userName": "developer-munir",
            "email": "devolopermunir@gmail.com",
            "password": "password",
        }
     */
    const user = req.body;
    const postUser = await userCollection.insertOne(user);
    res.send(postUser);
  });

  // login user
  app.get("/user", async (req, res) => {
    /* 
        {
            "userName": "developer-munir",
            "password": "password",
        }
     */
    const loggedUser = req.body;
    const query = {
      userName: loggedUser?.userName,
      password: loggedUser?.password,
    };
    const getUser = await userCollection.findOne(query);
    res.send(getUser);
  });

  // update password
  app.patch("/users/updatePassword", async (req, res) => {
    /* 
        {
            "id": "639c87f394922c61dd3bbaba",
            "newPassword": "passwordChanged",
        }
     */
    const userInfo = req.body;
    const filter = { _id: ObjectId(userInfo?.id) };
    const updatedDoc = {
      $set: {
        password: userInfo?.newPassword,
      },
    };
    const passwordUpdatedResult = await userCollection.updateOne(
      filter,
      updatedDoc
    );
    res.send(passwordUpdatedResult);
  });
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("crud-api-server is running");
});
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
