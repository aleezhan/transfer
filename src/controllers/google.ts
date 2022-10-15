import { google } from "googleapis"

export async function pushToGoogle(comparableCollection: string, record: any, clientEmail: string | undefined, privateKey: string | undefined, sheetId: string | undefined) {
    if (clientEmail === undefined || privateKey === undefined || sheetId === undefined) {
        throw new Error("missing private key or sheet id or client email. Make sure you have service account json")
    }

    const jwtClient = new google.auth.JWT(clientEmail, undefined, privateKey, 'https://www.googleapis.com/auth/spreadsheets')

    jwtClient.authorize((err: (NodeJS.ErrnoException | null)) => { if (err) throw new Error('Google authentication error. Make sure you have correct credentials: ' + err) })

    const sheets = google.sheets({ version: "v4", auth: jwtClient });

    const requestBody = await createComparableGoogleRecord(record)

    sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:E',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        requestBody
    }, (err: (NodeJS.ErrnoException | null)) => { if (err) throw new Error('Google append make sure your account have access to given sheetId table. error: ' + err) })
}

export async function createComparableGoogleRecord(record: any) {
    const values: (string | number)[][] = [[]]
    let count = 0

    for (const item of record) {
        values[count] = []
        Object.values(item[1]).forEach((value: any) => {
            values[count].push(value)
        })
        count++
    }

    return {majorDimension: "ROWS", values}
}
