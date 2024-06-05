
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgurl = path.join(__dirname, '../')
console.log("imgurl", imgurl)

const uploadDir = path.join(imgurl,'uploads');
console.log("upload loaded");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Uploads directory created");
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        console.log(file);
        cb(null, uploadDir);
    },
    filename:(req,file,cb)=>{
        console.log(file.originalname);
        cb(null, Date.now()+path.extname(file.originalname));
    }
});
const upload=multer({storage:storage});
export default upload;