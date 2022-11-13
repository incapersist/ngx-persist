export const inputFileTypeEnum = {
    HYDROLOGY: 1,
    OBSERVED: 2,
    EFFLUENT: 3,
    ABSTRACTION: 4,
    PARAMETER: 5,
    PET: 6,
    STRUCTURE: 7,
};

export interface ObservedDataTags {
    id: number;
    tag: string;
    resultItemId: number;
    description: string;
}

export class ReachData {
    reachId: string;
    itemId: number;
    columns: any;

    constructor(json: any = null, itemId: number = null) {
        if (json) {
            this.parseJson(json);
        }

        this.itemId = itemId;
    }

    parseTextFileContents(block: string[], columnNames: string[], indexes: string[] = null) {
        this.columns = {};
        for (let col = 0; col < columnNames.length; col++) {
            this.columns[columnNames[col]] = [];
        }

        const reachIdRow = block.shift();

        try {
            this.setReachId(reachIdRow);
        } catch (e) {
            throw e;
        }

        if (indexes && indexes.length > 0) {
            if (!(indexes.map(x => x.toUpperCase()).includes(this.reachId.toUpperCase()))) {
                throw new Error(`Indexer '${this.reachId}' is not part of the parameter set`);
            }
        }

        for (let i = 0; i < block.length; i++) {
            const columns: string[] = this.columnSplit(block[i]);

//            if (columns.length !== columnNames.length) {
            if (columns.length < 2) {
                throw new Error(`Wrong number of data columns: expected ${columnNames.length}, got ${columns.length}`);
            }

            for (let col = 0; col < columns.length; col++) {
                this.columns[columnNames[col]].push(columns[col]);
            }
        }
    }

    setReachId(row: string) {
        const columns: string[] = this.columnSplit(row);

        if (columns.length !== 1) {
            throw new Error('Couldn\'t find a reach identifier');
        }

        this.reachId = columns[0];
    }

    columnSplit(row: string) {
        // https://stackoverflow.com/questions/26425637/javascript-split-string-with-white-space
        const words: string[] = row.trim().split(/\s+/);
        return words;
    }

    parseJson(json: any) {
        this.reachId = json['reachId'];
        this.columns = {};

        this.columns['precipitation'] = json['columns']['precipitation'];
        this.columns['temperature'] = json['columns']['temperature'];
        this.columns['solar_radiation'] = json['columns']['solar_radiation'];
    }

    timesteps(): number {
        if (this.columns ) {
            return this.columns[0].length;
        }

        return 0;
    }
}

export class TimeSeriesData {
    reachData: ReachData[];
    reachCount: number;

    constructor(json: any = null) {
        if (json) {
            this.parseJson(json);
        }
    }

    parseTextFileContents(dataBlock: string[], columnNames: string[], expectedRowCount: number, indexes: string[] = null) {
        this.reachData = [];

        const blockCount: number = +dataBlock.shift();

        for (let i = 0; i < blockCount; i++) {
            const blockSize = +expectedRowCount + 1;
            const block = dataBlock.slice(i * blockSize, (i + 1) * blockSize);

            const r = new ReachData();

            try {
                r.parseTextFileContents(block, columnNames, indexes);
            } catch (e) {
                throw e;
            }

            this.reachData.push(r);
        }

        this.reachCount = this.reachData.length;
    }

    parseJson(json: any) {
        this.reachData = [];
        this.reachCount = +json['reachCount'];

        for (let i = 0; i < json['reachData'].length; i++) {
            const rd = new ReachData(json['reachData'][i]);
            this.reachData.push(rd);
        }
    }

    timesteps(): number {
        if (this.reachData && this.reachData.length > 0) {
            return this.reachData[0].timesteps();
        }

        return 0;
    }
}

export class ObsData extends TimeSeriesData {
  //  reachData: ReachData[];
  //  reachCount: number;

    constructor(json: any = null) {
        super(json);
        if (json) {
            this.parseJson(json);
        }
    }

    parseReaches(blocks: ObsBlock[], columnNames: string[], indexes: string[] = null) {
        this.reachData = [];

        for (const block of blocks) {
            const r = new ReachData(null, block.itemId);

            try {
                r.parseTextFileContents(block.rows, columnNames, indexes);
            } catch (e) {
                throw e;
            }

            this.reachData.push(r);
        }

        this.reachCount = this.reachData.length;
    }

    timesteps(): number {
        if (this.reachData && this.reachData.length > 0) {
            return this.reachData[0].timesteps();
        }

        return 0;
    }
}

export class InputData {
    protected timesteps: number;
    protected timeSeriesData: TimeSeriesData;
    protected columnNames: string[];
    protected log: string[];

    constructor() {
        this.log = [];
    }

    parseTextFileContents(rows: string[], indexes: string[] = null) {
        this.timesteps = +rows.shift();

        this.timeSeriesData = new TimeSeriesData();

        try {
            this.timeSeriesData.parseTextFileContents(rows, this.columnNames, this.timesteps, indexes);
        } catch (e) {
            throw e;
        }
    }

    parseJson(json: any) {
        this.timeSeriesData = new TimeSeriesData(json);
        this.timesteps = this.timeSeriesData.timesteps();
    }
}

export class DrivingData extends InputData {
    constructor(json: any = null) {
        super();

        this.columnNames = [];
        this.columnNames.push('precipitation');
        this.columnNames.push('temperature');
        this.columnNames.push('solar_radiation');

        if (json) {
            this.parseJson(json);
        }
    }
}

class ObsBlock {
    rows: any[];
    itemId: number;
    rowOffset = 0;

    private _log: string[];

    get log(): string[] {
        return this._log;
    }

    constructor(itemId: number, rowOffset: number) {
        this.rows = [];
        this.itemId = itemId;
        this.rowOffset = rowOffset;
    }

    // Check if this block has duplicate dates
    hasDuplicateDate(hasDailyStepSize: boolean): boolean {
        let fileDates: any[] = [];

        // Make an array of dates in this block of data. Depending on
        // the model version used, the date may or may not have a time component.
        if (!hasDailyStepSize) {
            fileDates = this.rows.map(x => { const words = x.split(/\s+/); return (`${words[0]} ${words[1]}`); });
        } else {
            fileDates = this.rows.map(x => { const words = x.split(/\s+/); return words[0]; });
        }

        const setDates = new Set();
        this._log = [];

        let i = 0;
        for (const row of fileDates) {
            if (setDates.has(row)) {
                this._log.push(`row ${this.rowOffset + i} has a duplicate date`);
           }
            setDates.add(row);
            i++;
        }

        return (this._log.length !== 0);
    }
}

export class ObservedData extends InputData {
    protected timeSeriesData: ObsData;

    constructor(private tags: ObservedDataTags[], private hasDailyStepSize: boolean, json: any = null) {
        super();

        this.columnNames = [];
        this.columnNames.push('observation_date');

        if (!hasDailyStepSize) {
            this.columnNames.push('observation_time');
        }

        this.columnNames.push('observation');

        if (json) {
            this.parseJson(json);
        }
    }

    matchObservedDataTag(row: string): number {
        for (const tag of this.tags) {
            const needle = tag.tag.replace(/\s+/g, '').toUpperCase();
            const haystack = row.replace(/\s+/g, '').toUpperCase();

            if (haystack.indexOf(needle) > -1) {
                return tag.resultItemId;
            }
        }

        return -1;
    }

    parseTextFileContents(contents: string[], indexes: string[] = null) {
        const blocks: any[] = [];
        let currentBlock = null;

        let currentRow = 0;
        while (currentRow < contents.length) {
            const reachIndex = contents[currentRow].toUpperCase().indexOf('REACH');
            if (reachIndex > -1) {
                const reachId = contents[currentRow].substring(reachIndex).split(' ')[1].replace(/\W/g, '');
                currentRow++;

                const itemId = this.matchObservedDataTag(contents[currentRow]);

                if (itemId) {
                    currentRow++;
                    if (currentBlock && currentBlock.rows.length > 0) {
                        blocks.push(currentBlock);
                    }
                    currentBlock = new ObsBlock(itemId, currentRow);
                    currentBlock.rows.push(reachId);
                } else {
                    throw Error(`Could not match observed tag: ${contents[currentRow]} on line: ${currentRow}`);
                }
            }

            // Check if this row has the expected number of columns. If not, ignore it.
            if (contents[currentRow].trim().split(/\s+/).length === this.columnNames.length) {
                currentBlock.rows.push(contents[currentRow]);
            } else {
                this.log.push(`row ${currentRow + 1} has no data`);
            }

            currentRow++;
        }

        if (currentBlock.hasDuplicateDate(this.hasDailyStepSize)) {
            this.log = this.log.concat(currentBlock.log);
            throw Error (`This file has at least one duplicate date. You must remove the duplicates before you can upload the file`);
        }

        blocks.push(currentBlock);

        this.timeSeriesData = new ObsData();

        try {
  //          this.timeSeriesData.parseReaches(blocks, this.columnNames, indexes);
        } catch (e) {
            throw e;
        }
    }
}

export class AbstractionData extends InputData {
    constructor(timesteps: number, json: any = null) {
        super();

        this.columnNames = [];
        this.columnNames.push('abstraction');

        this.timesteps = timesteps;

        if (json) {
            this.parseJson(json);
        }
    }

    parseTextFileContents(rows: string[], indexes: string[] = null) {
        this.timeSeriesData = new TimeSeriesData();

        try {
            this.timeSeriesData.parseTextFileContents(rows, this.columnNames, this.timesteps, indexes);
        } catch (e) {
            throw e;
        }
    }
}

export class EffluentData extends InputData {
    constructor(timesteps: number, json: any = null) {
        super();

        this.columnNames = [];
        this.columnNames.push('effluent');

        this.timesteps = timesteps;

        if (json) {
            this.parseJson(json);
        }
    }

    parseTextFileContents(rows: string[], indexes: string[] = null) {
        this.timeSeriesData = new TimeSeriesData();

        try {
            this.timeSeriesData.parseTextFileContents(rows, this.columnNames, this.timesteps, indexes);
        } catch (e) {
            throw e;
        }
    }
}

export class PetData extends InputData {
    constructor(timesteps: number, json: any = null, indexes: string[] = null) {
        super();

        this.columnNames = [];

        for (const index of indexes) {
            this.columnNames.push(index);
        }

        this.timesteps = timesteps;

        if (json) {
            this.parseJson(json);
        }
    }

    parseTextFileContents(rows: string[], indexes: string[] = null) {
        this.timeSeriesData = new TimeSeriesData();

        try {
            this.timeSeriesData.parseTextFileContents(rows, this.columnNames, this.timesteps, indexes);
        } catch (e) {
            throw e;
        }
    }
}
