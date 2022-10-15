import { google } from "googleapis";
let jwtClient = null;
export async function pushToGoogle(comparableCollection, record, clientEmail, privateKey, sheetId) {
    if (clientEmail === undefined || privateKey === undefined || sheetId === undefined) {
        throw new Error("missing private key or sheet id or client email. Make sure you have service account json");
    }
    const jwtClient = new google.auth.JWT(clientEmail, undefined, privateKey, 'https://www.googleapis.com/auth/spreadsheets');
    jwtClient.authorize((err) => { if (err)
        throw new Error('Google authentication error. Make sure you have correct credentials: ' + err); });
    const sheets = google.sheets({ version: "v4", auth: jwtClient });
    const requestBody = await createComparableGoogleRecord(record);
    sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:E',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'OVERWRITE',
        requestBody
    }, (err) => { if (err)
        throw new Error('Google append make sure your account have access to given sheetId table. error: ' + err); });
}
export async function createComparableGoogleRecord(record) {
    const values = [[]];
    let count = 0;
    for (const item of record) {
        values[count] = [];
        Object.values(item[1]).forEach((value) => {
            values[count].push(value);
        });
        count++;
    }
    return { majorDimension: "ROWS", values };
}
//# sourceMappingURL=google.js.map
