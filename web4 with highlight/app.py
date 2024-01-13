import nltk
# nltk.download('punkt')
from flask import Flask, render_template, request, jsonify

import joblib
import os
import re
import torch
from transformers import BertForSequenceClassification, BertTokenizer



# # in the ui, allow user to choose which classifier eg nb or bert
# # highlighting in the ui
# # try bert for sentence classifiaction as baseline
# # presentaion, use mockup demos of your ui,
app = Flask(__name__)

models_dir = os.path.join(os.path.dirname(__file__), 'models')

consp_classifier = joblib.load(os.path.join(models_dir, 'consp_classifier.joblib'))
tfidf_vectorizer = joblib.load(os.path.join(models_dir, 'tfidf_vectorizer.joblib'))

# Load the model and tokenizer
Bert_classifier = BertForSequenceClassification.from_pretrained(models_dir)
Bert_tokenizer = BertTokenizer.from_pretrained(models_dir)




@app.route('/')
def index():
        return render_template('index.html')

@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()

    if "text" in data and "model" in data:
        text = data["text"]
        model = data["model"]
        
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

            elif model == "sklearn":
                sentence_tfidf = tfidf_vectorizer.transform([sentence])
                result = consp_classifier.predict(sentence_tfidf)[0]
                probresult = consp_classifier.predict_proba(sentence_tfidf)
                prob = probresult[0][result]  # Conspiracy probability

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

if __name__ == '__main__':
    app.run(debug=True)