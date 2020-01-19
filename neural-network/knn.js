global.fetch = require("node-fetch");
const tf = require('@tensorflow/tfjs-node')
//const tfvis = require('@tensorflow/tfjs-vis')
const prompt = require('prompt');
const csvFilePath = 'data.csv';
var fs = require('fs');

var data = fs.readFileSync(csvFilePath)
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array


let seperationSize; // To seperate training and test data

let  X = [], y = [];

let trainingSetX = [], trainingSetY = [], testSetX = [], testSetY = [];
seperationSize = 0.8 * data.length;
// data = shuffleArray(data);

// function shuffleArray(array) {
//     for (var i = array.length - 1; i > 0; i--) {
//         var j = Math.floor(Math.random() * (i + 1));
//         var temp = array[i];
//         array[i] = array[j];
//         array[j] = temp;
//     }
//     return array;
// }
function dressData() {

    data.forEach((row) => {
        let rowArray, typeNumber;
        rowArray = Object.keys(row).map(key => parseFloat(row[key])).slice(0, 6);
        typeNumber = Object.keys(row).map(key => parseFloat(row[key])).slice(6);
        X.push(rowArray);
        if (typeNumber[0] == 5 || typeNumber[0] == 4)
        {
            y.push(2.0);
        }
        else if(typeNumber[0] == 3 || typeNumber[0] == 2)
        {
            y.push(1.0);
        }
        else
        {
            y.push(0.0);
        }
});

    trainingSetX = X.slice(0, seperationSize);
    trainingSetY = y.slice(0, seperationSize);
    testSetX = X.slice(seperationSize+1);
    testSetY = y.slice(seperationSize+1);

}
dressData()
trainingSetX = tf.tensor2d(trainingSetX, [trainingSetX.length, trainingSetX[0].length])
trainingSetY = tf.oneHot(trainingSetY, 3).toInt()
testSetX = tf.tensor2d(testSetX, [testSetX.length, testSetX[0].length])
testSetY = tf.oneHot(testSetY, 3).toInt()
console.log(trainingSetX, trainingSetY, testSetX, testSetY)

function createModel() {
    // Create a sequential model
    const model = tf.sequential();
    const regulizer = tf.regularizers.l2(); 
    const dropoutRate = 0.25
    
    
    model.add(tf.layers.dense({inputShape: [6], activation:'relu', useBias: true, units:50}));
    model.add(tf.layers.dense({units: 200, regulizer, activation:'relu', useBias: true})); 
    //model.add(tf.layers.dropout({rate: dropoutRate}));
    model.add(tf.layers.dense({units: 200, activation:'relu', useBias: true}));   
    model.add(tf.layers.dense({units: 200, activation:'relu', useBias: true})); 
    model.add(tf.layers.dense({units: 3, activation:'softmax'}));
    return model;
}

async function trainModel(inputs, labels) {
    const model = await createModel();  
    model.compile({
        loss: tf.losses.softmaxCrossEntropy, //tf.metrics.categoricalCrossentropy, 
        optimizer: tf.train.adam(0.001), 
        metrics: [tf.metrics.categoricalAccuracy]
        //metrics: ['accuracy']
    });

    model.summary()
    
    const batchSize = 24;
    const epochs = 5;
    
    await model.fit(inputs, labels, {
      batchSize,
      epochs,
      shuffle: true
  });
  await model.save('file://model-large-softmax-reduce-params');

}

trainModel( trainingSetX, trainingSetY);


