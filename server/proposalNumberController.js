import fs from "fs"
import config from "config"

const filePathToLastProposalNumber = config.get("fileNameToLastProposalNumber")

export const createProposalNumber = () => {
    const sNumber = fs.readFileSync(filePathToLastProposalNumber, "utf-8")
    return Number(sNumber) + 1
}

export const writeLastProposalNumber = (number) => {
    fs.writeFileSync(filePathToLastProposalNumber, number.toString())
}
//Когда-то понадобиться, если нужно будет получать номер заявки с начала
export const clearLastProposalNumber = () => {
    const startingValue = -1;
    writeLastProposalNumber(startingValue)
}
