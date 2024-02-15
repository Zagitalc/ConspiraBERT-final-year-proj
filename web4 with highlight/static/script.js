document.addEventListener('DOMContentLoaded', function () {
    const textForm = document.getElementById('textForm');
    const resultDiv = document.getElementById('result');
    const userTextDiv = document.getElementById('userText');
    const userTextInput = document.getElementById('userTextInput');

    const sentenceInfoDiv = document.getElementById('sentenceInfo');

    textForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        //the links decide which version of the code users are choosing
        // Get the version of the website from the URL
        // const urlParams = new URLSearchParams(window.location.search);
        // const version = urlParams.get('version');
        const pathname = window.location.pathname; // This will return "/1" or "/2"
        const version = pathname.split('/')[1];




        // selection of model
        const inputText = document.getElementById('inputText').value;

        //handle error for empty input text
        // Check the input text
        if (inputText.length === 0) {
            // Display an alert message if the input text is empty
            alert('Your input is empty. Please enter some text for classification.');
            return;
        }
        // const model = document.getElementById('modelSelection').value;
        const model = "bert"


        const inputData = {
            "text": inputText,
            "model": model
        };
        // Set the route based on the version
        let route;
        if (version === '1') {
            route = '/1/classify'; // call the classify route

            const response = await fetch(route, {
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
                    sentenceInfoDiv.innerHTML = '';
                    sentenceInfoDiv.innerHTML = sentenceInfo;
                    sentenceInfoDiv.style.display = 'block';
                }

                if (data.sentences !== undefined && data.sentences.length > 0) {
                    userTextInput.innerHTML = '';
                    userTextInput.innerHTML = `</h4>Here is your classified text\n</h4>`;

                    let combinedText = '';
                    data.sentences.forEach((sentenceObj, index) => {
                        const sentence = Object.keys(sentenceObj)[0];
                        const result = sentenceObj[sentence].classification
                        const prob = sentenceObj[sentence].probability;
                        //modify the range of the probabilities.   colourisation       test accuracy
                        //deal with \n characters \/\/

                        //generate text summarisation and train a model on it



                        // Calculate the color intensity based on the probability
                        var intensity = Math.floor(prob * 255);  // Scale the probability to 0-255

                        if (result === 0) {
                            intensity = Math.floor(127 * (1 - prob))

                        } else {
                            intensity = Math.floor(127 + 127 * (prob))

                        }

                        // HeuserTextInputat map effect 
                        // highlight text color based on the classification result
                        let color;
                        if (result === 0) {  // Non conspiracy: white for high probability and pink for low probability
                            color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                        } else {  // Potential conspiracy: pink for low probability and red for high probability
                            color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                        }

                        combinedText += `<span style="background-color: ${color};">${sentence}</span> `;
                    });
                    userTextInput.innerHTML += combinedText;
                    userTextInput.style.display = 'block';
                    userTextInput.style.display = 'block';

                } else {
                    userTextInput.innerHTML = ' Classification failed No sentences found.';
                }

            } catch (error) {
                console.error("Error parsing JSON:", error);
                resultDiv.innerHTML = 'Classification failed due to a server error.';
            }

        } else if (version === '2') {

            route = '/2/summarize-and-classify'; // call the summarize-and-classify route

            const response = await fetch(route, {
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
                    sentenceInfoDiv.innerHTML = '';
                    sentenceInfoDiv.innerHTML = sentenceInfo;
                    sentenceInfoDiv.style.display = 'block';
                }

                if (data.sentences !== undefined && data.sentences.length > 0) {
                    userTextInput.innerHTML = '';
                    userTextInput.innerHTML = `<h4>Here is a summary of your text\n</h4>`;

                    let combinedText = '';
                    data.sentences.forEach((sentenceObj, index) => {
                        const sentence = Object.keys(sentenceObj)[0];
                        const result = sentenceObj[sentence].classification
                        const prob = sentenceObj[sentence].probability;
                        //modify the range of the probabilities.   colourisation       test accuracy
                        //deal with \n characters \/\/

                        //generate text summarisation and train a model on it



                        // Calculate the color intensity based on the probability
                        var intensity = Math.floor(prob * 255);  // Scale the probability to 0-255

                        if (result === 0) {
                            intensity = Math.floor(127 * (1 - prob))

                        } else {
                            intensity = Math.floor(127 + 127 * (prob))

                        }

                        // HeuserTextInputat map effect 
                        // highlight text color based on the classification result
                        let color;
                        if (result === 0) {  // Non conspiracy: white for high probability and pink for low probability
                            color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                        } else {  // Potential conspiracy: pink for low probability and red for high probability
                            color = `rgb(${255}, ${255 - intensity}, ${255 - intensity})`;
                        }

                        combinedText += `<span style="background-color: ${color};">${sentence}</span> `;
                    });
                    userTextInput.innerHTML += combinedText;
                    userTextInput.style.display = 'block';
                    userTextInput.style.display = 'block';

                } else {
                    userTextInput.innerHTML = ' Classification failed No sentences found.';
                }

            } catch (error) {
                console.error("Error parsing JSON:", error);
                resultDiv.innerHTML = 'Classification failed due to a server error.';
            }











        } else {
            // case for missing version
            alert('Your version is Invalid or missing. Please enter a valid verison int he URL as provided');





            return;

        }

    });
});
