document.addEventListener('DOMContentLoaded', function () {
    const textForm = document.getElementById('textForm');
    const resultDiv = document.getElementById('result');
    const userTextDiv = document.getElementById('userText');
    const userTextInput = document.getElementById('userTextInput');

    const sentenceInfoDiv = document.getElementById('sentenceInfo');

    textForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        resultDiv.innerHTML = '';
        resultDiv.innerHTML = 'Classifying...';
        resultDiv.innerHTML = '';

        // selection of model
        const inputText = document.getElementById('inputText').value;
        const model = document.getElementById('modelSelection').value;

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

            if (data.overall_classification !== undefined) {
                const classification = data.overall_classification === 0 ? "Non Conspiracy" : "Potential Conspiracy";
                resultDiv.innerHTML = `Overall Classification: ${classification}, prediction ${data.overall_classification}`;
                resultDiv.style.display = 'block';


                userTextDiv.style.display = 'block';
            } else {
                resultDiv.innerHTML = 'Classification failed.';
            }

            if (data.num_sentences !== undefined && data.num_consp_sentences !== undefined) {
                const sentenceInfo = `The text's conspiracy result is ${data.overall_classification === 0 ? "Non Conspiracy" : "Potential Conspiracy"}. You have ${data.num_consp_sentences} Conspiracy Sentences in ${data.num_sentences} sentences, leading to a percentage of ${data.conspiracyPercentage}%`;
                sentenceInfoDiv.innerHTML = sentenceInfo;
                sentenceInfoDiv.style.display = 'block';
            }

            if (data.sentences !== undefined && data.sentences.length > 0) {
                userTextInput.innerHTML = '';
                data.sentences.forEach((sentenceObj, index) => {
                    const sentence = Object.keys(sentenceObj)[0];
                    const result = sentenceObj[sentence].classification
                    //classify as conspiracy or non conspiracy
                    const resultclass = sentenceObj[sentence].classification === 0 ?
                        "Non Conspiracy" : "Potential Conspiracy";
                    const prob = sentenceObj[sentence].probability;
                    const sentenceData = document.createElement('div');
                    const sentenceHeader = document.createElement('h3');
                    sentenceHeader.textContent = `Sentence ${index + 1}:`;

                    sentenceData.appendChild(sentenceHeader);
                    const sentenceInfoList = document.createElement('ul');

                    const listItem = document.createElement('li');
                    listItem.textContent = `Sentence: ${sentence}, Classification: ${resultclass}, Probability: ${prob}`;

                    // Calculate the color intensity based on the probability
                    const intensity = Math.floor(prob * 255);  // Scale the probability to 0-255

                    // Heat map effect 
                    // highlight text color based on the classification result
                    if (result === 0) {  // Non conspiracy: green for low probability and yellow for high probability
                        listItem.style.backgroundColor = `rgb(${intensity}, ${255 - intensity}, 0)`;
                    }
                    else {  // Conspiracy, yellow for low probability and red for high probability
                        listItem.style.backgroundColor = `rgb(${255}, ${255 - intensity}, 0)`;  // Yellow to red gradient
                    }

                    sentenceInfoList.appendChild(listItem);
                    console.log("result is", result, "listItem.style.backgroundColor", listItem.style.backgroundColor)

                    sentenceData.appendChild(sentenceInfoList);
                    userTextInput.appendChild(sentenceData);
                    userTextDiv.style.display = 'block';
                    userTextInput.style.display = 'block';
                });
            } else {
                userTextInput.innerHTML = 'No sentences found.';
            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
            resultDiv.innerHTML = 'Classification failed due to a server error.';
        }
    });
});
