import multer from "multer";

//? Store files in memory as Buffer (used for MongoDB storage)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 //? 5MB limit (safe default)
  },
  fileFilter: (req, file, cb) => {
    //? Allow only images
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

export default upload;