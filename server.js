const db = require("./db.js");
const express = require("express");
const app = express();
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3.js");
const req = require("express/lib/request");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

const s3LocationDomain = "https://onionximageboard.s3.us-east-1.amazonaws.com/";

app.use(express.static("./public"));

app.use(express.json());

app.post("/upload.json", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);
    console.log("input:", req.body);
    console.log("our file will be reachable at its bucket's url");
    console.log("with the addition of the filename");
    if (req.file) {
        const s3Url = `${s3LocationDomain}${req.file.filename}`;
        const newImage = {
            url: s3Url,
            username: req.body.username,
            title: req.body.title,
            description: req.body.description,
        };
        db.postImages(
            s3Url,
            req.body.title,
            req.body.username,
            req.body.description
        )
            .then(() => {
                console.log(newImage);
                res.json(newImage);
            })
            .catch(console.log);
    } else {
        res.json({ success: false });
    }
});

app.get("/images", (req, res) => {
    db.getImages()
        .then((input) => {
            const images = input.rows;
            res.json(images);
        })
        .catch(console.log);
});

app.get("/images/:id", (req, res) => {
    const image_id = req.params.id;
    db.getImageId(image_id)
        .then((input) => {
            const image = input.rows;
            res.json(image);
            console.log(image);
        })
        .catch(console.log);
});

app.get("/images/more/:id", (req, res) => {
    const smallestID = req.params.id;
    db.getMoreImages(smallestID)
        .then((input) => {
            const images = input.rows;
            res.json(images);
        })
        .catch(console.log);
});

app.get("/comments/:imageId.json", (req, res) => {
    const image_id = req.params.imageId;
    db.getComments(image_id)
        .then((input) => {
            const comments = input.rows;
            console.log(comments);
            res.json(comments);
        })
        .catch(console.log);
});

app.post("/comment.json", (req, res) => {
    db.postComment(req.body.comments_text, req.body.username, req.body.imageId)
        .then((data) => {
            console.log(data.rows[0]);
            res.json(data.rows[0]);
        })
        .catch(console.log);
});

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.listen(8080, () => console.log(`I'm listening.`));
