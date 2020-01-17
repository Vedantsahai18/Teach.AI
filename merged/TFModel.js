

const MODEL_HTTP_URL = '/model/model.json'
const MODEL_INDEXEDDB_URL = 'indexeddb://attention-model';

async function TFModelSetup() {
    try {
        // Try loading locally saved model
        const model = await tf.loadLayersModel(MODEL_INDEXEDDB_URL)
        console.log("Loaded Saved Model from IndexDB")
        return model;

    } catch (error) {
        // If local load fails, get it from the server
        const model = await tf.loadLayersModel(MODEL_HTTP_URL)
        console.log('model loaded from local');
        //Store the downloaded model locally for future use
        await model.save(MODEL_INDEXEDDB_URL);
        console.log('Model saved to IndexedDB.');

        return model;
    }
}

async function TFModelPredict(model, emo, pose) {
    const items = [emo.happy, emo.angry, emo.disgusted, pose.hand, pose.sleep, pose.gaze]
    const input = tf.tensor2d([items])
    console.log(input)
    const result = await model.predict(input).print()
    return result
}

