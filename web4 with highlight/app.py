import nltk
nltk.download('punkt')
from flask import Flask, render_template, request, jsonify


import joblib
import os
import re
import torch
from transformers import BertForSequenceClassification, BertTokenizer,  AutoModelForSeq2SeqLM, AutoTokenizer, pipeline

#to use the server
# run app py
#
#disown
#kill of necessary

#consent form  after demo... ask participants there in the website
# add flags to lead to other version of the summarisation models.
#handle error, explain in the website of the errors.


app = Flask(__name__)

models_dir = os.path.join(os.path.dirname(__file__), 'models')
summaristion_model_dir=os.path.join(os.path.dirname(__file__),"tm-small-cnn-model")
sum_tokeniser_model_dir=os.path.join(os.path.dirname(__file__),"tokenizer")
# Load the model and tokenizer
Bert_classifier = BertForSequenceClassification.from_pretrained(models_dir)
Bert_tokenizer = BertTokenizer.from_pretrained(models_dir)

summarization_model = AutoModelForSeq2SeqLM.from_pretrained(summaristion_model_dir)
tokenizer_model = AutoTokenizer.from_pretrained(sum_tokeniser_model_dir)

pipe = pipeline("summarization", model=summarization_model, tokenizer=tokenizer_model)


@app.route('/')
def index():
        return render_template('index.html')

#render version 1 of the website
@app.route('/1')
def index_1():
    return render_template('index.html', version='1')

#render version 2 of the website which includes summarisation
@app.route('/2')
def index_2():
    return render_template('index.html', version='2')

@app.route('/1/classify', methods=['POST'])
def classify():
    data = request.get_json()

    if "text" in data and "model" in data:
        text = data["text"]
        model = data["model"]
        
        #temperary summarisation tool
        
        

        # Initialize the HuggingFace summarization pipeline
        # summarizer = pipeline("summarization")
        # summarized = summarizer(text, min_length=75, max_length=300)

        # # Print summarized text



        # try register domain name
        # try lets encrypt for https, clear the 403 forbidden  error
        # try aws route 53
        # db record time user used in classifying tasks
        # catch and show error in the webpage
        # search similar user study cases, how they did questionnaire, review process?reearch


        #tokenise and split sentences
        sentences = nltk.sent_tokenize(text)
        num_sentences = 0
        num_consp_sentences = 0
        split_sentences=[]

        for sentence in sentences:
            if model == "bert":
                # Tokenize the input sentence and convert to tensors
                inputs = Bert_tokenizer(sentence, return_tensors="pt", padding=True, truncation=True, max_length=512)
                
                # Get the model's predictionss
                outputs = Bert_classifier(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
                result = torch.argmax(probs).item()
                print("bert result is",result)
                prob = probs[0][result].item()  # Conspiracy probability

            else:
                return jsonify({'error': 'Invalid model. Please select either "bert" or "sklearn".'})

            if result == 0 or result == 1:  # Conspiracy classification
                if result == 1:
                    num_consp_sentences += 1

                # append sentence, its individual result, and conspiracy probability to sentences list
                split_sentences.append({sentence: {"classification": int(result), "probability": prob}})
                
            num_sentences += 1


        conspiracy_percentage = (num_consp_sentences / num_sentences) * 100 if num_sentences > 0 else 0
        overall_classification = 1 if conspiracy_percentage > 50 else 0
        print("result",{'overall_classification': overall_classification,
                        'sentences': split_sentences,
                        'num_consp_sentences': num_consp_sentences,
                        'num_sentences': num_sentences,
                        'conspiracyPercentage': round(conspiracy_percentage, 2)})
        return jsonify({'overall_classification': overall_classification,
                        'sentences': split_sentences,
                        'num_consp_sentences': num_consp_sentences,
                        'num_sentences': num_sentences,
                        'conspiracyPercentage': round(conspiracy_percentage, 2)})
    
    else:
        return jsonify({'error': 'Invalid input format. Please provide the required fields "text" and "model".'})

# versionn 2 of the website, summarises text before classifier
@app.route('/2/summarize-and-classify', methods=['POST'])
def summarize_and_classify():
    data = request.get_json()

    if "text" in data and "model" in data:
        text = data["text"]
        model = data["model"]

        # Summarize the text
        summarized = pipe(text, min_length=75, max_length=300)

        # Get the summary text
        summary = summarized[0]["summary_text"]
        # Tokenize and split sentences
        sentences = nltk.sent_tokenize(summary)
        num_sentences = 0
        num_consp_sentences = 0
        split_sentences = []

        for sentence in sentences:
            if model == "bert":
                # Tokenize the input sentence and convert to tensors
                inputs = Bert_tokenizer(sentence, return_tensors="pt", padding=True, truncation=True, max_length=512)

                # Get the model's predictions
                outputs = Bert_classifier(**inputs)
                probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
                result = torch.argmax(probs).item()
                print("bert result is", result)
                prob = probs[0][result].item()  # Conspiracy probability

            else:
                return jsonify({'error': 'Invalid model. Please select either "bert" or "sklearn".'})

            if result == 0 or result == 1:  # Conspiracy classification
                if result == 1:
                    num_consp_sentences += 1

                # append sentence, its individual result, and conspiracy probability to sentences list
                split_sentences.append({sentence: {"classification": int(result), "probability": prob}})

            num_sentences += 1

        conspiracy_percentage = (num_consp_sentences / num_sentences) * 100 if num_sentences > 0 else 0
        overall_classification = 1 if conspiracy_percentage > 50 else 0
        print("result", {'overall_classification': overall_classification,
                         'sentences': split_sentences,
                         'num_consp_sentences': num_consp_sentences,
                         'num_sentences': num_sentences,
                         'conspiracyPercentage': round(conspiracy_percentage, 2)})
        return jsonify({'overall_classification': overall_classification,
                        'sentences': split_sentences,
                        'num_consp_sentences': num_consp_sentences,
                        'num_sentences': num_sentences,
                        'conspiracyPercentage': round(conspiracy_percentage, 2),
                        'summary': summary})

    else:
        return jsonify({'error': 'Invalid input format. Please provide the required fields "text" and "model".'})

if __name__ == '__main__':
    # app.run(debug=True)
    app.run()
    # app.run(ssl_context='adhoc')
    

# users may type 16.171.111.198/1  or 16.171.111.198/2
# instead of https
# to access version 1 or version 2 of the website


# host needs to set up gunicorn server and nginx and a service first time to provide http proxy requests 

# pip install gunicorn
# gunicorn -b 0.0.0.0:8000 app:app
# ctrl c ...
    



# sudo systemct1 start nginx
# sudo systemct1 enable nginx.

#for more https://www.youtube.com/watch?v=z5XiVh6v4uI
