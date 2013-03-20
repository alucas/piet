/*

main.js Entry point of the app (MVC Controler class).

Copyright 2012 Antoine LUCAS

*/

var ID_SOURCE_PIET = 'sourcePietContainer';
var ID_BUTTON_ADD_ROW = 'buttonAddRow';
var ID_BUTTON_ADD_COLUMN = 'buttonAddColumn';
var ID_BUTTON_DELETE_ROW = 'buttonDeleteRow';
var ID_BUTTON_DELETE_COLUMN = 'buttonDeleteColumn';

var POSITION = {
    TOP: 0,
    BOTTOM: 1,
    LEFT: 2,
    RIGHT: 3
};

var COLOR = {
    WHITE : new Color("#ffffff"),
    BLACK : new Color("#000000"),

    RED : new Color("#FF0000"),
    YELLOW : new Color("#FFFF00"),
    GREEN : new Color("#00FF00"),
    CYAN : new Color("#00FFFF"),
    BLUE : new Color("#0000FF"),
    MAGENTA : new Color("#FF00FF"),

    LIGHT_RED : new Color("#FFC0C0"),
    LIGHT_YELLOW : new Color("#FFFFC0"),
    LIGHT_GREEN : new Color("#C0FFC0"),
    LIGHT_CYAN : new Color("#C0FFFF"),
    LIGHT_BLUE : new Color("#C0C0FF"),
    LIGHT_MAGENTA : new Color("#FFC0FF"),

    DARK_RED : new Color("#C00000"),
    DARK_YELLOW : new Color("#C0C000"),
    DARK_GREEN : new Color("#00C000"),
    DARK_CYAN : new Color("#00C0C0"),
    DARK_BLUE : new Color("#0000C0"),
    DARK_MAGENTA : new Color("#C000C0")
};

var SIGNAL = {
    UPDATE_TABLE : 0,
    UPDATE_CELL : 1,
    ADD_ROW : 2,
    DELETE_ROW : 3,
    ADD_COLUMN : 4,
    DELETE_COLUMN : 5
};

var DEFAULT_COLOR = COLOR.WHITE;
var DEFAULT_PIETSOURCE_WIDTH = 20;
var DEFAULT_PIETSOURCE_HEIGHT = 10;

// ---------------------------------------------

var Controler = new Class({
    Implements: Observer,

    initialize: function(pietSource, displayTable) {
        this._pietSource = pietSource;
        this._displayTable = displayTable;

        $(ID_BUTTON_ADD_ROW).addEvent('click', this._pietSourceClosure(this._addRowClickCallback, this._pietSource));
        $(ID_BUTTON_ADD_COLUMN).addEvent('click', this._pietSourceClosure(this._addColumnClickCallback, this._pietSource));
        $(ID_BUTTON_DELETE_ROW).addEvent('click', this._pietSourceClosure(this._deleteRowClickCallback, this._pietSource));
        $(ID_BUTTON_DELETE_COLUMN).addEvent('click', this._pietSourceClosure(this._deleteColumnClickCallback, this._pietSource));

        this._displayTable.addObserver(this); // Init new cells' events
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

        switch (signalType)
        {
            case SIGNAL.UPDATE_TABLE:
                this._addEventCells($(document.body).getElements('.cell'));

                return;
            case SIGNAL.ADD_ROW:
            case SIGNAL.ADD_COLUMN:
                this._addEventCells(args[0]);

                return;
        }
    },

    //******************************//
    //          Private             //
    //******************************//

    _addEventCells: function(cells)
    {
        cells.addEvent('click', this._pietSourceClosure(this._cellClickCallback, this._pietSource));
    },

    _cellClickCallback: function(pietSource, event)
    {
        event.stop();

        console.log("x: " + this.x + " / y: " + this.y);

        var colors = [COLOR.BLACK, COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.CYAN, COLOR.MAGENTA, COLOR.YELLOW, COLOR.DARK_RED, COLOR.DARK_GREEN, COLOR.DARK_BLUE, COLOR.DARK_CYAN, COLOR.DARK_MAGENTA, COLOR.DARK_YELLOW, COLOR.LIGHT_RED, COLOR.LIGHT_GREEN, COLOR.LIGHT_BLUE, COLOR.LIGHT_CYAN, COLOR.LIGHT_MAGENTA, COLOR.LIGHT_YELLOW];
        pietSource.setColor(this.y, this.x, colors[Number.random(0, colors.length - 1)]);
    },

    _addRowClickCallback: function(pietSource, event) {
        event.stop();
        
        pietSource.addRow(POSITION.BOTTOM, COLOR.LIGHT_BLUE);
    },

    _addColumnClickCallback: function(pietSource, event) {
        event.stop();

        pietSource.addColumn(POSITION.RIGHT, COLOR.BLUE);
    },

    _deleteRowClickCallback: function(pietSource, event) {
        event.stop();

        pietSource.deleteRow(POSITION.BOTTOM);
    },

    _deleteColumnClickCallback: function(pietSource, event) {
        event.stop();

        pietSource.deleteColumn(POSITION.RIGHT);
    },

    _pietSourceClosure: function(fn, pietSource) {
        return function () {
            [].unshift.call(arguments, pietSource);

            fn.apply(this, arguments);
        };
    },
})

// ---------------------------------------------

var pietSource = new PietSource();
var displayTable = new DisplayTable(pietSource, ID_SOURCE_PIET);
var controler = new Controler(pietSource, displayTable);

pietSource.init(DEFAULT_PIETSOURCE_HEIGHT, DEFAULT_PIETSOURCE_WIDTH, DEFAULT_COLOR);

/*
var start = new Date().getTime();

for (i = 0; i < 100; ++i) {
    pietSource.addColumn(POSITION.RIGHT, COLOR.LIGHT_MAGENTA);
    pietSource.addRow(POSITION.BOTTOM, COLOR.LIGHT_GREEN);
}

var end = new Date().getTime();
var time = end - start;
alert('Execution time: ' + time);
// */