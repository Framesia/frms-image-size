// server.js
// where your node app starts

// init project
const express = require("express");
const probe = require("probe-image-size");

const app = express();

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  if (!req.query.image) {
    res.json({ error: "no image" });
  }
  let images = req.query.image;
  const promises = [];
  if (!Array.isArray(images)) {
    images = [images];
  }
  images.forEach(image => {
    const promise = new Promise((resolve, reject) => {
      // const image = decodeURIComponent(image)
      probe("https://steemitimages.com/0x0/" + image)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          resolve({
            width: 0,
            height: 0
          });
        });
    });
    promises.push(promise);
  });
  Promise.all(promises)
    .then(result => {
      res.json({
        error: false,
        result: result.map((size, i) => {
          return {
            w: size.width,
            h: size.height,
            img: images[i]
          };
        })
      });
    })
    .catch(err => {
      res.json({
        error: err
      });
    });
});

const PORT = 3100
// listen for requests :)
const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
