/*

main.js Entry point of the app (MVC Controler class).

Copyright 2012 Antoine LUCAS

*/

var ID_SOURCE_PIET = 'sourcePietContainer';

var ID_BUTTON_ADD_ROW = 'buttonAddRow';
var ID_BUTTON_ADD_COLUMN = 'buttonAddColumn';
var ID_BUTTON_DELETE_ROW = 'buttonDeleteRow';
var ID_BUTTON_DELETE_COLUMN = 'buttonDeleteColumn';

var ID_BUTTON_COLOR_WHITE = 'colorWhite';
var ID_BUTTON_COLOR_BLACK = 'colorBlack';
var ID_BUTTON_COLOR_RED = 'colorRed';
var ID_BUTTON_COLOR_YELLOW = 'colorYellow';
var ID_BUTTON_COLOR_GREEN = 'colorGreen';
var ID_BUTTON_COLOR_CYAN = 'colorCyan';
var ID_BUTTON_COLOR_BLUE = 'colorBlue';
var ID_BUTTON_COLOR_MAGENTA = 'colorMagenta';
var ID_BUTTON_COLOR_LIGHT_RED = 'colorLightRed';
var ID_BUTTON_COLOR_LIGHT_YELLOW = 'colorLightYellow';
var ID_BUTTON_COLOR_LIGHT_GREEN = 'colorLightGreen';
var ID_BUTTON_COLOR_LIGHT_CYAN = 'colorLightCyan';
var ID_BUTTON_COLOR_LIGHT_BLUE = 'colorLightBlue';
var ID_BUTTON_COLOR_LIGHT_MAGENTA = 'colorLightMagenta';
var ID_BUTTON_COLOR_DARK_RED = 'colorDarkRed';
var ID_BUTTON_COLOR_DARK_YELLOW = 'colorDarkYellow';
var ID_BUTTON_COLOR_DARK_GREEN = 'colorDarkGreen';
var ID_BUTTON_COLOR_DARK_CYAN = 'colorDarkCyan';
var ID_BUTTON_COLOR_DARK_BLUE = 'colorDarkBlue';
var ID_BUTTON_COLOR_DARK_MAGENTA = 'colorDarkMagenta';

var ID_COLOR_SELECTED = "colorSelected";

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
    DELETE_COLUMN : 5,
    CHANGE_COLOR : 6
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

        var colorsC = [COLOR.WHITE, COLOR.BLACK, COLOR.RED, COLOR.GREEN, COLOR.BLUE, COLOR.CYAN, COLOR.MAGENTA, COLOR.YELLOW, COLOR.DARK_RED, COLOR.DARK_GREEN, COLOR.DARK_BLUE, COLOR.DARK_CYAN, COLOR.DARK_MAGENTA, COLOR.DARK_YELLOW, COLOR.LIGHT_RED, COLOR.LIGHT_GREEN, COLOR.LIGHT_BLUE, COLOR.LIGHT_CYAN, COLOR.LIGHT_MAGENTA, COLOR.LIGHT_YELLOW];
        var colorsE = [ID_BUTTON_COLOR_WHITE, ID_BUTTON_COLOR_BLACK, ID_BUTTON_COLOR_RED, ID_BUTTON_COLOR_GREEN, ID_BUTTON_COLOR_BLUE, ID_BUTTON_COLOR_CYAN, ID_BUTTON_COLOR_MAGENTA, ID_BUTTON_COLOR_YELLOW, ID_BUTTON_COLOR_DARK_RED, ID_BUTTON_COLOR_DARK_GREEN, ID_BUTTON_COLOR_DARK_BLUE, ID_BUTTON_COLOR_DARK_CYAN, ID_BUTTON_COLOR_DARK_MAGENTA, ID_BUTTON_COLOR_DARK_YELLOW, ID_BUTTON_COLOR_LIGHT_RED, ID_BUTTON_COLOR_LIGHT_GREEN, ID_BUTTON_COLOR_LIGHT_BLUE, ID_BUTTON_COLOR_LIGHT_CYAN, ID_BUTTON_COLOR_LIGHT_MAGENTA, ID_BUTTON_COLOR_LIGHT_YELLOW];
        for (var i = colorsE.length - 1; i >= 0; i--) {
            $(colorsE[i]).addEvent('click', this._pietSourceClosure(this._selectColorClickCallback, this._pietSource, colorsC[i]));
        };


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

    _cellClickCallback: function(event, pietSource)
    {
        event.stop();

        console.log("x: " + this.x + " / y: " + this.y);

        pietSource.drawCell(this.y, this.x);
    },

    _addRowClickCallback: function(event, pietSource) {
        event.stop();
        
        pietSource.addRow(POSITION.BOTTOM, DEFAULT_COLOR);
    },

    _addColumnClickCallback: function(event, pietSource) {
        event.stop();

        pietSource.addColumn(POSITION.RIGHT, DEFAULT_COLOR);
    },

    _deleteRowClickCallback: function(event, pietSource) {
        event.stop();

        pietSource.deleteRow(POSITION.BOTTOM);
    },

    _deleteColumnClickCallback: function(event, pietSource) {
        event.stop();

        pietSource.deleteColumn(POSITION.RIGHT);
    },

    _selectColorClickCallback: function(event, pietSource, color) {
        event.stop();

        pietSource.setColor(color);
    },

    _pietSourceClosure: function(fn) {
        // get arguments[1:]
        // we can't call "slice" directly because "arguments" is typed as an Object
        var args = [].slice.call(arguments, 1, arguments.length + 1);

        return function (event) {
            fn.apply(this, [event].concat(args));
        };
    },
})

// ---------------------------------------------

var pietSource = new PietSource();
var displayTable = new DisplayTable(pietSource, ID_SOURCE_PIET);
var displayMenu = new DisplayMenu(pietSource, ID_COLOR_SELECTED);
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