const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: './tmp'
});

const upload = multer({ storage });

module.exports = upload;
