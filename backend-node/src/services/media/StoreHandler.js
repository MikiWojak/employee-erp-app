const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');

class StoreMediaHandler {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    async handle(file) {
        const {
            size,
            filename,
            mimetype,
            path: oldPath,
            originalname: name
        } = file;
        const type = this.#getType(mimetype);
        const extension = name.split('.').pop();
        const date = dayjs().format('YYYY-MM');
        const newPath = `public/uploads/${date}/${type}s/${filename}.${extension}`;

        try {
            this.#createDirectoryIfNotExists(newPath);

            await fs.rename(oldPath, newPath, err => {
                if (err) {
                    console.error(err);
                }
            });

            const media = await this.mediaRepository.create({
                filename,
                name,
                altName: name,
                extension,
                type,
                date,
                size
            });

            return media;
        } catch (error) {
            console.error(error);

            return null;
        }
    }

    #getType(mimetype) {
        const types = {
            'image/jpeg': 'image',
            'image/png': 'image'
        };

        return types[mimetype] || 'other';
    }

    #createDirectoryIfNotExists(fullPath) {
        const dirPath = path.dirname(fullPath);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
}

module.exports = StoreMediaHandler;
