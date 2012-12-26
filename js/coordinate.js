/*

Coordinate.js allows you to address HTML table cells by (x,y) coordinates,
and know cell neighbors with north/south/east/west references

http://dren.ch/js-table-coordinates/

Copyright 2009 Daniel Rench

MIT licensed; see the LICENSE file bundled with its distribution at
https://github.com/drench/coordinate.js

*/

function coordinate(table) {

    table.coordinates = [];

    var x, y = -1;
    var row, rn;
    var col, cn;

    for (rn in table.childNodes) {
        row = table.childNodes[rn];
        if (row.tagName && row.tagName.match(/^tr$/i)) {
            x = -1;
            ++y;
            for (cn in row.childNodes) {
                col = row.childNodes[cn];
                if (col.tagName && col.tagName.match(/^t[dh]$/i)) {
                    var colspan = col.getAttribute('colspan');
                    if (! colspan) colspan = 1;
                    while (colspan--) {
                        ++x;
                        if (! table.coordinates[x]) table.coordinates[x] = [];
                        table.coordinates[x][y] = col;
                        col.x = x;
                        col.y = y;
                    }
                }
            }
        }
    }

    for (x=0; row=table.coordinates[x]; ++x) {
        for (y=0; col=table.coordinates[x][y]; ++y) {

            col.north = (y > 0) ?
                table.coordinates[x][y-1] : undefined;

            col.south = (table.coordinates[x][y+1]) ?
                table.coordinates[x][y+1] : undefined;

            col.west = (x > 0) ?
                table.coordinates[x-1][y] : undefined;

            col.east = (table.coordinates[x+1]) ?
                table.coordinates[x+1][y] : undefined;

        }
    }

}