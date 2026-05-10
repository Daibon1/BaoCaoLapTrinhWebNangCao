const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET
});

module.exports.upload = async (req, res, next) => {
    try {
        if (!req.file) return next();

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                    resource_type: "auto", // Tự động nhận dạng
                    use_filename: true,
                    unique_filename: true,
                    folder: "pdfs", // Tùy chọn: lưu vào thư mục riêng
                    flags: "attachment" // Đảm bảo file được xử lý đúng
                },
                (error, result) => {
                    if (result) resolve(result);
                    else reject(error);
                }
            );

            streamifier
                .createReadStream(req.file.buffer)
                .pipe(stream);
        });

        // ⭐ Lưu URL đã được format đúng
        req.body[req.file.fieldname] = result.secure_url;

        next();

    } catch (error) {
        console.log(error);
        next(error);
    }
};