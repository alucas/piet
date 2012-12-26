/*

display.js UI Classes.

Copyright 2012 Antoine LUCAS

*/

var DisplayTable = new Class({
    Extends: Observable,
    Implements: Observer,

    initialize: function(pietSource, tableId) {
        this.parent();

        this._pietSource = pietSource;
        this._tableId = tableId;

        this._pietSource.addObserver(this);
    },

    //******************************//
    //          Public              //
    //******************************//
    
    update: function(signalType, args)
    {
        if (signalType == undefined)
        {
            alert("Wrong signal type!");
        }

        var table = $(this._tableId);
        if (!table)
            return;

        switch (signalType)
        {
            case SIGNAL.UPDATE_TABLE:
                this.updateTable(table);

                break;
            case SIGNAL.UPDATE_CELL:
                this.updateCell(table, args[0], args[1]);

                break;
            case SIGNAL.ADD_ROW:
                this.insertRow(table, args[0], args[1]);

                break;
            case SIGNAL.ADD_COLUMN:
                this.insertColumn(table, args[0], args[1]);

                break;
            case SIGNAL.DELETE_ROW:
                this.deleteRow(table, args[0]);

                break;
            case SIGNAL.DELETE_COLUMN:
                this.deleteColumn(table, args[0]);

                break;
            default:
                console.log("signal inconu");
        }

        // Actualize the coordinates of the cells.
        switch (signalType)
        {
            case SIGNAL.UPDATE_TABLE:
            case SIGNAL.ADD_ROW:
            case SIGNAL.ADD_COLUMN:
            case SIGNAL.DELETE_ROW:
            case SIGNAL.DELETE_COLUMN:
                coordinate(table);
        }
    },

    // Clear and rewrite the table.
    updateTable: function(table) {
        table.empty();

        var table2 = new Element('table');

        for (var i = 0; i < this._pietSource.getNbRow(); i++) {
            this._insertRow(table2, POSITION.BOTTOM, i);
        }
        
        for (var i = 0; i < this._pietSource.getNbColumn(); i++) {
            this._insertColumn(table2, POSITION.LEFT, i);
        }

        table2.getChildren().inject(table);
        
        this.notifyAll(SIGNAL.UPDATE_TABLE);
    },

    updateCell: function(table, row, column) {
        this._getCell(this._getRow(table, row + 1), column + 1).setStyle('background-color', this._pietSource.getColor(row, column));
    },

    insertRow: function(table, position, rowId) {
        var cells = this._insertRow(table, position, rowId);

        this.notifyAll(SIGNAL.ADD_ROW, [cells]);
    },

    insertColumn: function(table, position, columnId) {
        var cells = this._insertColumn(table, position, columnId);

        this.notifyAll(SIGNAL.ADD_COLUMN, [cells]);
    },

    deleteRow: function(table, position) {
        if (this._getNumberRows(table) < 2)
            return;

        if (position == POSITION.TOP)
        {
            this._deleteRowTop(table);
        }
        else if (position == POSITION.BOTTOM)
        {
            this._deleteRowBottom(table);
        }
        else
        {
            console.log("Wrond position in DisplayTable.deleteRow : " + position);
            return;
        }
    },

    deleteColumn: function(table, position) {
        if (this._getNumberCells(table) < 2)
            return;

        var rows = this._getRows(table);
        var nbRow = rows.length;

        if (position == POSITION.LEFT)
        {
            for (var i = 0; i < nbRow; i++) {
                this._deleteCellLeft(rows[i]);
            }
        }
        else if (position == POSITION.RIGHT)
        {
            for (var i = 0; i < nbRow; i++) {
                this._deleteCellRight(rows[i]);
            }
        }
        else
        {
            console.log("Wrond position in DisplayTable.deleteColumn : " + position);
            return;
        }
    },

    //******************************//
    //          Privates            //
    //******************************//

    _insertRow: function(table, position, rowId) {
        var nbCell = this._getNumberCells(table);

        var cells = new Elements();
        for (var i = 0; i < nbCell; i++) {
            cells.push(this._createEmptyCell().setStyle('background-color', this._pietSource.getColor(rowId, i)));
        }

        if (position == POSITION.TOP)
        {
            this._insertEmptyRowTop(table).adopt(cells);
        }
        else if (position == POSITION.BOTTOM)
        {
            this._insertEmptyRowBottom(table).adopt(cells);
        }
        else
        {
            console.log("Wrond position in DisplayTable.insertRow : " + position);
            return;
        }

        return cells;
    },

    _insertColumn: function(table, position, columnId) {
        if (!this._hasRow(table)) return;

        var rows = this._getRows(table);
        var nbRow = rows.length;
        var cells = new Elements();

        if (position == POSITION.LEFT)
        {
            for (var i = 0; i < nbRow; i++) {
                cells.push(this._insertEmptyCellLeft(rows[i]).setStyle('background-color', this._pietSource.getColor(i, columnId)));
            }
        }
        else if (position == POSITION.RIGHT)
        {
            for (var i = 0; i < nbRow; i++) {
                cells.push(this._insertEmptyCellRight(rows[i]).setStyle('background-color', this._pietSource.getColor(i, columnId)));
            }
        }
        else
        {
            console.log("Wrond position in DisplayTable.insertColumn : " + position);
            return;
        }

        return cells;
    },

    _getRows: function(table) {
    	return table.getChildren('.row');
    },

    _getRow: function(table, index) {
        return table.getChildren('.row:nth-child('+index+')')[0];
    },

    _getCells: function(row) {
    	return row.getChildren('.cell');
    },

    _getCell: function(row, index) {
        return row.getChildren('.cell:nth-child('+index+')')[0];
    },

    _getFirstRow: function(table) {
    	return table.getChildren('.row:first-child')[0];
    },

    _getLastRow: function(table) {
    	return table.getChildren('.row:last-child')[0];
    },

    _hasRow: function(table) {
        return table.getChildren('.row').length > 0;
    },

    _getNumberCells: function(table) {
        if (table.getChildren('.row').length <= 0) return 0;

        return table.getChildren('.row:first-child > .cell').length;
    },

    _getNumberRows: function(table) {
        return table.getChildren('.row').length;
    },

    _insertEmptyRowTop: function(table) {
        return new Element('tr.row').inject(table, 'top');
    },

    _insertEmptyRowBottom: function(table) {
        return new Element('tr.row').inject(table, 'bottom');
    },

    _insertEmptyCellLeft: function(row) {
        return new Element('td.cell').inject(row, 'top');
    },

    _insertEmptyCellRight: function(row) {
        return new Element('td.cell').inject(row, 'bottom');
    },

    _createEmptyCell: function() {
        return Element('td.cell');
    },

    _deleteRowTop: function(table) {
        table.getChildren('.row:first-child').dispose();
    },

    _deleteRowBottom: function(table) {
        table.getChildren('.row:last-child').dispose();
    },

    _deleteCellLeft: function(row) {
        row.getChildren('.cell:first-child').dispose();
    },

    _deleteCellRight: function(row) {
        row.getChildren('.cell:last-child').dispose();
    }
});