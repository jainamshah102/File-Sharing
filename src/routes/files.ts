import path from "path";

import express from "express";
import multer from "multer";
import { v4 as uuid4 } from 'uuid';

import File from "../models/file";
import sendEmail from '../services/email';
import emailTemplate from "../services/emailTemplate";


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

        // console.log(req.file);
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

        // console.log(`${process.env.APP_BASE_URL}/files/${response.uuid}`)

        return res.status(200).json({
            file: `${process.env.APP_BASE_URL}/files/${response.uuid}`
        });
    });
});


router.post('/send', async (req, res) => {
    try {

        const { uuid, emailTo, emailFrom }:
            { uuid: string, emailTo: string, emailFrom: string } = req.body;

        if (!uuid || !emailTo || !emailFrom) {
            return res.status(422).send({
                error: 'All fields are required.'
            });
        };

        const file = await File.findOne({
            uuid
        });

        if (!file) {
            return res.status(404).send({ error: "File does not exist." });
        }

        if (file.sender) {
            return res.status(422).send({
                error: 'Email already sent.'
            });
        };

        file.sender = emailFrom;
        file.receiver = emailTo;

        await file.save();

        sendEmail({
            from: emailFrom,
            to: emailTo,
            subject: 'inShare file sharing',
            text: `${emailFrom} shared file with you.`,
            html: emailTemplate({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: (file.size / 1000) + 'KB',
                expires: '24 hours'
            })
        });

        return res.send({
            success: true
        });
    } catch (err) {
        return res.status(422).send({
            error: "Email not sent."
        });
    }
});


export default router;
