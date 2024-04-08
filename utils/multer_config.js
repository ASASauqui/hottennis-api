const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  });

const upload = multer({ storage: storage });

const deleteImagesFromDisk = () => {
    // delete all files in the uploads folder
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            console.log(err);
        } else {
            for (const file of files) {
                fs.unlink(path.join('uploads/', file), err => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    });
};

module.exports = {
    upload,
    deleteImagesFromDisk
};