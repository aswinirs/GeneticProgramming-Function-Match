var terminal_set = ["x", "y", 1, 2, 3, 4, 5], funct_set = ["+", "-", "*", "/"];
var population = [], popSize =0, mutationRate=0, crossOverRate=0, generation = 0;
var arr_x = []; var arr_y = [], observed_val = [], predicted_val = [];
var random_tournament = [], generation =0, tournamentSize = 5, depth = 5, started;
var tourn_fitness = [], tournament = [], tourn_treeDepth = [], sorted_tournFitness = [], sorted_tourn =[], genArray = [];
var bestEverSoFarArr = [], currentBestInThisGenArr = [], currentAvgInThisGenArr = [], currentWorstInThisGenArr =[], currentTreeDepthArr = [];
var bestEver = Infinity, bestEverTree, maxGen = 10000, popSize = 100;

function loadTrainingSample() {
  var filename = document.getElementById("trainingSample").value;
  loadStrings(filename, fileloaded);
  fileUploadMsg = "Training Sample Uploaded !!";
}

function fileloaded(data) {
  for(var i=0;i<data.length;i++) {
    var line = data[i];
    var stringSplit = splitTokens(line);
    arr_x[i] = stringSplit[0];arr_y[i] = stringSplit[1];observed_val[i] = stringSplit[2];
  }
}

function node (val) {
    this.value = val;
    this.left = null;
    this.right = null;
}

function node (val, left, right) {
    this.value = val;
    this.left = left;
    this.right = right;
}

function full_tree(depth) {
  if (depth > 1) {
    //   if (random(1) < 0.6) {
    //   var index = floor(random(funct_set.length-1));
    // } else {
        var index = floor(random(funct_set.length));

    return new node(funct_set[index], full_tree(depth-1), full_tree(depth-1));
  } else
      if(random(1)<0.5) {
        var index = floor(random(2));
      } else {
        var index = floor(random(2,terminal_set.length));
      }
    return new node(terminal_set[index]);
}

function grow_tree(depth) {
  if (depth == 5) {
    // if (random(1) < 0.6) {
    //   var index = floor(random(funct_set.length-1));
    // } else {
      var index = floor(random(funct_set.length));

    return new node(funct_set[index], grow_tree(depth-1), grow_tree(depth-1));

  } else if (depth > 1 && random(1) < 0.5) {
    // if (random(1) < 0.6) {
    //   var index = floor(random(funct_set.length-1));
    // } else {
      var index = floor(random(funct_set.length));

    return new node(funct_set[index], grow_tree(depth-1), grow_tree(depth-1));

  } else
      if(random(1)<=0.5) {
        var index = floor(random(2));
      } else {
        var index = floor(random(2,terminal_set.length));
      }
      return new node(terminal_set[index]);
}

/*preload() is a key method that gets invoked once before actual
beginning of program, so we load our data file beforehand in this method*/
function preload() {
  loadTrainingSample();
}

function start_fn() {
  popSize = document.getElementById("popSizeIn").value;
  mutationRate = document.getElementById("pMutateIn").value;
  crossOverRate = document.getElementById("pCrossOverIn").value;
  started = true;
  setup();
}

function stop_fn() {
  started = false;
}

function Pclear() {
currentBestInThisGenArr = [];
currentAvgInThisGenArr = [];
currentWorstInThisGenArr =[];
started = false;
}

/*setup() is a key method that gets invoked only once at the
beginning of program, so we initialise our population in this method*/
function setup () {

  canvas = createCanvas(1000,600);
  canvas.parent('canvascontainer');

    for (var i = 0;i<popSize/2;i++) {
      full = new full_tree(depth);
      population.push(full);
    }
    for (var i = 50;i<popSize;i++) {
        grow = new grow_tree(depth);
        population.push(grow);
    }
    generation = 0;
}

/*Runs at rate of 60 frames per second.*/
function draw() {
  if (started) {
    if (generation < 10000) {
      generation = generation + 1;
     // console.log(generation);
      tournFitnessEval();
      nextGeneration();
     if (generation % 100 == 0) {
        // Generate XL with best, avg, and worst fitness for every 100 Generation
        //generateXL();
        background(51);
        printFitnessGraph();
        }
      // Draw tree when Max gen is Reached.
      if(generation == 500) {
        //traverseTree(bestEverTree, canvas.width/2, 60);
      }
    }
  }

}
var x1 = 0, x2=0, xleftdelta=0, xrightdelta=0;
function traverseTree(tree, x, y, prevX, prevY) {
//To do invoke from draw method

  textSize(32);
  fill(255);
  noStroke();
  textAlign(CENTER);
  text (tree.value, x, y);
  stroke(255);
  line(prevX, prevY, x, y);

  if(tree.left != null) {
    x1 = x1+1;
    delta = 2+x1;
    xleftdelta = xleftdelta+delta;
    traverseTree(tree.left, (x+(-70+xleftdelta)), y+40, x, y);
  }

  if(tree.right!= null) {
    x2 = x2+1;
    delta = 2+x2;
    xrightdelta = xrightdelta+delta;
    traverseTree(tree.right, (x+(70+xrightdelta)), y+40, x, y);
  }

  }

function tournFitnessEval() {
  var i = 0, treeFitness =0, treefitness_NaN = NaN, treedepth = 0;
  tourn_fitness = [], tournament = [], tourn_treeDepth = [];

  /*random_tournament, remembers which members of population we picked for tournament
  and after sorted tournament is infused in the place of older tournamnet, it has to
  be cleared off for fresh batch*/
  random_tournament = [];
  while (i < tournamentSize) {
    var rand = floor(random(population.length));
    random_tournament.push(rand);
    tournament.push(population[rand]);
    treeFitness = calculateTreeFitness(population[rand]);
    treedepth = treeDepth(population[rand]);
    if(isNaN(treeFitness)) {
      treeFitness = i+10000;
    } else {
       treeFitness = treeFitness;
    }
    tourn_fitness.push(treeFitness);
    tourn_treeDepth.push(treedepth); i++;
    if (treeFitness < bestEver) {
      bestEver = treeFitness;
      bestEverTree = population[rand];
      console.log("Gen Num::" + generation);
      console.log("Tourn ID::" + i);
      console.log(bestEverTree);
      console.log("***************");
      document.getElementById("tournID").innerHTML = i;
      document.getElementById("fittestGens").innerHTML = generation;
      document.getElementById("bestEver").innerHTML = bestEver;
    }
  }
    //Push best, average and worst fitness (every 100 generations only) in array
  if (generation % 100 == 0) {

    var currentBestInThisGen = min(tourn_fitness);
    var currentWorstInThisGen = max(tourn_fitness);
    var currentAvgInThisGen = average(tourn_fitness);
    var avgTreeDEpth = average(tourn_treeDepth);

    document.getElementById("genNumber").innerHTML = generation;
    document.getElementById("currentBestInThisGen").innerHTML = currentBestInThisGen;
    document.getElementById("currentWorstInThisGen").innerHTML = currentWorstInThisGen;
    document.getElementById("currentAvgInThisGen").innerHTML = currentAvgInThisGen;

    genArray.push(generation);
    bestEverSoFarArr.push(bestEver);
    currentBestInThisGenArr.push(currentBestInThisGen);
    currentAvgInThisGenArr.push(currentAvgInThisGen);
    currentWorstInThisGenArr.push(currentWorstInThisGen);
    currentTreeDepthArr.push(avgTreeDEpth);
    }
  }

//Recursive function to calculate tree depth
function treeDepth (tree) {
  if(tree == null) {
    return 0;
  }
  return 1+max(treeDepth(tree.left), treeDepth(tree.right));
}

// Utility fucntion for calculating and returning average of an array
function average(tempArray) {
  var sum_array =0;
  for(var i=0;i<tempArray.length;i++) {
    sum_array = tempArray[i] + sum_array;
  }
  return (sum_array/tempArray.length);
}

//Function to return fitess of a tree
function calculateTreeFitness(tree) {
  var errorDiff = 0; var fitness =0;

  for (var i =0; i<observed_val.length;i++) {
    predicted_val[i] = resolve_treeExpn(tree, arr_x[i],arr_y[i]);
  }
  for (var i=0;i<observed_val.length;i++) {
    var temp = pow((observed_val[i] - predicted_val[i]), 2);
    errorDiff = errorDiff + temp;
  }
  // console.log(observed_val); console.log(predicted_val); console.log(errorDiff, tree);
  fitness = sqrt(Math.abs(errorDiff)/observed_val.length);

  return fitness;
}

//Steady state next generation logic, least fit(2) memembers of previous gen tournament will be replaced
function nextGeneration() {
  var children = [];

  if(random(1) <= crossOverRate) {
  children = crossOver(pickParents(tourn_fitness,tournament));
  }

  if(random(1) < mutationRate) {
  children = mutation(children);
  }

  if(children.length != 0) {
  sorted_tourn[3] = children[0];
  sorted_tourn[4] = children[1];
  }

  //Replace the tournamnet that is formed earlier with new tournament trees
  for(var i =0;i<random_tournament.length;i++) {
    population[random_tournament[i]] = sorted_tourn[i];
  }
}


function pickParents(tourn_fitness, tournament) {
  sorted_tourn = [], sorted_tournFitness = [], parents = [], sortedIndex = [];
  sorted_tournFitness = sort(tourn_fitness, tourn_fitness.length);
    for(var i=0;i<sorted_tournFitness.length;i++) {
      sortedIndex.push(tourn_fitness.indexOf(sorted_tournFitness[i]));
    }
    //sorted_tourn contains trees those are arranged in fitness based order
    for(var i=0;i<sortedIndex.length;i++) {
      sorted_tourn[i] = tournament[sortedIndex[i]];
    }
    //Choose Best parents from tournament for parent array
    var parent1Index = tourn_fitness.indexOf(sorted_tournFitness[0]);
    var parent2Index = tourn_fitness.indexOf(sorted_tournFitness[1]);
    parents.push(tournament[parent1Index]);
    parents.push(tournament[parent2Index]);
    return parents;
}



function crossOver(parents) {
  var children =[];
  var mom = parents[0];
  var dad = parents[1];
  var child1 = mom;
  var child2 = dad;
  if(random(1) < 0.5) {

    if(dad.left != null && terminal_set.indexOf(dad.left.value) != -1 && child1.left != null && terminal_set.indexOf(child1.left.value) != -1) {
      child1.left = dad.left;
    } else if (dad.right != null && terminal_set.indexOf(dad.right.value) != -1) {//&& child1.right != null && terminal_set.indexOf(child1.right.value) != -1) {
      child1.right = dad.right;
    }
    var child2 = dad;
    if(mom.left != null && terminal_set.indexOf(mom.left.value) != -1 && child2.left != null && terminal_set.indexOf(child2.left.value) != -1) {
      child2.left = mom.left;
    } else if (mom.right != null && terminal_set.indexOf(mom.right.value) != -1 && child2.right != null && terminal_set.indexOf(child2.right.value) != -1) {
      child2.right = mom.right;
    }
   } else {
    if(dad.right != null && terminal_set.indexOf(dad.right.value) != -1 && child1.left != null && terminal_set.indexOf(child1.left.value) != -1) {
      child1.left = dad.right;
    } else if (dad.left != null && terminal_set.indexOf(dad.left.value) != -1 && child1.right != null && terminal_set.indexOf(child1.right.value) != -1) {
      child1.right = dad.left;
    }

    if(mom.right != null && terminal_set.indexOf(mom.right.value) != -1 && child2.left != null && terminal_set.indexOf(child2.left.value) != -1) {
      child2.left = mom.right;
    } else if (mom.left != null && terminal_set.indexOf(mom.left.value) != -1 && child2.right != null && terminal_set.indexOf(child2.right.value) != -1) {
      child2.right= mom.left;
    }

  }

  children.push(child1, child2);
  return children;
  }

  function mutation (children) {
    for (var i =0;i<children.length;i++) {
        var tree = grow_tree(depth);
        if(children[i].left != null && terminal_set.indexOf(children[i].left.value) != -1) { /*&&
         tree != null && terminal_set.indexOf(tree.value) != -1) { */
        children[i].left = tree;
        } else if (children[i].right != null && terminal_set.indexOf(children[i].right.value) != -1) { /*&&
         tree != null && terminal_set.indexOf(tree.value) != -1) {*/
        children[i].right = tree;
        }
    }
    return children;
  }


function resolve_treeExpn(tree, inp_x, inp_y)  {
  if (terminal_set.indexOf(tree.value) != -1) {
    if (tree.value == "x")  {
      return parseInt(inp_x);
    } else if(tree.value == "y") {
      return parseInt(inp_y);
    } else {
      return parseInt(tree.value);
    }
  }
  else {
    var index = funct_set.indexOf(tree.value);
    if (index == 0) {
      if (tree.left != null && tree.right != null)
        return resolve_treeExpn(tree.left, inp_x, inp_y) + resolve_treeExpn(tree.right, inp_x, inp_y);
      else return NaN;
    }
    else if (index == 1) {
      if (tree.left != null && tree.right != null)
        return resolve_treeExpn(tree.left, inp_x, inp_y) - resolve_treeExpn(tree.right, inp_x, inp_y);
      else return NaN;
    }
    else if (index == 2) {
      if (tree.left != null && tree.right != null)
        return resolve_treeExpn(tree.left, inp_x, inp_y) * resolve_treeExpn(tree.right, inp_x, inp_y);
      else return NaN;
    }
    else (index == 3)
      if (tree.left != null && tree.right != null)
        return resolve_treeExpn(tree.left, inp_x, inp_y) / resolve_treeExpn(tree.right, inp_x, inp_y);
      else return NaN;
    }
}




function generateXL() {
  var chart = [['Generation','currentBestInThisGen', 'currentAvgInThisGen', 'currentWorstInThisGen', 'currentAvgTreeDEpth', 'bestEverSoFarArr']];

  for(var i=0; i<genArray.length; i++) {
      chart.push([genArray[i], currentBestInThisGenArr[i], currentAvgInThisGenArr[i], currentWorstInThisGenArr[i], currentTreeDepthArr[i], bestEverSoFarArr[i]]);
  }

  var csvRows = [];

  for(var i=0;i<chart.length; i++) {
      csvRows.push(chart[i].join(','));
  }

  var csvString = csvRows.join("%0A");
  var a         = document.createElement('a');
  a.href        = 'data:attachment/csv,' + csvString;
  a.target      = '_blank';
  a.download    = 'gpGenerationResult.csv';

  document.body.appendChild(a);
  a.click();
}