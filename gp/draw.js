//Pass respective arrays with gen numbers as x axis to plot the graph
function printFitnessGraph() {
  var bestEverSoFar = {
  x: genArray,
  y: bestEverSoFarArr,
  name: "bestEverSoFar",
  mode: 'lines+markers',
  type: 'scatter'
};

var currentBestInThisGen = {
  x: genArray,
  y: currentBestInThisGenArr,
  name: "BestInThisGen",
  mode: 'lines+markers',
  type: 'scatter'
};

var currentAvgInThisGen = {
  x: genArray,
  y: currentAvgInThisGenArr,
  name: "AvgInThisGen",
  mode: 'lines+markers',
  type: 'scatter'
};

var currentWorstInThisGen = {
  x: genArray,
  y: currentWorstInThisGenArr,
  name: "WorstInThisGen",
  mode: 'lines+markers',
  type: 'scatter'
};

var currentTreeDepth = {
  x: genArray,
  y: currentTreeDepthArr,
  name: "AvgTreeDepthInThisGen",
  mode: 'lines+markers',
  type: 'scatter'
};

var data = [bestEverSoFar, currentBestInThisGen, currentAvgInThisGen, currentWorstInThisGen, currentTreeDepth];


Plotly.newPlot('chartcontainer', data);

}

var x1 = 0, x2=0, xleftdelta=0, xrightdelta=0;

//Recursive function to draw tree.
function drawTree(tree, x, y, prevX, prevY) {
//To do invoke from draw method

  textSize(32);
  fill(255);// text color to be white
  noStroke();//no lines to be drawn, just print text
  textAlign(CENTER);//Align text in center for better visual
  text (tree.value, x, y); //print node value in screen x,y position
  stroke(255);//line color to be white
  line(prevX, prevY, x, y); // draw a line from parent to child

  if(tree.left != null) {
    x1 = x1+1;
    delta = 2+x1;//move left node to further right relative to previous one
    xleftdelta = xleftdelta+delta;
    drawTree(tree.left, (x+(-70+xleftdelta)), y+40, x, y);
  }

  if(tree.right!= null) {
    x2 = x2-1;
    delta = 2-x2;//move right node to further left relative to previous one
    xrightdelta = xrightdelta+delta;
    drawTree(tree.right, (x+(70+xrightdelta)), y+40, x, y);
  }

  }