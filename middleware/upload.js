var multer = require("multer");
const util = require("util");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(" ").join();
    const extension = MIME_TYPES[file.mimetype];
    cb(null, name + "." + extension);
  },
});

var upload = multer({ storage: storage }).single("image");
var multerInstance = util.promisify(upload);

module.exports = { multerInstance };