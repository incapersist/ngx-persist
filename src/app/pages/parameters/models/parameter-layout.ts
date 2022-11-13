import { ParameterSet, ParameterGroup, ParameterContainer, ParameterItem, Parameter, IterateParameterItem, IParameter } from './parameter-set';

export class ParameterDialogTable extends ParameterItem implements IterateParameterItem {
    _contents: Parameter[][];
    _columnTitles: string[];
    _rowTitles: string[];

    constructor(container: ParameterContainer, indexedGroup: any) {
        super(container.name);

        this._contents = [];
        this._columnTitles = [];
        this._rowTitles = [];

        this.build(container, indexedGroup);
    }

    *[Symbol.iterator]() {
        for (const row of this._contents) {
            for (const cell of row) {
                yield cell;
            }
        }
    }

    updateAll(fromParameter: IParameter) {
        this._contents.forEach(x => x.forEach(parameter => parameter.updateAll(fromParameter)));
    }

    build(container: ParameterContainer, layout: any) {
        if (!layout.IndexedGroup) {
            throw Error(`ERROR! Expected an IndexedGroup`);
        }

        if (!layout._attributes['type']) {
            throw Error(`ERROR! Expected a type attribute of \'TableRow\' or \'TableColumn\'`);
        }

        switch (layout._attributes['type']) {
            case 'TableRow' :   this.rowsFirst(container, layout); break;
            case 'TableColumn': this.columnsFirst(container, layout); break;
        }
    }

    rowsFirst(container: ParameterContainer, layout: any) {
        const rows = container.findParameterItem(layout._attributes['name']);

        if (rows && rows instanceof ParameterGroup) {
            for (const row of rows) {
                if (row && row instanceof ParameterContainer) {
                    this._rowTitles.push(row.name);
                    const tableRow: Parameter[] = [];
                    const cols = row.findParameterItem(layout.IndexedGroup._attributes['name']);
                    if (cols && cols instanceof ParameterGroup) {
                        for (const col of cols) {
                            if (col && col instanceof ParameterContainer) {
                                this._columnTitles.push(col.name);
                                tableRow.push(<Parameter>col.first);
                            } else {
                                throw Error(`ERROR! Expected a ParameterContainer`);
                            }
                        }
                    } else {
                        throw Error(`ERROR! Could not find ParameterGroup: ${layout.IndexedGroup._attributes['name']}`);
                    }
                    this._contents.push(tableRow);
                } else {
                    throw Error(`ERROR! Expected a ParameterContainer`);
                }
            }
        } else {
            throw Error(`ERROR! Could not find ParameterGroup: ${layout._attributes['name']}`);
        }
    }

    columnsFirst(container: ParameterContainer, layout: any) {
        throw Error(`*** COLUMNS FIRST HAS NOT BEEN IMPLEMENTED! ***`);
    }
}

export class ParameterDialogPageContents extends ParameterItem implements IterateParameterItem {
    public _contents: ParameterItem[];

    constructor(name: string, private _isBoxed: boolean = false, private _title: string = null, private _isExpansion: boolean = false) {
        super(name);
        this._contents = [];
    }

    *[Symbol.iterator]() {
        for (const index of this._contents) {
            yield index;
        }
    }

    get length(): number { return this._contents.length; }
    get first(): ParameterItem { return this._contents.length ? this._contents[0] : null; }
    get isBoxed(): boolean { return this._isBoxed; }
    get title(): string { return this._title; }
    get isExpansion(): boolean { return this._isExpansion; }

    updateAll(fromParameter: IParameter) {
        this._contents.forEach(page => page.updateAll(fromParameter));
    }

    // https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
    isIterable(obj: any) {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    addDisplayItem(container: ParameterContainer, displayItem: any) {
        if (this.isIterable(displayItem)) {
            for (const item of displayItem) {
                this.addParameter(container, item);
            }
        } else {
            this.addParameter(container, displayItem);
        }
    }

    addParameter(container: ParameterContainer, item: any) {
        const i = container.findParameterItem(item['_text']);
        if (i && i instanceof Parameter) {
            this._contents.push(<Parameter>i);
        } else {
            throw Error(`ERROR! Could not find parameter: ${item['_text']}`);
        }
    }
}

export class ParameterDialogPage extends ParameterDialogPageContents {

    constructor(name: string, container: ParameterContainer, layout: any) {
        super(name);
        this.build(container, layout);
    }

    build(container: ParameterContainer, layout: any) {
        // TODO:
        // layout.DisplayItem.length + count of layout.IndexedGroup
        // should match container._items.length

        const type = layout._attributes['type'] || null;

        // https://dmitripavlutin.com/how-to-iterate-easily-over-object-properties-in-javascript/
        for (const [key, value] of Object.entries(layout)) {
            switch (key) {
                case 'DisplayItem' :        this.addDisplayItem(container, value);
                                            break;
                case 'IndexedGroup':        const p = this.addIndexedGroup(container, value, type);
                                            this._contents.push(p);
                                            break;
                case 'DisplayGroup':        this.addDisplayGroup(container, value);
                                            break;
                case 'DisplayBox':          this.addDisplayBox(container, value);
                                            break;
                case 'DisplayExpansion':    this.addDisplayExpansion(container, value);
                                            break;
            }
        }
    }

    updateAll(fromParameter: IParameter) {
        this._contents.forEach(page => page.updateAll(fromParameter));
    }

    addIndexedGroup(container: ParameterContainer, layout: any, type: string = null): ParameterDialog {
        type = layout._attributes['type'] || type;
        const pg = container.findParameterItem(layout._attributes['name']);
        if (pg && pg instanceof ParameterGroup) {
            const p = new ParameterDialog(pg.name, type);
            p.build(pg, layout);
            return p;
        } else {
            throw Error(`ERROR! Could not find ParameterGroup: ${layout._attributes['name']}`);
        }
    }

    addDisplayGroup(container: ParameterContainer, displayGroup: any) {
        const keys = Object.keys(displayGroup);

        if (keys[1] == 'IndexedGroup') {
            const type = displayGroup._attributes['type'] || null;
            if (type == 'Table') {
                const t = new ParameterDialogTable(container, displayGroup.IndexedGroup);
                this._contents.push(t);
            } else {
                const p = this.addIndexedGroup(container, displayGroup.IndexedGroup);
                this._contents.push(p);
            }
        } else {
            this.addDisplayPage(container, displayGroup);
        }
    }

    addDisplayPage(container: ParameterContainer, displayGroup: any) {
        const dialog = new ParameterDialog(container.name);

        if (this.isIterable(displayGroup.DisplayPage)) {
            for (const page of displayGroup.DisplayPage) {
                const p = new ParameterDialogPage(page._attributes['title'], container, page);
                dialog.addPage(p);
            }
        } else {
            const p = new ParameterDialogPage(displayGroup.DisplayPage._attributes['title'], container, displayGroup.DisplayPage);
            dialog.addPage(p);
        }
        this._contents.push(dialog);
    }

    addDisplayBox(container: ParameterContainer, displayBox: any) {
        if (this.isIterable(displayBox)) {
            for (const item of displayBox) {
                this.addDisplayBox(container, item);
            }
        } else {
            const title: string = displayBox._attributes.title || null;
            const box = new ParameterDialogPageContents(displayBox._attributes['title'], true, title);
            box.addDisplayItem(container, displayBox.DisplayItem);
            this._contents.push(box);
        }
    }

    addDisplayExpansion(container: ParameterContainer, displayExpansion: any) {
        if (this.isIterable(displayExpansion)) {
            for (const item of displayExpansion) {
                this.addDisplayBox(container, item);
            }
        } else {
            const title: string = displayExpansion._attributes.title || null;
            const box = new ParameterDialogPageContents(displayExpansion._attributes['title'], false, title, true);
            box.addDisplayItem(container, displayExpansion.DisplayItem);
            this._contents.push(box);
        }
    }
}

interface IterateParameterDialog {
  [Symbol.iterator](): IterableIterator<ParameterDialogPage>;
}

export class ParameterDialog extends ParameterItem implements IterateParameterDialog {
    private _pages: ParameterDialogPage[];
    private _title: string = null;

    constructor(name: string, private _type: string = 'Tabbed', private _isLinkedEditAllowed: boolean = true) {
        super(name);
        this._pages = [];
    }

    *[Symbol.iterator]() {
        for (const index of this._pages) {
            yield index;
        }
    }

    get length(): number { return this._pages.length; }
    get type(): string { return this._type; }
    get first(): ParameterDialogPage { return this._pages.length ? this._pages[0] : null; }
    get title(): string { return this._title ? this._title : this.name; }
    get isLinkedEditAllowed(): boolean { return this._isLinkedEditAllowed; }

    updateAll(fromParameter: IParameter) {
        this._pages.forEach(page => page.updateAll(fromParameter));
    }

    build(group: ParameterGroup, layout: any) {
        this._title = layout._attributes['title'] || null;
        const indexer = group.indexer;
        if (indexer) {
            if (group.name === this.name) {
                for (const index of indexer) {
                    const pc = group.findParameterItem(index.reference);
                    if (pc) {
                        const page = new ParameterDialogPage(pc.name, <ParameterContainer>pc, layout);
                        this.addPage(page);
                    } else {
                        throw Error(`ERROR! Didn\'t find a matching ParameterContainer with index: ${JSON.stringify(index)}`);
                    }
                }
            } else {
                throw Error(`ERROR! Didn\'t find a matching indexer`);
            }
        } else {
            // Only a single page
            const pc = group.findParameterItem(group.name);
            const page = new ParameterDialogPage(pc.name, <ParameterContainer>pc, layout);
            this.addPage(page);
        }
    }

    addPage(page: ParameterDialogPage) {
        this._pages.push(page);
    }
}

interface IterateParameterLayout {
  [Symbol.iterator](): IterableIterator<ParameterDialog>;
}

export class ParameterLayout implements IterateParameterLayout {
    private _dialogs: ParameterDialog[];

    constructor(parameterSet: ParameterSet, layout: any) {
        this._dialogs = [];
        this.buildDialogs(parameterSet, layout);
    }

    *[Symbol.iterator]() {
        for (const index of this._dialogs) {
            yield index;
        }
    }

    get length(): number { return this._dialogs.length; }

    get(index: number) {
        if (!this._dialogs || index >= this._dialogs.length) { return null; }
        return this._dialogs[index];
    }

    updateAll(fromParameter: IParameter) {
        this._dialogs.forEach(dialog => dialog.updateAll(fromParameter));
    }

    buildDialogs(parameterSet: ParameterSet, layout: any) {
        for (const layoutGroup of layout) {
            const parameterGroup = parameterSet.findParameterGroup(layoutGroup._attributes['name']);
            if (parameterGroup) {
                const type = layoutGroup._attributes['type'] || null;
                const isLinkedEditAllowed = !(layoutGroup._attributes['linkedEdit'] === 'false');
                const d = new ParameterDialog(layoutGroup._attributes['name'], type, isLinkedEditAllowed);
                d.build(parameterGroup, layoutGroup);
                if (d) {
                    this._dialogs.push(d);
                }
            }
        }
    }
}
