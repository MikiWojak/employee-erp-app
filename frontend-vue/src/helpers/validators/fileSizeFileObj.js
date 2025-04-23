const fileSizeFileObj =
    (maxSizeMb = 5) =>
    value => {
        if (!(value instanceof File)) {
            return true;
        }

        const maxSize = maxSizeMb * 1024 * 1024;

        return value.size <= maxSize;
    };

export default fileSizeFileObj;
