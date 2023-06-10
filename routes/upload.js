import { Router } from "express";
import verifyToken from "../middleware/authorization.js";
import multer from "multer";
import { storageRef } from '../firebase/index.js'
import { getDownloadURL, uploadBytes } from "firebase/storage";

const router = Router()

const upload = multer()

router.post('/', verifyToken, upload.array('files'), async (req, res) => {
    try {
        const files = req.files
        const upload = await uploadBytes(storageRef, files[0].buffer, { contentType: files[0].mimetype })
        res.send(await getDownloadURL(upload.ref))
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
})

export default router