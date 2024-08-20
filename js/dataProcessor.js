// dataProcessor.js
import { getFiles } from './fileHandler.js';
import { displayOutput } from './uiHandler.js';
import { sortResultsByMTI } from './utils.js';

export function processFiles() {
    const files = getFiles();
    const mtiInput = document.getElementById("mtiInput");
    const mtis = mtiInput.value.split(",").map((mti) => mti.trim());
    const rrnInput = document.getElementById("rrnInput");
    const rrn = rrnInput.value.trim();
    
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

    let newData = [];
    let results = [];
    let filesProcessed = 0;

    Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = function () {
            const fileContent = reader.result;
            const output = extractInfoForMTIAndRRN(fileContent, mtis, rrn, trimStart);
            const separatedOutput = output.join("\n").split("separate");
            let result = separatedOutput.filter(
                (e) => e.includes(`[${rrn}]`) && searchPatterns.some((pattern) => e.includes(pattern))
            );
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
                displayOutput(results);
            }
        };
        reader.readAsText(file);
    });
}

function extractInfoForMTIAndRRN(fileContent, mtis, rrn, trimStart) {
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
        } else if (isInPassCase && (trimmedLine.includes("End   Dump")  || trimmedLine.includes("End Dump"))) {
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
            if (trimmedLine.includes(">")) {
                trimmedLine = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${trimmedLine}`;
            }
            output.push(`<span style="font-size: 0.8em; font-family: Calibri;">${trimmedLine}</span>`);
        }
    }
    return output;
}
