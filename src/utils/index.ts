export const reorder = <T>(list: T[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

export const clamp = (num: number, min: number, max: number) =>
    Math.min(Math.max(num, min), max);
