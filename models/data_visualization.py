import matplotlib.pyplot as plt
import seaborn as sns

def plot_classification_results(classifications):
    """Visualize image classification results."""
    labels = [item['label'] for item in classifications]
    confidences = [item['confidence'] for item in classifications]

    plt.figure(figsize=(10, 6))
    sns.barplot(x=confidences, y=labels, palette='viridis')
    plt.title('Image Classification Results')
    plt.xlabel('Confidence')
    plt.ylabel('Class Labels')
    plt.xlim(0, 1)  # Confidence range from 0 to 1
    plt.show()

def plot_object_detection_results(detections):
    """Visualize object detection results."""
    classes = [d['class'] for d in detections]
    confidences = [d['confidence'] for d in detections]

    plt.figure(figsize=(10, 6))
    sns.barplot(x=confidences, y=classes, palette='coolwarm')
    plt.title('Object Detection Results')
    plt.xlabel('Confidence')
    plt.ylabel('Detected Classes')
    plt.xlim(0, 1)  # Confidence range from 0 to 1
    plt.show()

def plot_sentiment_analysis_results(sentiment_result):
    """Visualize sentiment analysis results."""
    sentiment = sentiment_result['ensemble_prediction']['sentiment']
    confidence = sentiment_result['ensemble_prediction']['confidence']

    plt.figure(figsize=(6, 4))
    sns.barplot(x=[sentiment], y=[confidence], palette='pastel')
    plt.title('Sentiment Analysis Result')
    plt.xlabel('Sentiment')
    plt.ylabel('Confidence')
    plt.ylim(0, 1)  # Confidence range from 0 to 1
    plt.show() 