export const convertColorNameToHex = (str?: string): string => {
    if (!str) {
        return '';
    }
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) {
        return '';
    }
    ctx.fillStyle = str;
    return ctx.fillStyle;
};
