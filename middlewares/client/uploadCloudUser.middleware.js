const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});



module.exports.upload = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return next();
        }

        for (const file of req.files) {

            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: true,
                        folder: "pdfs",
                        flags: "attachment"
                    },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );

                streamifier
                    .createReadStream(file.buffer)
                    .pipe(stream);
            });

            // lưu vào body
            req.body[file.fieldname] = result.secure_url;
        }

        next();

    } catch (error) {
        next(error);
    }
};