const fileTypeFileObj =
    (types = []) =>
    value => {
        if (!(value instanceof File)) {
            return true;
        }

        return types.includes(value.type);
    };

export default fileTypeFileObj;
