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

// 1. SELECT to get images
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
