# Durham University BSc Computer Science Final Year Project
## Conspiracy Theories: Understanding and Predicting Conspiratorial Content using NLP

### 📌 Project Overview
This project explores the linguistic features and patterns of conspiracy theories in online texts.  
A **fine-tuned BERT model** was trained on the **LOCO dataset** and deployed as a **web application**, allowing users to classify text for conspiratorial content.

### 🔍 Key Findings
- Identifying **distinct patterns** in model layers is **challenging**.
- The model often **confuses sentiment analysis with conspiracy classification**, revealing **ambiguities** in the training objective.
- **Data quality significantly affects model performance**.
- Future improvements will explore **advanced LLMs**, such as **OpenAI o1** and **open-source Qwen models**, for better detection accuracy.

---

## 📊 Project Data

- **Model:** Fine-tuned BERT (LOCO dataset)  
- **Dataset:** LOCO (Language of Conspiracy Online)  
- **Application Type:** Flask-based Web Application  
- **Endpoints:** `/1/classify`, `/2/summarize-and-classify`  
- **Technologies:** Python, Flask, NLTK, Hugging Face Transformers  
- **Deployment:** Local & Production (Gunicorn + Nginx)  


---

## 🌐 Web Application Functionalities

This **Flask-based** web application provides two primary **NLP capabilities**:

### **1️⃣ Text Classification**
**📌 Endpoint:**  

**🔹 Functionality:**  
- Accepts **JSON input** containing a text and a model identifier (currently supports `"bert"`).

**🔹 Process:**  
1. **Tokenizes** the input text into sentences using **NLTK**.
2. Uses a **pre-trained BERT model** (with tokenizer) to classify each sentence as **conspiracy-related or not**.
3. Computes an **overall classification score** based on the proportion of flagged sentences.
4. Returns a **JSON response** with:
   - **Sentence-by-sentence classification**
   - **Probability scores**
   - **Overall classification percentage**

---

### **2️⃣ Summarise and Classify**
**📌 Endpoint:**  

**🔹 Functionality:**  
- Accepts **JSON input** containing a text and a model identifier.

**🔹 Process:**  
1. **Summarises** the input text using a **Hugging Face summarisation pipeline**.
2. **Tokenizes** the summary into sentences using **NLTK**.
3. **Classifies** each sentence using the **BERT-based method** (as above).

**🔹 Output:**  
- Returns a **JSON response** with:
  - **Summarised text**
  - **Sentence classifications**
  - **Overall classification metrics**

---

## 📌 Additional Routes
- `/` – Renders the default index page.
- `/1` – Renders **version 1** of the interface.
- `/2` – Renders **version 2** of the interface (includes summarisation feature).

---

## ⚙️ Setup and Deployment

### 🔹 Dependencies
- **Python Packages:** `Flask`, `nltk`, `torch`, `transformers`, `joblib`, etc.
- The application downloads **NLTK’s 'punkt' tokenizer** for sentence tokenisation.

### 🔹 Model Directories
- The **pre-trained BERT classifier** and tokenizer are loaded from the `models/` directory.
- The **summarisation model** and its tokenizer are loaded from `tm-small-cnn-model/` and `tokenizer/` directories, respectively.

### 🔹 Running the Application
To run the server locally, execute:
```bash
python app.py
