const express = require('express');
const multer = require('multer');
const path = require('path');
const markdownpdf = require('markdown-pdf');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/markdown' || file.originalname.endsWith('.md')) {
            cb(null, true);
        } else {
            cb(new Error('Only markdown files are allowed'));
        }
    }
});

// Routes
router.get('/test', (req, res) => {
    res.send('Convert route is working');
});

router.post('/convert', upload.single('markdown'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const inputPath = req.file.path;
    const outputPath = path.join(__dirname, '../../uploads', `${req.file.filename}.pdf`);

    markdownpdf()
        .from(inputPath)
        .to(outputPath, (err) => {
            if (err) {
                console.error('Conversion error:', err);
                return res.status(500).send('Error converting file');
            }

            res.download(outputPath, (err) => {
                if (err) {
                    console.error('Download error:', err);
                }
                // Clean up files after sending
                setTimeout(() => {
                    try {
                        fs.unlinkSync(inputPath);
                        fs.unlinkSync(outputPath);
                    } catch (err) {
                        console.error('Cleanup error:', err);
                    }
                }, 1000);
            });
        });
});

// Make sure to export the router
module.exports = router;
