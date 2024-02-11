import numpy as np
import csv
import re
import nltk
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, GlobalMaxPooling1D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import SparseCategoricalCrossentropy
from sklearn.utils.class_weight import compute_class_weight

nltk.download('stopwords')

csv_file_path = "C:/Users/AKIRA INFO TECH/OneDrive/Desktop/ai/file.csv" # Replace with the path to your CSV file
data = []

encodings_to_try = ['utf-8', 'latin-1', 'ISO-8859-1']

for encoding in encodings_to_try:
    try:
        with open(csv_file_path, 'r', encoding=encoding) as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                text = row['text']
                sentiment = row['sentiment']
                data.append((text, sentiment))
        
       
        break
    except UnicodeDecodeError:
        continue


def preprocess(text):
    text = text.lower()  
    text = re.sub(r'[^\w\s]', '', text)  
    return text


corpus = [preprocess(text) for text, _ in data]


tokenizer = Tokenizer(num_words=500000, oov_token='<OOV>')
tokenizer.fit_on_texts(corpus)
word_index = tokenizer.word_index
sequences = tokenizer.texts_to_sequences(corpus)
padded_sequences = pad_sequences(sequences, padding='post')


sentiment_mapping = {"positive": 0, "negative": 1, "neutral": 2}
labels = np.array([sentiment_mapping[sentiment] for _, sentiment in data])


train_texts, val_texts, train_labels, val_labels = train_test_split(padded_sequences, labels, test_size=0.2, random_state=42)


class_counts = np.bincount(train_labels)
total_samples = sum(class_counts)
class_weights = {cls: total_samples / count for cls, count in enumerate(class_counts)}


model = Sequential()
model.add(Embedding(len(word_index) + 1, 128))
model.add(LSTM(128, return_sequences=True))
model.add(GlobalMaxPooling1D())
model.add(Dense(64, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(3, activation='softmax'))


optimizer = Adam(learning_rate=0.001)
loss = SparseCategoricalCrossentropy()
model.compile(loss=loss, optimizer=optimizer, metrics=['accuracy'])


model.fit(train_texts, train_labels, epochs=1, validation_data=(val_texts, val_labels), class_weight=class_weights)


def predict_sentiment(user_input):
    preprocessed_input = preprocess(user_input)
    sequence = tokenizer.texts_to_sequences([preprocessed_input])
    padded_sequence = pad_sequences(sequence, padding='post', maxlen=100)
    sentiment_probabilities = model.predict(padded_sequence)[0]
    predicted_sentiment = np.argmax(sentiment_probabilities)
    return list(sentiment_mapping.keys())[list(sentiment_mapping.values()).index(predicted_sentiment)]


while True:
    user_input = input("Enter your message (or 'exit' to quit): ")
    if user_input.lower() == 'exit':
        break
    sentiment = predict_sentiment(user_input)
    print("Predicted sentiment:", sentiment)
