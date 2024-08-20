// utils.js
export function sortResultsByMTI(results) {
    const mtiPattern = /<strong>Message (\d{4}):<\/strong>/;
    return results.sort((a, b) => {
        const mtiA = a.match(mtiPattern);
        const mtiB = b.match(mtiPattern);
        if (mtiA && mtiB) {
            return parseInt(mtiA[1], 10) - parseInt(mtiB[1], 10);
        }
        return 0;
    });
}
