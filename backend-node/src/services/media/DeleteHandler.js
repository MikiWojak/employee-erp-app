const fs = require('fs');

class DeleteMediaHandler {
    constructor(mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    async handle(mediaId) {
        try {
            // @TODO Media is being used!

            const media = await this.mediaRepository.findById(mediaId);

            if (!media) {
                return;
            }

            const { date, type, filename, extension } = media;
            const filePath = `public/uploads/${date}/${type}s/${filename}.${extension}`;

            await media.destroy();

            await fs.rm(filePath, err => {
                if (err) {
                    console.error(err);
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = DeleteMediaHandler;
