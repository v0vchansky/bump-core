const randomIntFromInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomCode = (length: number) => {
    if (length < 4) {
        throw new Error('Code is so short');
    }

    let code = '';

    for (let i = 0; i < length; i++) {
        code = `${code}${randomIntFromInterval(0, 9)}`;
    }

    return code;
};
