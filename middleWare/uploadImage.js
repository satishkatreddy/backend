const multer = require('multer');
const path = require('path');
const appError= require('../utils/appError');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      return cb(null, 'uploads/')
  },
  filename:function(req, file, cb){
      return cb(null, `${Date.now()}_${file.filename}_${file.originalname}`)
  },

  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif']; // Add more image types if needed

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Allow the file
    } else {
      cb(new appError('Invalid file type', 'Please upload only images', 400, false));
    }
  }
})

const upload = multer({ storage: storage, limits:{
  fileSize: 1000000
} })

module.exports = upload