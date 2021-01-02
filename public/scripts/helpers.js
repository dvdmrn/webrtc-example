
// Could use a 1 liner for this but that would do 2n comparisons where this is n
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}


function mapValues(x, xstart, xend, ystart, yend) {
    // changes the scale of x to the scale of y, and returns y
    return ((x-xstart) / (xend-xstart))*(yend-ystart)+ystart;    
}


function rms(arrData) {
    // arrData := an array of amplitude values
    // gets amplitude data (root mean square method)
    // returns: an float

    return Math.sqrt(
        arrData.reduce((a, b) => a + b ** 2, 0) / arrData.length
    )
}

function arrMean(arrData) {
    return arrData.reduce((a,b)=> a+ b, 0)/arrData.length
}


