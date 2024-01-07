// all the endpoints which are accosiate with hotels present inside thsi file.
import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";
import { hotelType } from "../shared/types";
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

      const imageUrls = await uploadImages(imageFiles);

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

// get all hotels

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetcheing Hotels" });
  }
});

// edit hotel

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updateHotel: hotelType = req.body;
      updateHotel.lastUpdated = new Date();

      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updateHotel,
        { new: true }
      );
    
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updateHotel.imageUrls || []),
      ];
      await hotel.save();
      res.status(201).json(hotel);
      
    } catch (error) {
      res.status(500).json({ message: "Somting went wrong" });
    }
  }
);

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    // converting the image to base64 for cludinory
    const b64 = Buffer.from(image.buffer).toString("base64");
    // to check jpg png and other type of images (image.mimtype);
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI); // uploading image using sdk
    return res.url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

export default router;
