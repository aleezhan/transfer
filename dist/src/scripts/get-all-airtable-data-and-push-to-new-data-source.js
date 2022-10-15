import minimist from "minimist";
import { utilPrint } from "../utils/print.js";
import { DataSourceType, getComparableRecord, pushToDataSource, getDataMapGivenDataSource, } from "../controllers/data-sources.js";
import { IntersectionFieldType } from "../controllers/enums.js";
import fs from "fs";
const ARG_API_KEY = 'apiKey';
const ARG_BASE_ID = 'baseId';
const ARG_TABLE_ID = 'tableId';
const ARG_LOOKBACK_PERIOD = 'lookbackPeriod';
const ARG_SHEET_ID = 'sheetId';
async function getAllAirtableDataAndPushToNewDataSource(apiKey, baseId, tableId, lookbackPeriod, clientEmail, privateKey, sheetId) {
    const airtableDataSource = {
        type: DataSourceType.airtable,
        configuration: {
            writable: false,
        },
        connection_details: {
            look_back_period_in_ms: lookbackPeriod,
            base_id: baseId,
            table_id: tableId,
            api_key: apiKey,
            return_fields_by_field_id: false,
        }
    };
    const googleDataSource = {
        type: DataSourceType.google,
        configuration: {
            writable: true,
        },
        connection_details: {
            look_back_period_in_ms: lookbackPeriod,
            base_id: clientEmail,
            table_id: sheetId,
            api_key: privateKey,
            return_fields_by_field_id: false,
        }
    };
    const fieldMapping = [{
            ENTRY_NAME: 'id',
            AIRTABLE: 'id',
            DATA_TYPE: IntersectionFieldType.string
        }, {
            ENTRY_NAME: 'name',
            AIRTABLE: 'name',
            DATA_TYPE: IntersectionFieldType.string
        }, {
            ENTRY_NAME: 'country',
            AIRTABLE: 'Country',
            DATA_TYPE: IntersectionFieldType.string
        }];
    if (apiKey && baseId && tableId && lookbackPeriod) {
        const airtableRecords = await getDataMapGivenDataSource(lookbackPeriod, airtableDataSource);
        utilPrint({ airtableRecords });
        const reformattedRecords = new Map();
        for (const record of airtableRecords) {
            await reformattedRecords.set(record[0], await getComparableRecord(DataSourceType.google, record[1], fieldMapping));
        }
        await pushToDataSource(DataSourceType.google, reformattedRecords, fieldMapping, googleDataSource);
        return true;
    }
    else {
        throw new Error("MISSING ARGUMENTS");
    }
}
async function run() {
    const argv = minimist(process.argv.slice(2));
    const apiKey = argv[ARG_API_KEY];
    const baseId = argv[ARG_BASE_ID];
    const tableId = argv[ARG_TABLE_ID];
    const lookbackPeriod = argv[ARG_LOOKBACK_PERIOD];
    const sheetId = argv[ARG_SHEET_ID];
    const googleCredentials = JSON.parse(fs.readFileSync('credentials.json').toString());
    const clientEmail = googleCredentials.client_email;
    const privateKey = googleCredentials.private_key;
    return await getAllAirtableDataAndPushToNewDataSource(apiKey, baseId, tableId, lookbackPeriod, clientEmail, privateKey, sheetId);
}
run().then(() => {
    console.log('finished script');
});
//# sourceMappingURL=get-all-airtable-data-and-push-to-new-data-source.js.map