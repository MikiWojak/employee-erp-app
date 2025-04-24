const multer = require('multer');

const storage = multer.diskStorage({
    destination: './tmp'
});

const upload = multer({ storage });

module.exports = upload;
