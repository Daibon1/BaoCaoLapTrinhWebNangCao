const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
// cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});
// end cloudinary

module.exports.upload = (req, res, next) => {
    if (req.file) {
        const isPdf = req.file.mimetype === "application/pdf";
        let uploadOptions = {
            resource_type: "auto",
            folder: "uploads",
            use_filename: true,
            unique_filename: true
        };

        if (isPdf) {
            const originalName = req.file.originalname || "cv.pdf";
            const pdfPublicId = originalName
                .replace(/\.[^/.]+$/, "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9-_]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "")
                .toLowerCase() || "cv";

            uploadOptions = {
                resource_type: "raw",
                folder: "cvs",
                public_id: `${pdfPublicId}-${Date.now()}.pdf`,
                use_filename: false,
                unique_filename: false
            };
        }

        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            try {
                let result = await streamUpload(req);
                req.body[req.file.fieldname] = result.secure_url;
                next();
            } catch (error) {
                console.log(error);
                next(error);
            }
        }
        upload(req);
    } else {
        next();
    }
}
