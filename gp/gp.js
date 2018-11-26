var terminal_set = ["x", "y", 1, 2, 3, 4, 5], funct_set = ["+", "-", "*", "/"];
var population = [], popSize =0, mutationRate=0, crossOverRate=0, generation = 0;
var arr_x = []; var arr_y = [], observed_val = [], predicted_val = [];
var random_tournament = [], generation =0, started;
var tourn_fitness = [], tournament = [], tourn_treeDepth = [], sorted_tournFitness = [], sorted_tourn =[], genArray = [];
var bestEverSoFarArr = [], currentBestInThisGenArr = [], currentAvgInThisGenArr = [], currentWorstInThisGenArr =[], currentTreeDepthArr = [];
var bestEver = Infinity, bestEverTree, maxGen = 10000, popSize = 100, tournamentSize = 6, depth = 5;

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
      if (random(1) < 0.6) {
      var index = floor(random(funct_set.length-1));
    } else {
        var index = floor(random(funct_set.length));
    }
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
    if (random(1) < 0.6) {
      var index = floor(random(funct_set.length-1));
    } else {
      var index = floor(random(funct_set.length));
    }
    return new node(funct_set[index], grow_tree(depth-1), grow_tree(depth-1));

  } else if (depth > 1 && random(1) <= 0.5) {
    if (random(1) < 0.6) {
      var index = floor(random(funct_set.length-1));
    } else {
      var index = floor(random(funct_set.length));
    }
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
  maxGen = document.getElementById("maxGenIn").value;
  tournamentSize =document.getElementById("tournSizeIn").value;
  depth = document.getElementById("treeDepthIn").value;

  started = true;
  setup();
}

function stop_fn() {
  started = false;
}


/*setup() is a key method that gets invoked only once at the
beginning of program, so we initialise our population in this method*/
function setup () {

  canvas = createCanvas(window.innerWidth,600);
  canvas.parent('canvascontainer');

    for (var i = 0;i<popSize/2;i++) {
      var full = new full_tree(depth);
      population.push(full);
    }
    for (var i = 50;i<popSize;i++) {
        var grow = new grow_tree(depth);
        population.push(grow);
    }
    generation = 0;
}

/*Runs at rate of 60 frames per second.*/
function draw() {
  if (started) {
    if (generation < 10000) {
      generation = generation + 1;
      tournFitnessEval();
      nextGeneration();
     if (generation % 100 == 0) {

        background(51);
        //print graph for evry 100 generation
        printFitnessGraph();
        }
      /* Draw tree and generate XL with max, min, avg fitness and avg tree depth
         for evry 100 gen when Max gen is Reached.*/
      if(generation == maxGen) {
        drawTree(bestEverTree, canvas.width/2, 60);
        generateXL();
      }
    }
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
      treeFitness = i+10;
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
    var temp = pow(Math.abs(observed_val[i] - predicted_val[i]), 2);
    errorDiff = errorDiff + temp;
  }
  // console.log(observed_val); console.log(predicted_val); console.log(errorDiff, tree);
  fitness = sqrt(errorDiff/observed_val.length);

  return fitness;
}

//Steady state next generation logic, least fit(2) memembers of previous gen tournament will be replaced
function nextGeneration() {
  var children = [];
  var parents = pickParents(tourn_fitness,tournament);

  if(random(1) <= crossOverRate) {
  children = crossOver(parents);
  }
  if(random(1) < mutationRate) {
  children = mutation(children);
  }
  if(children.length != 0) {
  sorted_tourn[4] = children[0];
  sorted_tourn[5] = children[1];
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

  var mom = parents[0], dad = parents[1], child1, child2, children =[];

  if(random(1)<0.5) {
  child1 = new node(mom.value, mom.left, dad.right);
  child2 = new node(dad.value, mom.left, dad.right);

  } else {
  child1 = new node(mom.value, dad.left, mom.right);
  child2 = new node(dad.value, dad.left, mom.right);
  }
  children.push(child1);
  children.push(child2);
  return children;
  }

  function mutation (children) {
    var child1, child2, mut_children= [];
    var tree = new grow_tree(depth);
    child1 = new node(children[0].value, children[0].left, tree);
    child2 = new node(children[1].value, tree, children[1].right);
    mut_children.push(child1);
    mut_children.push(child2);
    return mut_children;
  }


function resolve_treeExpn(tree, inp_x, inp_y)  {
    if (terminal_set.indexOf(tree.value) != -1) {
      if (tree.value == "x")  {
        return parseFloat(inp_x);
      } else if(tree.value == "y") {
        return parseFloat(inp_y);
      } else {
        return parseFloat(tree.value);
      }
  } else if(funct_set.indexOf(tree.value) != -1) {

    var index = funct_set.indexOf(tree.value);
    if (index == 0) {

        return parseFloat(resolve_treeExpn(tree.left, inp_x, inp_y) + resolve_treeExpn(tree.right, inp_x, inp_y));

    }
    else if (index == 1) {

        return parseFloat(resolve_treeExpn(tree.left, inp_x, inp_y) - resolve_treeExpn(tree.right, inp_x, inp_y));

    }
    else if (index == 2) {

        return parseFloat(resolve_treeExpn(tree.left, inp_x, inp_y) * resolve_treeExpn(tree.right, inp_x, inp_y));

    }
    else (index == 3)

        return parseFloat(resolve_treeExpn(tree.left, inp_x, inp_y) / resolve_treeExpn(tree.right, inp_x, inp_y));

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