import { Indexer, IndexerName, Index } from 'src/app/pages/simulation/models/indexer';
import { js2xml, xml2js } from 'xml-js';
import { XML_OPTIONS } from 'src/app/app.constants';

export interface ParameterSetMeta {
    id: number;
    reference: string;
    startDate: string;
    timesteps: number;
    stepSize: number;
    modelVersion: string;
    lastEditDate: string;
    modelVersionId: number;
    inputFileId?: number;
}

export interface IParameterItem {
    name: string;
}

export abstract class ParameterItem {
    constructor(protected _name: string) {}

    get name() { return this._name; }
    set name(name: string) { this._name = name; }
    updateAll(fromParameter: IParameter) {}
}

export interface IParameter extends IParameterItem {
    currentValue: number;
    units?: string;
    defaultValue?: number;
    minimumValue?: number;
    maximumValue?: number;
    description?: string;
    id?: number;
    controlTypeId?: number;
}

export class Parameter extends ParameterItem implements IParameter {

    constructor(
        public name: string,
        private _currentValue: number,
        private _units?: string,
        private _defaultValue?: number,
        private _minimumValue?: number,
        private _maximumValue?: number,
        private _description?: string,
        private _id?: number,
    ) {
        super(name);
    }

    get currentValue(): number { return this._currentValue; }
    get units(): string { return this._units; }
    get defaultValue(): number { return this._defaultValue; }
    get minimumValue(): number { return this._minimumValue; }
    get maximumValue(): number { return this._maximumValue; }
    get id(): number { return this._id; }

    set currentValue(val: number) {
        if (val >= this._minimumValue && val <= this._maximumValue) {
            this._currentValue = +val;
        }
    }
    set units(units: string) { this._units = units; }
    set defaultValue(defaultValue: number) { this._defaultValue = defaultValue; }
    set minimumValue(minimumValue: number) { this._minimumValue = minimumValue; }
    set maximumValue(maximumValue: number) { this._maximumValue = maximumValue; }

    updateAll(fromParameter: IParameter) {
        if (this._id === fromParameter.id && this !== fromParameter) {
            this._currentValue = fromParameter.currentValue;
        }
    }
}

export class ParameterDefaults {
    private parameters: Parameter[];

    constructor(json: any) {
        this.parameters = [];
        for (const row of json) {
            this.parameters.push(
                new Parameter(
                    row.name,
                    null,
                    row.units,
                    +row.default_value,
                    +row.minimum_value,
                    +row.maximum_value,
                    row.description,
                    +row.id
                )
            );
        }
    }

    public findById(id: number) {
        return this.parameters.find(x => x.id === id);
    }
}

export interface IterateParameterItem {
  [Symbol.iterator](): IterableIterator<ParameterItem>;
}

export class ParameterContainer extends ParameterItem implements IterateParameterItem {
    protected _items: ParameterItem[];

    constructor(name: string) {
        super(name);
        this._items = [];
    }

    // https://stackoverflow.com/questions/47100252/typescript-implementation-of-symbol-iterator-why-it-doesnt-work-on-unit-tes
    *[Symbol.iterator]() {
        for (const index of this._items) {
            yield index;
        }
    }

    get name(): string { return this._name; }
    get first(): ParameterItem { return this._items[0]; }

    addItem(item: ParameterItem) {
        this._items.push(item);
    }

    findParameterItem(name: string, level: number = 1) {
        for (const item of this._items) {
            if (item.name === name) {
                return item;
            }
        }

        return null;
    }
}

export class ParameterGroup extends ParameterContainer {

    constructor(name: string, private _indexer?: Indexer) {
        super(name);
    }

    get indexer() { return this._indexer; }
}

export class ParameterSet extends ParameterContainer {
    private _indexers: Indexer[];
    private defaults: ParameterDefaults;
    private reference: string;
    private created: string;
    private fileId: number;

    constructor(
        name: string,
        private _version: string,
        private _description: string
    ) {
        super(name);

        this._indexers = [];
    }

    static fromJson(object: any): ParameterSet {
        const xml = js2xml(object, XML_OPTIONS);
        const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
        const root = xmlDoc.getElementsByTagName('ParameterSet')[0];

        const pars = new ParameterSet(root.getAttribute('model'), root.getAttribute('version'), root.getAttribute('description'));
        pars.parseXml(root);

        return pars;
    }

    findParameterGroup(groupName: string, level: number = 1): ParameterGroup {
        const mainContainer = <ParameterContainer>this._items[0];
        return <ParameterGroup>mainContainer.findParameterItem(groupName, level);
    }

    addIndexer(indexer: Indexer) {
        this._indexers.push(indexer);
    }

    findIndexer(name: string): Indexer {
        if (this._indexers && this._indexers.length > 0) {
            return this._indexers.find(x => x.name === name);
        }

        return null;
    }

    parseXml(root: Element) {
        this.parseIndexers(root.getElementsByTagName('Indexers')[0]);
        this.parseParameterContainer(root.getElementsByTagName('ParameterContainer')[0], this);
    }

    private parseIndexers(node: Element) {
        const indexerCount: number = +node.getAttribute('count');

        if (indexerCount !== +node.children.length) {
            throw Error(`Number of available Indexers (${node.children.length}) does not match number of expected Indexers (${indexerCount})`);
        }

        for (let i = 0; i < indexerCount; i++) {
            const indexerNode = node.children[i];
            const indexCount: number = +indexerNode.getAttribute('count');

            if (indexCount !== +indexerNode.children.length) {
                throw Error(`Number of available Indexes (${indexerNode.children.length}) does not match number of expected Indexes (${indexCount})`);
            }

            const indexer = new Indexer(new IndexerName(indexerNode.getAttribute('name')));

            for (let j = 0; j < indexCount; j++) {
                indexer.addIndex(new Index(indexerNode.children[j].innerHTML));
            }

            this.addIndexer(indexer);
        }
    }

    private parseParameterContainer(node: Element, container: ParameterContainer) {
        const name: string = node.getAttribute('name');
        const count: number = +node.getAttribute('count');

        if (count !== +node.children.length) {
            throw Error(`Number of available elements (${node.children.length}) does not match number of expected elements (${count})`);
        }

        const pc = new ParameterContainer(name);

        for (let i = 0; i < count; i++) {
            if (node.children[i].nodeName === 'ParameterGroup') {
                this.parseParameterGroup(node.children[i], pc);
            } else {
                if (node.children[i].nodeName === 'Parameter') {
                    this.parseParameter(node.children[i], pc);
                } else {
                    throw new Error(`ERROR: child ${i} of ParameterContainer :${name}: was a ${node.children[i].nodeName} when it should have been either a Parameter or a ParameterGroup`);
                }
            }
        }

        container.addItem(pc);
    }

    private parseParameterGroup(node: Element, container: ParameterContainer) {
        const name: string = node.getAttribute('name');
        const count: number = +node.getAttribute('count');
        const indexerName: string = node.getAttribute('indexer');

        if (count !== +node.children.length) {
            throw Error(`Number of available elements (${node.children.length}) does not match number of expected elements (${count}) in node: ${name}`);
        }

        const indexer: Indexer = this.findIndexer(indexerName);

        const pg = new ParameterGroup(name, indexer);

        for (let i = 0; i < count; i++) {
            if (node.children[i].nodeName === 'ParameterContainer') {
                this.parseParameterContainer(node.children[i], pg);
            } else {
                throw new Error(`ERROR: child ${i} of ParameterGroup :${name}: was a ${node.children[i].nodeName} when it should have been a ParameterContainer`);
            }
        }

        container.addItem(pg);
    }

    private parseParameter(node: Element, container: ParameterContainer) {
        const name: string = node.getAttribute('name') || node.getAttribute('Name');
        const units: string = node.getAttribute('units');
        const id: string = node.getAttribute('id') || null;

        let defaultValue = null;
        let currentValue = null;
        let minimumValue = null;
        let maximumValue = null;

        for (let i = 0; i < node.children.length; i++) {
            const nodeName = node.children[i].nodeName;
            const nodeValue = node.children[i].innerHTML;

            defaultValue = (nodeName === 'defaultValue') ? nodeValue : defaultValue;
            currentValue = (nodeName === 'currentValue' || nodeName === 'Value') ? nodeValue : currentValue;
            minimumValue = (nodeName === 'minimumValue') ? nodeValue : minimumValue;
            maximumValue = (nodeName === 'maximumValue') ? nodeValue : maximumValue;
        }

        container.addItem(new Parameter(name, currentValue, units, defaultValue, minimumValue, maximumValue, null, +id));
    }

    public fromJson(json: any) {
        this.reference = json.reference;
        this.created = json.when_created;
        this.fileId = json.input_file_id;

        this.defaults = new ParameterDefaults(json.parameters);
        this.fromJsonIndexers(json.indexers);
        this.fromJsonGroups(json.parameter_values);
    }

    private fromJsonIndexers(json: any) {
        this._indexers = [];
        for (let i = 0; i < json.length; i++) {
            const indexer = new Indexer(new IndexerName(json[i].name, +json[i].id));

            const indexes = JSON.parse(json[i].indexes);
            const ids = Object.keys(indexes);

            for (let j = 0; j < ids.length; j++) {
                indexer.addIndex(new Index(indexes[+ids[j]], +ids[j]));
            }
            this._indexers.push(indexer);
        }
    }

    private fromJsonGroups(groups: any) {
        const masterPc = new ParameterContainer('PERSiST');
        for (const group of groups) {
            const indexer = this.findIndexer(Object.keys(group[0])[0]);
            const pg = new ParameterGroup(indexer.name);
            for (const items of group) {
                const keys = Object.keys(items);
                const index = indexer.findIndexById(+items[keys[0]]);

                if (keys.length === 2 && keys[1] === 'parameters') {
                    const pc = new ParameterContainer(index.reference);
                    this.fromJsonParameters(items['parameters'], pc);
                    pg.addItem(pc);
                }
            }
            masterPc.addItem(pg);
        }
        this.addItem(masterPc);
    }

    private fromJsonParameters(json: any, pc: ParameterContainer) {
        json = JSON.parse(json);
        const ids = Object.keys(json);

        for (const id of ids) {
            const parameter = this.defaults.findById(+id);
            parameter.currentValue = json[+id];
            pc.addItem(parameter);
        }
    }
}
