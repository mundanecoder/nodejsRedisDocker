const { default: axios } = require("axios");
const express = require("express");
const server = express();
const redis = require("redis");

const port = 5000;

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (err) => {
    console.log(er, "redis");
  });

  await redisClient.connect();
})();
server.get("/", function (req, res) {
  res.send("hello world!");
});

// without redis

// server.get("/without-redis", function (req, res) {
//   let calcData = 0;

//   try {
//     for (let i = 0; i < 670000000; i++) {
//       calcData += i;
//     }

//     res.send({ data: calcData });
//   } catch (error) {
//     res.send({ error: error.message });
//   }
// });

// with-redis

server.get("/with-redis", async function (req, res) {
  let calcData = 0;

  try {
    //check if the data is already in the redis cache
    const cachedData = await redisClient.get("calcData");

    if (cachedData) {
      return res.json({ data: cachedData });
    }

    for (let i = 0; i < 670000000; i++) {
      calcData += i;
    }
    await redisClient.set("calcData", calcData);

    res.json({ data: calcData });
  } catch (error) {
    res.json({ error: error.message });
  }
});

//2nd example with jsontypicode apis

server.get("/typicode", async function (req, res) {
  let data = "";
  try {
    let cachedData = await redisClient.get("typicode-comments");

    if (cachedData) return res.json({ data: JSON.parse(cachedData) });
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/comments"
    );

    if (response) {
      data = response.data;
      await redisClient.set("typicode-comments", JSON.stringify(data));

      return res.json({ data: response.data });
    }

    res.json({ data: "hello world!" });
  } catch (error) {
    console.error(error.message);
  }
});

server.listen(5000, function () {
  console.log("sever is running on port " + port);
});
