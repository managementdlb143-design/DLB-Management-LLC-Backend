const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.fieldname}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// ⚠️ YEH EXPORT MUST HONA CHAHIYE:
module.exports = upload;