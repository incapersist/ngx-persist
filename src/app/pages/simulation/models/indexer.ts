export class IndexerName {
    constructor(
        private _name: string,
        private _id?: number,
        private _modelVersionId?: number
    ) {}

    get name(): string {
        return this._name;
    }

    get id(): number {
        return this._id;
    }
}

export class Index {
    constructor(
        private _reference: string,
        private _id?: number,
    ) {}

    get id(): number {
        return this._id;
    }

    get reference(): string {
        return this._reference;
    }
}

interface IterateIndex {
  [Symbol.iterator](): IterableIterator<Index>;
}

export class Indexer implements IterateIndex {
    _indexes: Index[];

    constructor(
        private _name: IndexerName
    ) {
        this._indexes = [];
    }

    // https://stackoverflow.com/questions/47100252/typescript-implementation-of-symbol-iterator-why-it-doesnt-work-on-unit-tes
    *[Symbol.iterator]() {
        for(let index of this._indexes) {
            yield index;
        }
    }

    addIndex(index: Index) {
        this._indexes.push(index);
    }

    get name(): string {
        return this._name.name;
    }

    findIndexById(id: number) {
        return this._indexes.find(x => x.id === id);
    }
}