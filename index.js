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

/* 
api link ---- https://crud-api-server.vercel.app/

*/

async function run() {
  const userCollection = client.db("crud-api").collection("userCollection");
  const socialCollection = client.db("crud-api").collection("socialCollection");
  const reactCollection = client.db("crud-api").collection("reactCollection");
  const commentCollection = client
    .db("crud-api")
    .collection("commentCollection");

  // sing up user
  app.post("/users", async (req, res) => {
    /* 
        {
            "userName": "developer-munir",
            "email": "devolopermunir@gmail.com",
            "password": "password",
        }
     */
    const user = req.body;
    const userName = {
      userName: user?.userName,
    };
    const userEmail = {
      email: user?.email,
    };
    const getUserName = await userCollection.findOne(userName);
    const getUserEmail = await userCollection.findOne(userEmail);
    if (!getUserName && !getUserEmail) {
      const postUser = await userCollection.insertOne(user);
      res.status(200).send(postUser);
    } else {
      res.status(404).send("user already exist");
    }
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
    if (!getUser) {
      console.log("invalid username password");
    }
    res.status(200).send(getUser);
  });

  // update password
  app.patch("/users/updatePassword", async (req, res) => {
    /*
    when update password send backend logged user id must
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
    res.status(200).send(passwordUpdatedResult);
  });

  // for social media

  // create a post
  app.post("/social", async (req, res) => {
    /* 
        {
            "postedUserName": "developer-munir",
            "postedUserPhoto": "userPhoto here",
            "post": "post contents whatever you like",
            "postTime":"10.00 P.M"
        }
      */

    const postData = req.body;
    const insertAPost = await socialCollection.insertOne(postData);
    res.status(200).send(insertAPost);
  });

  // get all post
  app.get("/social", async (req, res) => {
    const query = {};
    const allPost = await socialCollection.find(query).toArray();
    res.status(200).send(allPost);
  });

  // get single person single post
  app.get("/social/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const singlePersonSinglePost = await socialCollection.findOne(query);
    res.status(200).send(singlePersonSinglePost);
  });
  // get single person all post
  app.get("/social/allPosts/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const singlePersonAllPost = await socialCollection.find(query).toArray();
    res.status(200).send(singlePersonAllPost);
  });

  // update a post
  app.patch("/social/:id", async (req, res) => {
    /* 
      {
        "post": "post update",
        "postTime":"12.00 P.M"
      }
    */
    const id = req.params.id;
    const newPost = req.body;
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: {
        post: newPost?.post,
        postTime: newPost?.postTime,
      },
    };
    const updatePost = await socialCollection.updateOne(filter, updatedDoc);
    res.status(200).send(updatePost);
  });

  // delete a post
  app.delete("/social/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const deletePost = await socialCollection.deleteOne(query);
    res.status(200).send(deletePost);
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
    res.status(200).send(insertAReact);
  });
  // get all react
  app.get("/social/reacts/:id", async (req, res) => {
    const id = req.params.id;
    const query = { postId: id };
    const getReacts = await reactCollection.find(query).toArray();
    res.status(200).send(getReacts);
  });
  // update react when toggle react button
  app.patch("/social/react/:id", async (req, res) => {
    /* 
        {
                "reactType":"love"
        }
    */
    const react = req.body;
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: {
        reactType: react?.newReact,
      },
    };
    const updateReact = await reactCollection.updateOne(filter, updatedDoc);
    res.status(200).send(updateReact);
  });
  // comment a post
  app.post("/social/comment", async (req, res) => {
    /* 
                { 
                    "postId":"639cc72b8a2f8a45eb1246c3",
                     "reactedPersonName": "Munir Hossain Juwel",
                     "reactedUserPhoto": "userPhoto here",
                     "userId": "639c87f394922c61dd3bbaba",
                     "comment":"comment-type here"
                     "CommentTime":"10.00 P.M",
                }
    */
    const comment = req.body;
    const insertAComment = await commentCollection.insertOne(comment);
    res.status(200).send(insertAComment);
  });
  // get all comments
  app.get("/social/comments/:id", async (req, res) => {
    const id = req.params.id;
    const query = { postId: id };
    const getComments = await commentCollection.find(query).toArray();
    res.status(200).send(getComments);
  });
  // update a comment
  app.patch("/social/comment/:id", async (req, res) => {
    /* 
        {
                "newComment":"comment-type here",
                "newCommentTime":"10.00 P.M"
        }
    */
    const comment = req.body;
    const id = req.params.id;
    const filter = { _id: ObjectId(id) };
    const updatedDoc = {
      $set: {
        comment: comment?.newComment,
        CommentTime: comment?.newCommentTime,
      },
    };
    const updateComment = await commentCollection.updateOne(filter, updatedDoc);
    res.status(200).send(updateComment);
  });
  // delete a comment
  app.delete("/social/comment/:id", async (req, res) => {
    const id = req.params.id;
    const query = {
      _id: ObjectId(id),
    };
    const deleteComment = await commentCollection.deleteOne(query);
    res.status(200).send(deleteComment);
  });
}
run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.status(200).send("crud-api-server is running");
});
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
