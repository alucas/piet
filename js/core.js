/*

main.js App kernel classes.

Copyright 2012 Antoine LUCAS

*/

var Observable = new Class({
	initialize: function()
    {
		this._observers = new Array();
	},

	addObserver: function(observer)
    {
		this._observers.push(observer);
	},

	notifyAll: function(signalType, args)
    {
		Array.each(this._observers, function(observer)
            {
    			observer.update(signalType, args);
    		}
    	);
	}
});

var Observer = new Class({
    update: function(signalType, args)
    {
        console.log("This function need to be redefined");
    }
});

var PietSource = new Class({
	Extends: Observable,

    initialize: function()
    {
    	this.parent();

        this._source = new Array();
    },

    //******************************//
    //          Public              //
    //******************************//

    init: function(nbRow, nbColumn, initialColor)
    {
    	this._nbRow = nbRow;
    	this._nbColumn = nbColumn;
        this._color = initialColor;

		for (var i = 0; i < this._nbRow; i++)
        {
			var row = new Array();

			for (var j = 0; j < this._nbColumn; j++)
            {
				row.push(initialColor);
			}

			this._source.push(row);
		}

		this.notifyAll(SIGNAL.UPDATE_TABLE);
        this.notifyAll(SIGNAL.CHANGE_COLOR, [null, this._color]);
    },

    getCellColor: function(row, column)
    {
        if (0 > row || row >= this._nbRow || 0 > column || column >= this._nbColumn)
            return;

        return this._source[row][column];
    },

    drawCell: function(row, column) {
        if (0 > row || row >= this._nbRow || 0 > column || column >= this._nbColumn)
            return;

        this._source[row][column] = this._color;

        this.notifyAll(SIGNAL.UPDATE_CELL, [row, column]);
    },

    setColor: function(color)
    {
        if (!color)
            return;

        var oldColor = this._color;
        this._color = color;

        this.notifyAll(SIGNAL.CHANGE_COLOR, [oldColor, this._color]);
    },

    getNbRow: function()
    {
        return this._nbRow;
    },

    getNbColumn: function()
    {
        return this._nbColumn;
    },

    addRow: function(position, initialColor)
    {
    	var row = new Array()

        for (var j = 0; j < this._nbColumn; j++)
        {
			row.push(initialColor);
		}

    	if (position == POSITION.BOTTOM)
    	{
    		this._source.push(row);
    	}
    	else if (position == POSITION.TOP)
    	{
    		this._source.unshift(row);
    	}
    	else
    	{
    		console.log("Wrond position in PietSource.addRow : " + position);
    		return;
    	}

    	this._nbRow++;

    	this.notifyAll(SIGNAL.ADD_ROW, [position, (position == POSITION.TOP)? 0 : this._nbRow - 1]);
    },

    deleteRow: function(position)
    {
    	if (this._nbRow < 2)
    		return;

    	if (position == POSITION.BOTTOM)
    	{
    		this._source.pop();
    	}
    	else if (position == POSITION.TOP)
    	{
    		this._source.shift();
    	}
    	else
    	{
    		console.log("Wrond position in PietSource.deleteRow : " + position);
    		return;
    	}

    	this._nbRow--;
    	
    	this.notifyAll(SIGNAL.DELETE_ROW, [position]);
    },

    addColumn: function(position, initialColor)
    {
    	if (position == POSITION.LEFT)
    	{
    		for (var i = 0; i < this._nbRow; i++)
            {
				this._source[i].unshift(initialColor);
			}
    	}
    	else if (position == POSITION.RIGHT)
    	{
    		for (var i = 0; i < this._nbRow; i++)
            {
				this._source[i].push(initialColor);
			}
    	}
    	else
    	{
    		console.log("Wrond position in PietSource.addColumn : " + position);
    		return;
    	}

    	this._nbColumn++;

    	this.notifyAll(SIGNAL.ADD_COLUMN, [position, (position == POSITION.LEFT)? 0 : this._nbColumn - 1]);
    },

    deleteColumn: function(position)
    {
    	if (this._nbColumn < 2)
    		return;

    	if (position == POSITION.LEFT)
    	{
    		for (var i = 0; i < this._nbRow; i++)
            {
				this._source[i].shift();
			}
    	}
    	else if (position == POSITION.RIGHT)
    	{
    		for (var i = 0; i < this._nbRow; i++)
            {
				this._source[i].pop();
			}
    	}
    	else
    	{
    		console.log("Wrond position in PietSource.deleteColumn : " + position);
    		return;
    	}

    	this._nbColumn--;
    	
    	this.notifyAll(SIGNAL.DELETE_COLUMN, [position]);
    },

    log: function()
    {
  		for (var i = this._source.length - 1; i >= 0; i--)
        {
			console.log(this._source[i]);
		}
	}
});