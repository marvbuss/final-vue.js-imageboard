const spicedPg = require("spiced-pg");
const database = "onion-imageboard";
const username = "postgres";
const password = "postgres";

// ------------------------------- LINE OF COMMUNICATION to DATABASE --------------------------------
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    db = spicedPg(
        `postgres:${username}:${password}@localhost:5432/${database}`
    );
}

console.log(`[db] connecting to:${database}`);

// ------------------------------- QUERIES --------------------------------

// 1. SELECT to get all images
module.exports.getImages = () => {
    const q = "SELECT * FROM images";
    return db.query(q);
};

module.exports.postImages = (
    postUrl,
    postUsername,
    postTitle,
    postDescription
) => {
    const q = `INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4)`;
    const params = [postUrl, postUsername, postTitle, postDescription];
    return db.query(q, params);
};

module.exports.getComments = (selectedImage) => {
    const q = "SELECT * FROM comments where image_id=$1";
    const params = [selectedImage];
    return db.query(q, params);
};

module.exports.postComment = (
    postComments_text,
    postUsername,
    postImage_id
) => {
    const q = `INSERT INTO comments (comments_text, username, image_id) VALUES ($1, $2, $3) RETURNING comments_text, username, image_id, created_at`;
    const params = [postComments_text, postUsername, postImage_id];
    return db.query(q, params);
};
