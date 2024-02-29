const getRgbHexValue = (red: number, green: number, blue: number) => {
    const r = red.toString(16).padStart(2, '0');
    const g = green.toString(16).padStart(2, '0');
    const b = blue.toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
};

export default getRgbHexValue;
