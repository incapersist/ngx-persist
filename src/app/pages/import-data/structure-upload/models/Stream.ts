export const tokenize = (row: string, token: string): string => {
    if (row.includes(token)) {
        return row.replace(token, '');
    } else {
        throw new Error(`Structure file import error: Failed to find token '${token}'`);
    }
};

export class Reach {
    private _index_id: number;
    private _id: string;
    private _name: string;
    private _inputs: any[];
    private _uLat = 0;
    private _uLong = 0;
    private _dLat = 0;
    private _dLong = 0;

    constructor(reach: any = null) {
        this.inputs = [];

        if (reach) {
            this.fromJson(reach);
        }
    }

    get id(): string { return this._id; }
    get index_id(): number { return this._index_id; }
    get name(): string { return this._name; }
    get lower_latitude(): number { return this._dLat; }
    get lower_longitude(): number { return this._dLong; }
    get inputs(): any[] { return this._inputs; }

    set id(id: string) { this._id = id; }
    set index_id(id: number) { this._index_id = id; }
    set name(name: string) { this._name = name; }
    set inputs(inputs: any[]) { this._inputs = inputs; }
    set lower_latitude(latitude: number) { this._dLat = latitude; }
    set lower_longitude(longitude: number) { this._dLong = longitude; }

    public import(block: any[]) {
        this._id = tokenize(block[0], 'Reach ID: ');
        this._name = tokenize(block[2], 'Name: ');

        this._uLat = +tokenize(block[3], 'Upstream boundary latitude: ');
        this._uLong = +tokenize(block[4], 'Upstream boundary longitude: ');
        this._dLat = +tokenize(block[5], 'Downstream boundary latitude: ');
        this._dLong = +tokenize(block[6], 'Downstream boundary longitude: ');

        this._inputs = tokenize(block[7], 'Inputs: ').split(/\s+/).filter(Boolean);
    }

    public toFileString(): string {
        let fileString = `Reach ID: ${this._id}\n`;
        fileString += `-------------------\n`;
        fileString += `Name: ${this._name}\n`;
        fileString += `Upstream boundary latitude: ${this._uLat}\n`;
        fileString += `Upstream boundary longitude: ${this._uLong}\n`;
        fileString += `Downstream boundary latitude: ${this._dLat}\n`;
        fileString += `Downstream boundary longitude: ${this._dLong}\n`;

        fileString += `Inputs: ${this._inputs.join(' ')}\n`;

        return fileString;
    }

    private fromJson(reach: any) {
        this._index_id = +reach.index_id;
        this._id = reach.id;
        this._name = reach.id;

        this._uLat = reach.upper_latitude;
        this._uLong = reach.upper_longitude;
        this._dLat = reach.lower_latitude;
        this._dLong = reach.lower_longitude;

        this._inputs = [];

        if (reach.inputs && reach.inputs.length > 0 && Object.keys(reach.inputs[0]).length !== 0) {
            for (const input of reach.inputs) {
                this._inputs.push(input);
            }
        }
    }
}

export class Stream {
    private _id: string;
    private _name: string;
    private _order: number;
    private _reachCount: number;
    private _lakeCount: number;
    private _reaches: Reach[];

    constructor(stream: any = null) {
        this._lakeCount = 0;
        this._reaches = [];

        if (stream) {
            this.fromJson(stream);
        }
    }

    get id(): string { return this._id; }
    get name(): string { return this._name; }
    get order(): number { return this._order; }
    get reaches(): Reach[] { return this._reaches; }

    set name(name: string) { this._name = name; }
    set order(o: number) { this._order = o; }

    public buildDefault(reaches: any[], name: string) {
        let lastReach: Reach;
        for (const r of reaches) {
            const reach = new Reach();
            reach.index_id = r._id;
            reach.name = r._reference;
            reach.id = r._reference;

            if (lastReach) {
                reach.inputs = [lastReach];
            }

            this._reaches.push(reach);
            lastReach = reach;
        }

        this._order = 0;
        this._name = name;
    }

    public import(block: any[]) {
        this._id = tokenize(block[0], 'STREAM ID: ');
        this._name = tokenize(block[2], 'Name: ');
        this._order = +tokenize(block[3], 'Order: ');
        this._reachCount = +tokenize(block[4], 'Reach count: ');
        this._lakeCount = +tokenize(block[5], 'Lake count: ');

        const reachBlocks = this.splitReaches(block);
        this.importReaches(reachBlocks);
    }

    public getReachNames(): string[] {
        const names: string[] = [];
        for (const reach of this._reaches) {
            names.push(reach.name);
        }

        return names;
    }

    public toFileString(): string {
        let fileString = `======================\n`;
        fileString += `STREAM ID: ${this._name}\n`;
        fileString += `======================\n`;
        fileString += `Name: ${this._name}\n`;
        fileString += `Order: ${this._order}\n`;
        fileString += `Reach count: ${this._reachCount}\n`;
        fileString += `Lake count: ${this._lakeCount}\n`;

        for (const reach of this._reaches) {
            fileString += `\n${reach.toFileString()}`;
        }

        return fileString;
    }

    public hasReach(reachName: string): boolean {
        for (const reach of this._reaches) {
            if (reach.name === reachName) { return true; }
        }

        return false;
    }

    public addReach(reach: Reach) {
        this._reaches.push(reach);
        this._reachCount = this._reaches.length;
    }

    private fromJson(stream: any) {
        this._name = stream.name;
        this._id = stream.id;
        this._order = stream.order;

        if (stream.reaches && stream.reaches.length > 0) {
            this._reaches = [];
            this._reachCount = stream.reaches.length;

            for (const reach of stream.reaches) {
                this._reaches.push(new Reach(reach));
            }
        }
    }

    private splitReaches(rows: string[]): any[] {
        const reachBlocks = [];
        let currentReach = [];

        for (let i = 6; i < rows.length; i++) {
            if (rows[i].includes('Reach ID')) {
                if (currentReach && currentReach.length) {
                    reachBlocks.push(currentReach);
                }
                currentReach = [];
            }
            currentReach.push(rows[i]);
        }
        reachBlocks.push(currentReach);

        if (this._reachCount !== reachBlocks.length) {
            throw new Error(`Structure file import error: In stream ${this._name}, expected ${this._reachCount} reaches, got ${reachBlocks.length}`);
        } else {
            return reachBlocks;
        }
    }

    private importReaches(reachBlocks: any[]) {
        this._reaches = [];

        for (const block of reachBlocks) {
            const reach = new Reach();
            reach.import(block);
            this._reaches.push(reach);
        }
    }
}


