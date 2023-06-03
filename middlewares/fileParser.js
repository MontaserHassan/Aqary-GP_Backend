const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { cloudinary } = require("../config/cloudPhoto");
const fs = require('fs');



const createUrlUser = async(photoUrl) => {
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


const deleteUrlPhoto = async(photoUrl) => {
  cloudinary.uploader.destroy(photoUrl, { resource_type: "image" }).then(
    result=>console.log(result)
  );
}


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


function fileFilter (req, file, cb){
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
  deleteUrlPhoto
};