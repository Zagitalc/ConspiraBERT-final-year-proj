document.addEventListener('DOMContentLoaded', function () {
    const textForm = document.getElementById('textForm');
    const resultDiv = document.getElementById('result');
    const userTextDiv = document.getElementById('userText');
    const userTextInput = document.getElementById('userTextInput');

    const sentenceInfoDiv = document.getElementById('sentenceInfo');

    textForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        // resultDiv.innerHTML = '';
        // resultDiv.innerHTML = 'Classifying...';
        // resultDiv.innerHTML = '';

        // selection of model
        const inputText = document.getElementById('inputText').value;
        // const model = document.getElementById('modelSelection').value;
        const model = "bert"


        const inputData = {
            "text": inputText,
            "model": model
        };

        const response = await fetch('/classify', {
            method: 'POST',
            body: JSON.stringify(inputData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        try {
            const data = await response.json();



            if (data.num_sentences !== undefined && data.num_consp_sentences !== undefined) {
                const sentenceInfo = `The text's conspiracy result is ${data.overall_classification === 0 ?
                    "Non Conspiracy" : "Potential Conspiracy"}. You have ${data.num_consp_sentences} 
                     Conspiracy Sentences in ${data.num_sentences} sentences, leading to a conspiracy percentage of 
                     ${data.conspiracyPercentage}%`;
                sentenceInfoDiv.innerHTML = sentenceInfo;
                sentenceInfoDiv.style.display = 'block';
            }

            if (data.sentences !== undefined && data.sentences.length > 0) {
                userTextInput.innerHTML = '';

                let combinedText = '';
                data.sentences.forEach((sentenceObj, index) => {
                    const sentence = Object.keys(sentenceObj)[0];
                    const result = sentenceObj[sentence].classification
                    const prob = sentenceObj[sentence].probability;
                    //modify the range of the probabilities.   colourisation       test accuracy
                    //deal with \n characters \/\/

                    //generate text summarisation and train a model on it



                    // Calculate the color intensity based on the probability
                    const intensity = Math.floor(prob * 255);  // Scale the probability to 0-255

                    // Heat map effect 
                    // highlight text color based on the classification result
                    let color;
                    if (result === 0) {  // Non conspiracy: white for high probability and pink for low probability
                        color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                    } else {  // Potential conspiracy: pink for low probability and red for high probability
                        color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                    }

                    combinedText += `<span style="background-color: ${color};">${sentence}</span> `;
                });
                userTextInput.innerHTML = combinedText;
                userTextDiv.style.display = 'block';
                userTextInput.style.display = 'block';

            } else {
                userTextInput.innerHTML = ' Classification failed No sentences found.';
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
            resultDiv.innerHTML = 'Classification failed due to a server error.';
        }
    });
});
