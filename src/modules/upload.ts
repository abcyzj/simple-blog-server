import multer from 'koa-multer';
import path from 'path';
import uuid from 'uuid/v4';
import CONFIG from '../config';

const storage = multer.diskStorage({
    destination: path.join(CONFIG.BLOG_STATIC_DIR, CONFIG.UPLOAD_IMG_DIR),
    filename: (req, file, callback) => {
        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec(file.originalname);
        if (!ext || !ext[1]) {
            callback(null, `${uuid()}`);
        } else {
            callback(null, `${uuid()}.${ext[1]}`);
        }
    },
});

const upload = multer({storage});

export default upload;
