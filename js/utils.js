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

// Extract date from results array
export function extractDate(result) {
    console.log(`extract date calling`, result);
    
    let date = null;
    let year = new Date().getFullYear();
    
    for (const line of result) {
        if (line.includes("- FLD (007)")) {
            const match = line.match(/- FLD \(007\).*?\[(\d{4})/);
            if (match) {
                const day = match[1].substring(2, 4);
                const month = match[1].substring(0, 2);
                date = `${day}/${month}/${year}`;
                break; // Exit the loop once the date is found
            }
        }
    }
    
    return date;
}

