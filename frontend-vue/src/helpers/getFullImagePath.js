import urlJoin from 'url-join';

import config from '@/config';

const getFullImagePath = file => {
    const { date, type, filename, extension } = file;

    return urlJoin(
        config.apiMediaUrl,
        'uploads',
        date,
        `${type}s`,
        `${filename}.${extension}`
    );
};

export default getFullImagePath;
