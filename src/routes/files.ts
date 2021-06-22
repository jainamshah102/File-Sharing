import path from "path";

import express from "express";
import multer from "multer";
import { v4 as uuid4 } from 'uuid';


import File from "../models/file";

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './src/uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniqueName);
    }
});


const upload = multer({
    storage,
    limits: { fileSize: 1E8 }
}).single('file');


const router = express.Router();


router.post('/', (req, res) => {

    upload(req, res, async (err) => {

        console.log(req.files);
        if (err) {
            return res.status(500).send({
                error: err.message
            })
        };

        const file = new File({
            filename: req.file?.filename,
            uuid: uuid4(),
            path: req.file?.path,
            size: req.file?.size
        });

        const response = await file.save();
        return res.json({
            file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
        })
    });
});

export default router;
