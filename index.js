const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asxi1ae.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const userCollection = client.db("crud-api").collection("userCollection");
  const socialCollection = client.db("crud-api").collection("socialCollection");
  const reactCollection = client.db("crud-api").collection("reactCollection");
  const commentCollection = client
    .db("crud-api")
    .collection("commentCollection");
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
        username must should be uniq
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
    when update password send backend user id must
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

  // for social media

  // create a post
  app.post("/social", async (req, res) => {
    /* 
        {
            "postedUserName": "developer-munir",
            "postedUserPhoto": "userPhoto here",
            "post": "post contents whatever you like",
            "post-time":"10.00 P.M"
        }
      */

    const postData = req.body;
    const insertAPost = await socialCollection.insertOne(postData);
    res.send(insertAPost);
  });

  // get all post
  app.get("/social", async (req, res) => {
    const query = {};
    const allPost = await socialCollection.find(query).toArray();
    res.send(allPost);
  });

  // get single person single post
  app.get("/social/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const singlePersonSinglePost = await socialCollection.findOne(query);
    res.send(singlePersonSinglePost);
  });
  // get single person all post
  app.get("/social/allPosts/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const singlePersonAllPost = await socialCollection.find(query).toArray();
    res.send(singlePersonAllPost);
  });

  // react a post
  app.post("/social/react", async (req, res) => {
    /* 
                { 
                    "postId":"639cc72b8a2f8a45eb1246c3",
                     "reactedPersonName": "Munir Hossain Juwel",
                     "reactedUserPhoto": "userPhoto here",
                     "userId": "639c87f394922c61dd3bbaba",
                     "reactType":"like"
                }
    */
    const reacts = req.body;
    const insertAReact = await reactCollection.insertOne(reacts);
    res.send(insertAReact);
  });

  // comment a post
  app.post("/social/comment", async (req, res) => {
    /* 
                { 
                    "postId":"639cc72b8a2f8a45eb1246c3",
                     "reactedPersonName": "Munir Hossain Juwel",
                     "reactedUserPhoto": "userPhoto here",
                     "userId": "639c87f394922c61dd3bbaba",
                     "Comment-time":"10.00 P.M",
                     "comment":"comment-type here"
                }
    */
    const comment = req.body;
    const insertAComment = await commentCollection.insertOne(comment);
    res.send(insertAComment);
  });
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("crud-api-server is running");
});
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
