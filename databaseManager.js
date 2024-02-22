const JsonDBModule = require("node-json-db");
  const { MongoClient, ServerApiVersion } = require("mongodb");
  
  const database_type = "localjson";
  
  const connection_string = "null";
  
  var client;
  var databaseMongo;
  var dbReady = false;
  
  if (database_type == "localjson") {
    const prettyDb = false;
    var db = new JsonDBModule.JsonDB(
      new JsonDBModule.Config("database", true, prettyDb, "/")
    );
    dbReady = true;
  }
  if (database_type == "mongo") {
    client = new MongoClient(connection_string, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
    connect();
  }
  
  async function save(key, value, collection) {
    if (database_type == "localjson") {
      await db.push(`/${collection}/${key}`, value);
    } else if (database_type == "mongo") {
      var currentCollection = databaseMongo.collection(String(collection));
      // create a document to insert
      const doc = {
        _id: key,
        value: value,
      };
  
      if ((await get(key, collection)) != null) {
        await remove(key, collection);
        await currentCollection.insertOne(doc);
      } else {
        await currentCollection.insertOne(doc);
      }
    }
  }
  
  async function get(key, collection) {
    if (database_type == "localjson") {
      try {
        var data = await db.getData(`/${collection}/${key}`);
        return data;
      } catch (error) {
        return null;
      }
    } else if (database_type == "mongo") {
      const currentCollection = databaseMongo.collection(collection);
      const query = { _id: key };
  
      const result = await currentCollection.findOne(query, {});
  
      if (result == null) {
        return null;
      } else {
        return result.value;
      }
    }
  }
  
  async function remove(key, collection) {
    if (database_type == "localjson") {
      await db.delete(`/${collection}/${key}`);
    } else if (database_type == "mongo") {
      const currentCollection = databaseMongo.collection(String(collection));
  
      const query = { _id: key };
  
      try {
        await currentCollection.deleteOne(query);
      } catch (e) {}
    }
  }
  
  async function removeCollection(collection) {
    if (database_type == "localjson") {
      await db.delete(`/${collection}`);
    } else if (database_type == "mongo") {
      await databaseMongo.collection(collection).drop();
    }
  }
  
  async function getAllKeys(collection) {
    if (database_type == "localjson") {
      let data;
      try {
        data = await db.getData(`/${collection}`);
      } catch (e) {
        data = [];
      }
  
      return Object.keys(data);
    } else if (database_type == "mongo") {
      const currentCollection = databaseMongo.collection(String(collection));
  
      const data = await currentCollection.find({}, {});
  
      var finalData = [];
  
      for await (const doc of data) {
        finalData.push(doc._id);
      }
  
      return finalData;
    }
  }
  
  async function exists(key, collection) {
    if (database_type == "localjson") {
      var keys = await getAllKeys(collection);
      var includesKey = false;
  
      keys.forEach((keyInteration) => {
        if (keyInteration === key) {
          includesKey = true;
          return;
        }
      });
  
      return includesKey;
    } else if (database_type == "mongo") {
      const result = await get(key, collection);
  
      if (result == null) {
        return false;
      } else {
        return true;
      }
    }
  }
  
  function onDatabaseReady(callback_func) {
    const checker = setInterval(() => {
      if (dbReady) {
        clearInterval(checker);
        callback_func();
      }
    }, 1000);
  }
  
  async function connect(callback) {
    var error = false;
    try {
      console.log("Connecting to the MongoDB database...");
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      databaseMongo = client.db("db");
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("✅ Connected to the MongoDB database!");
    } catch (e) {
      error = true;
      if (String(e) == "MongoServerError: bad auth : authentication failed") {
        console.log("\n\n\n");
        console.log("❌ Error while connecting to the MongoDB database");
        console.log("It seems that the cause is an invalid connecton string");
        console.log("Please make sure that:");
        console.log("> Your connection string is correct");
        console.log("> The user that you are using for authentication exists");
      } else {
        console.log("\n\n\n");
        console.log("❌ Error while connecting to the MongoDB database");
        console.log("Possible problems:");
        console.log("> You did not set up properly the network access");
      }
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
      dbReady = true;
    }
  }
  
  module.exports = {
    save,
    get,
    remove,
    exists,
    getAllKeys,
    removeCollection,
    onDatabaseReady,
    database_type,
  };