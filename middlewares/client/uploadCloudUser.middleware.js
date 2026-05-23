const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

const buildPublicId = (file) => {
    const originalName = file.originalname || "cv.pdf";
    const baseName = originalName
        .replace(/\.[^/.]+$/, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase() || "cv";

    return `${baseName}-${Date.now()}.pdf`;
};

module.exports.upload = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        for (const file of req.files) {

            const isPdf = file.mimetype === "application/pdf";
            const uploadOptions = isPdf ? {
                resource_type: "raw",
                folder: "cvs",
                public_id: buildPublicId(file),
                use_filename: false,
                unique_filename: false
            } : {
                resource_type: "auto",
                folder: "uploads",
                use_filename: true,
                unique_filename: true
            };

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier
                    .createReadStream(file.buffer)
                    .pipe(stream);
            });

            req.body[file.fieldname] = result.secure_url;
        }

        next();

    } catch (error) {
        next(error);
    }
};
