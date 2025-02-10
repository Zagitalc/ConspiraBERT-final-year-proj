# Durham University BSc Computer Science FInaal Year Project
# Conspiracy Theories: Understanding and Predicting Conspiratorial Content using Natural Language Processing
This project investigates the linguistic features and patterns of conspiracy theories in online texts. A machine learning model was developed using a fine-tuned BERT architecture, trained on the LOCO dataset, and deployed as a web application, allowing users to input content for classification. Preliminary findings indicate that identifying distinct patterns in the model layers is challenging, as the model can conflate sentiment analysis with conspiracy classification—highlighting ambiguities in the training objective and the influence of data quality. Future work will explore more advanced LLMs, including OpenAI o1 and open-source Qwen models, to improve detection accuracy.

This Flask-based web application provides two main NLP functionalities:

Text Classification

Endpoint: /1/classify

Functionality: Accepts JSON input containing a text and a model identifier (currently supports "bert").

Process:
Tokenises the input text into sentences using NLTK.
Uses a pre-trained BERT model (with its tokenizer) to classify each sentence as conspiracy-related or not.
Calculates an overall classification based on the proportion of sentences flagged as conspiracy.
Output: Returns a JSON response with detailed sentence-by-sentence classification, including the classification result, probability scores, and the overall classification percentage.

Summarise and Classify

Endpoint: /2/summarize-and-classify

Functionality: Accepts JSON input containing a text and a model identifier.

Process:
Summarises the input text using a HuggingFace summarisation pipeline (with a pre-trained sequence-to-sequence model and its tokenizer).
Tokenises the summary into sentences with NLTK.
Classifies each sentence using the same BERT-based method as above.

Output: Returns a JSON response with the summary, detailed sentence classifications, and the overall classification metrics.

Additional Routes
/ – Renders the default index page.
/1 – Renders version 1 of the interface.
/2 – Renders version 2 of the interface (includes the summarisation feature).

Setup and Deployment

Dependencies:

Python packages: Flask, nltk, torch, transformers, joblib, etc.
The application downloads NLTK’s 'punkt' tokenizer for sentence tokenisation.

Model Directories:
Pre-trained BERT classifier and tokenizer are loaded from the models directory.
The summarisation model and its tokenizer are loaded from the tm-small-cnn-model and tokenizer directories, respectively.

Running the Application:
To run the server locally, execute:
bash
Copy
python app.py
For production, consider deploying with Gunicorn and Nginx. For example:
bash
Copy
gunicorn -b 0.0.0.0:8000 app:app
Notes
The application includes inline comments with further instructions on error handling, HTTPS configuration, and deployment tips.
Users can access different versions of the interface by appending /1 or /2 to the server URL.
