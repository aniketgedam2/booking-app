// all the endpoints which are accosiate with hotels present inside thsi file.
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel, { hotelType } from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
// we will add the verify auth token -> only logged in Users can access this api.
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("country is required"),
    body("description").notEmpty().withMessage("description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("pricePerNight is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("facilities are required"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: hotelType = req.body;

      //upload the image on cloudinory

      const uploadPromises = imageFiles.map(async (image) => {
        // converting the image to base64 for cludinory
        const b64 = Buffer.from(image.buffer).toString("base64");
        // to check jpg png and other type of images (image.mimtype);
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI); // uploading image using sdk
        return res.url;
      });
      const imageUrls = await Promise.all(uploadPromises);

      //if upload succes add the urls to new hotels
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;
      // save the hotel in DB

      const hotel = new Hotel(newHotel);
      await hotel.save();

      // return satus 201
      res.status(201).send(hotel);
    } catch (error) {
      console.log("error creating hotel", error);
      res.status(500).json({ message: "somting went wrong" });
    }
  }
);

export default router;