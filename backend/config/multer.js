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
















/*

import multer from "multer";

//* -------------------------------
//* Common memory storage for MongoDB
//* -------------------------------
const storage = multer.memoryStorage();

//* -------------------------------
//* File filter helper
//* -------------------------------
const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

//* -------------------------------
//* Export ready-to-use middlewares
//* -------------------------------

//* Single file for avatar
export const uploadAvatar = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("avatar");

//* Single file for banner
export const uploadBanner = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("banner");

//* Single file for parcel image
export const uploadParcelImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //todo: maybe larger for parcels
}).single("parcel");

//* If needed, multiple images
export const uploadMultipleImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array("images", 5); //! max 5 files

*/

/**
 * How to use in routes:
 
    import { uploadAvatar, uploadBanner } from "../middleware/multer.js";
    import { uploadAvatar as avatarController, uploadBanner as bannerController } from "../controllers/user.controller.js";

    router.patch("/users/:id/avatar", verifyToken, uploadAvatar, avatarController);
    router.patch("/users/:id/banner", verifyToken, uploadBanner, bannerController);

 */

/**
 * Why memoryStorage is better for your use case

No disk I/O

The file doesn’t get saved to the server’s disk.

Faster for uploads since it’s just in memory.


Direct DB storage

You’re storing images in MongoDB (as Buffer), so you don’t need a temp file on disk.

This avoids cleanup issues with temporary files.


Safer for cloud deployments

Platforms like Heroku, Vercel, Railway, etc., don’t have persistent file storage.

MemoryStorage + MongoDB works perfectly in those environments.


Consistent file handling

Same logic for avatars, banners, or parcel images.

Easy to extend if you later want thumbnails or multiple images.
 */

