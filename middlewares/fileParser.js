/* eslint-disable eol-last */
/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable eqeqeq */
/* eslint-disable space-before-blocks */
/* eslint-disable indent */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable semi */
/* eslint-disable quotes */
/* eslint-disable space-in-parens */
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const { cloudinary } = require("../config/cloudPhoto");



const createUrlUser = async (photoUrl) => {
  const folderName = 'User';
  let image = await cloudinary.uploader
    .upload(photoUrl, {
      resource_type: "image",
      folder: folderName,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    .then((result) => {
      fs.unlink(photoUrl, (err) => {
        if (err) console.log(err);
      });
      return result.url;
    })
    .catch((err) => console.log(err));
    return image
};

const createUrlProperty = async (photoUrl) => {
  const folderName = "Property";
  let image = await cloudinary.uploader
    .upload(photoUrl, {
      resource_type: "image",
      folder: folderName,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
    .then((result) => {
      fs.unlink(photoUrl, (err) => {
        if (err) console.log(err);
      });
      return result.url;
    })
    .catch((err) => console.log(err));
  return image;
};


const deleteUrlPhoto = async (photoUrl) => { await cloudinary.uploader.destroy( photoUrl, { resource_type: "image" } ) };


const userStorage = multer.diskStorage({
  destination: "public/user-photos/",
  filename(req, file, cb) {
    const fileUUID = uuidv4();
    cb(null, `${file.originalname}-${fileUUID}`);
  },
});

const propertyStorage = multer.diskStorage({
  destination: "public/property-photos/",
  filename(req, file, cb) {
    const fileUUID = uuidv4();
    cb(null, `${file.originalname}-${fileUUID}`);
  },
});


function fileFilter(req, file, cb){
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
    return cb(null, true);
  } else {
    return cb({ status: 422, message: "file not supported"});
  }
}


// upload photo
const userUpload = multer({ storage: userStorage, fileFilter, limits: { fileSize: 5000000 } }).single('image');
const propertyUpload = multer({ storage: propertyStorage, fileFilter, limits: { fileSize: 5000000 } }).array("image", 5);


const userFileParser = (req, res, next) => {
  userUpload(req, res, (err) => {
    if (err) {
      return next({ status: err.status || 422, message: err.message || "Error uploading file" });
    }
    next();
  });
};

const propertyFileParser = (req, res, next) => {
  propertyUpload(req, res, (err) => {
    if (err) {
      return next({ status: err.status || 422, message: err.message || "Error uploading files" });
    }
    next();
  });
};



module.exports = {
  userFileParser,
  propertyFileParser,
  createUrlUser,
  createUrlProperty,
  deleteUrlPhoto,
};