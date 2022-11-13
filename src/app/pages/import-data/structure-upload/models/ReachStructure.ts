import { Stream, tokenize, Reach } from './Stream';

export class ReachStructure {
    private _id: number;
    private _name: string;
    private _count: number;
    private _streams: Stream[];
    private _parameterSetId: number;
    private _isDefault: boolean;
    private _creationDate: string;

    constructor(json: any = null) {
        this._streams = [];
        if (json) {
            this.fromJson(json);
        }
    }

    get id(): number { return this._id; }
    get name(): string { return this._name; }
    get streams(): Stream[] { return this._streams; }

    set id(id: number) { this._id = id; }
    set name(name: string) { this._name = name; }
    set parameterSetId(id: number) { this._parameterSetId = id; }

    public buildDefault(reaches: any[], name: string) {
        const defaultStream: Stream = new Stream();
        defaultStream.buildDefault(reaches, name);

        this._streams.push(defaultStream);

        this._parameterSetId = 0;
        this._name = name;
    }

    public import(rows: string[]) {
        this._name = tokenize(rows[0], 'System name: ');
        this._count = +tokenize(rows[1], 'Stream count: ');
        const streamBlocks = this.splitStreams(rows);
        this.importStreams(streamBlocks);
    }

    public reachIndexesMatch(indexes: string[]): boolean {
        const parSetReaches = indexes.find(x => Object.keys(x)[0] === 'Reaches');
        const structureReaches = this.extractReachNames();
        if (!parSetReaches || parSetReaches.length === 0 || !structureReaches || structureReaches.length === 0) {
            return false;
        }
        return (structureReaches.map(x => x.toUpperCase()).sort().toString()
            === parSetReaches['Reaches'].map(x => x.reference.toUpperCase()).sort().toString());
    }

    public toFileString(): string {
        let fileString = `System name: ${this._name}\n`;
        fileString += `Stream count: ${this._streams.length}\n`;
        for (const stream of this._streams) {
            fileString += `\n${stream.toFileString()}`;
        }
        return fileString;
    }
    public findStreamByReachName(reachName: string): Stream {
        for (const stream of this._streams) {
            if (stream.hasReach(reachName)) {
                return stream;
            }
        }
        return null;
    }
    public findReachbyName(reachName: string): Reach {
        const stream = this.findStreamByReachName(reachName);
        if (stream) {
            return stream.reaches.find(r => r.name === reachName);
        }
        return null;
    }
    public addStream(stream: Stream) {
        this._streams.push(stream);
        this._count = this._streams.length;
    }
    private fromJson(json: any) {
        const object = JSON.parse(json);

        this._id = object.id;
        this._name = object.name;
        this._parameterSetId = object.parameterSetId;
        this._isDefault = object.isDefault;
        this._creationDate = object.creationDate;

        if (object.streams && object.streams.length > 0) {
            this._streams = [];
            this._count = object.streams.length;
            for (const stream of object.streams) {
                this._streams.push(new Stream(stream));
            }
        }
    }
    private extractReachNames(): string[] {
        const reachNames: any[] = [];
        for (const stream of this._streams) {
            reachNames.push(stream.getReachNames());
        }
        return reachNames.reduce((acc, val) => acc.concat(val), []);
    }
    private splitStreams(rows: string[]): any[] {
        const streamBlocks = [];
        let currentStream = [];
        for (let i = 3; i < rows.length; i++) {
            if (rows[i].includes('STREAM ID')) {
                if (currentStream && currentStream.length) {
                    streamBlocks.push(currentStream);
                }
                currentStream = [];
            }
            currentStream.push(rows[i]);
        }
        streamBlocks.push(currentStream);
        if (this._count !== streamBlocks.length) {
            throw new Error(`Structure file import error: Expected ${this._count} streams, got ${streamBlocks.length}`);
        } else {
            return streamBlocks;
        }
    }
    private importStreams(streamBlocks: any[]) {
        this._streams = [];
        for (const block of streamBlocks) {
            const stream = new Stream();
            stream.import(block);
            this._streams.push(stream);
        }
    }
}
