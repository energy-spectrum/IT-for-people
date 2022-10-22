import excel from "excel4node"
import UserModel from "./Models/UserModel.js"
import config from "config"

//Название всех колонок будет прописано в начальной строке. Индексация строк в excel начинается с 1
const rowWithColumnNames = 1

let workbook
let worksheet
let style

export default async (proposals = []) => {
    try {
        initializationExcel()
        toNameColumns()
        await write(proposals)

        const filePath = saveAndReturnFilePath()

        return filePath
    } catch (err) {
        throw err
    }
}

const initializationExcel = () => {
    workbook = new excel.Workbook()
    worksheet = workbook.addWorksheet('Sheet 1')
    style = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12
        },
    })
}

const toNameColumns = () => {
    const style = workbook.createStyle({
        font: {
            color: '#000000',
            size: 12
        },
    })

    worksheet.cell(rowWithColumnNames, 1).string("Номер заявки").style(style)
    worksheet.cell(rowWithColumnNames, 2).string("Название идеи").style(style)
    worksheet.cell(rowWithColumnNames, 3).string("Описание").style(style)
    worksheet.cell(rowWithColumnNames, 4).string("ФИО").style(style)
}

const write = async (proposals = []) => {
    for (let i = 0; i < proposals.length; i++) {
        const row = i + rowWithColumnNames + 1
        await writeOne(proposals[i], row)
    }
}

const writeOne = async (proposal, row) => {
    worksheet.cell(row, 1).number(proposal.number).style(style)
    worksheet.cell(row, 2).string(proposal.title).style(style)
    worksheet.cell(row, 3).string(proposal.description).style(style)

    const user = await UserModel.findById(proposal.userId).exec()

    if (user) {
        worksheet.cell(row, 4).string(user.fullName).style(style)
    }
}

const saveAndReturnFilePath = () => {
    const filePath = config.get('filePathToExcelFile')
    workbook.write(filePath)

    return filePath;
}