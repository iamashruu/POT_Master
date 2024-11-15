// dataProcessor.js
import { getFiles } from './fileHandler.js';
import { displayOutput } from './uiHandler.js';
import { sortResultsByMTI,extractDate } from './utils.js';

export function processFiles() {
    const files = getFiles();
    const mtiInput = document.getElementById("mtiInput");
    const mtis = mtiInput.value.split(",").map((mti) => mti.trim());
    const rrnInput = document.getElementById("rrnInput");
    const rrn = rrnInput.value.trim();
    console.log(rrn,typeof rrn)
    
    if (mtis.length === 0 || !rrn) {
        alert("Please enter valid MTIs and RRN.");
        return;
    }
    
    if (files.length === 0) {
        alert("Please upload files first.");
        return;
    }

    const trimStartInput = document.getElementById("trimStart").value;
    const trimStart = trimStartInput ? parseInt(trimStartInput, 10) : 36;
    
    const searchPatternsInput = document.getElementById("searchPatterns").value;
    const searchPatterns = searchPatternsInput
        ? searchPatternsInput.split(",").map((pattern) => pattern.trim())
        : ["End   DumpCis()", "End   DumpVisa()", "End   DumpBank()", "End   DumpSid()", "End   DumpSms()"];
    // console.log(searchPatterns)

    let newData = [];
    let results = [];
    let filesProcessed = 0;
    let date = null;
    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function () {
            const fileContent = reader.result;
            const output = extractInfoForMTIAndRRN(fileContent, mtis, rrn, trimStart,searchPatterns);
            const separatedOutput = output.join("\n").split("separate");
            //  console.log(separatedOutput[0])
            let result = separatedOutput.filter(
                (e) => e.includes(`[${rrn}]`) && searchPatterns.some((pattern) => e.includes(pattern))
            );
            // console.log(result)
            
            // Extract date from the first file only
            if (date === null && result.length > 0) {
                date = extractDate(result); // Only set the date once
            }
            newData = newData.concat(result);
            filesProcessed++;
            if (filesProcessed === files.length) {
                if (newData.length > 0) {
                    let mtiSortResult = sortResultsByMTI(newData);
                    mtiSortResult.forEach((e) => {
                        let newResult = e.split("\n");
                        results = results.concat(newResult);
                    });
                }

 
            displayOutput(results, rrn, date); // Pass extracted date to displayOutput
                // displayOutput(results,rrn);
            }
        };
        reader.readAsText(file);
    });
}

function extractInfoForMTIAndRRN(fileContent, mtis, rrn, trimStart,searchPatterns) {
    const lines = fileContent.split("\n");
    const output = [];
    let isInPassCase = false;

    for (const line of lines) {
        let trimmedLine = line.substring(trimStart, 132).trim();
        if (trimmedLine.endsWith(".")) {
            trimmedLine = trimmedLine.slice(0, -1);
        }
        let mtiMatched = false;
        for (const mti of mtis) {
            if (trimmedLine.startsWith("- M.T.I") && (trimmedLine.includes(`[${mti}]`) || trimmedLine.includes(`${mti}`))) {
                mtiMatched = true;
                output.push(`<br><span style="font-size: 1.6rem;font-family: Calibri;"><strong>Message ${mti}:</strong></span><br><br> <span style="font-size: 0.8em; font-family: Calibri;">${trimmedLine}</span><br>`);
                break;
            }
        }
        if (mtiMatched) {
            isInPassCase = true;
        } else if (isInPassCase && (trimmedLine.includes("End   Dump")  || trimmedLine.includes("End Dump") || trimmedLine.includes(`${searchPatterns}`))) {
            output.push(`<span style="font-size: 0.8em; font-family: Calibri;">${trimmedLine}</span>`);
            output.push("separate");
            isInPassCase = false;
        } else if (isInPassCase && (trimmedLine.startsWith("- FLD") || trimmedLine.includes(">"))) {
            if (trimmedLine.includes("- FLD (002)")) {
                trimmedLine = trimmedLine.replace(/(\d{5})\d+(\d{3})/, "$1*******$2");
            }
            
            if (trimmedLine.includes("- FLD (035)")) {
                trimmedLine = trimmedLine.replace(/(\d{5})\d{6,12}(\d{3}D)/, "$1*******$2");
                trimmedLine = trimmedLine.replace(/(\d{5})\d{6,12}(\d{3}=)/, "$1*******$2");
            }
            if (trimmedLine.includes("- FLD (053)") || trimmedLine.includes("> TAG (9F1E)")) {
                // Insert a single space in the middle of the 16-digit number without skipping any digits
                trimmedLine = trimmedLine.replace(/(\d{8})(\d{8})/, "$1 $2");
            }
            
            if (trimmedLine.includes(">")) {
                trimmedLine = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${trimmedLine}`;
            }
            output.push(`<span style="font-size: 0.8em; font-family: Calibri;">${trimmedLine}</span>`);
        }
    }
    return output;
}
