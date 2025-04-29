# ImageIQ – Advanced Vision AI Platform

## Overview
ImageIQ is a powerful web-based platform designed to provide comprehensive computer vision and AI capabilities through an ensemble of machine learning models. Built with Flask, Python, and state-of-the-art AI technologies, ImageIQ simplifies and enhances image analysis, classification, and generation using advanced machine learning algorithms and Google's Gemini AI.

## Key Features

- **Image Classification**: Identify and classify objects in images with high accuracy
- **Object Detection**: Detect and locate multiple objects within images in real-time
- **Text Extraction**: Extract text from images using advanced OCR technology
- **Sentiment Analysis**: Analyze sentiment and emotional content from images
- **Text-to-Image Generation**: Generate high-quality images from text descriptions
- **General Image Analysis**: Comprehensive image analysis using Google's Gemini AI
- **Data Collection and Visualization**: Track and visualize model performance metrics
- **Real-Time Processing**: Fast and efficient image processing capabilities
- **Interactive Dashboard**: User-friendly interface for managing and analyzing images
- **Multi-Model Ensemble**: Combines multiple AI models for enhanced accuracy

## How It Works

1. **Upload Image**: Users can upload images through the web interface
2. **Select Analysis Type**: Choose from various analysis options (classification, detection, etc.)
3. **Process Image**: The system processes the image using appropriate AI models
4. **View Results**: Get detailed analysis results with visualizations
5. **Generate Images**: Create new images from text descriptions
6. **Track Performance**: Monitor model performance and accuracy metrics

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Flask (Python)
- **AI Models**: 
  - Google Gemini AI
  - Custom ensemble models
  - PyTorch
  - Transformers
- **Image Processing**: Pillow (PIL)
- **Data Handling**: NumPy
- **Environment Management**: python-dotenv

## Project Structure

```
.
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── models/               # Machine learning models
│   ├── ensemble.py       # Ensemble model implementations
│   ├── data_collector.py # Data collection utilities
│   ├── trainer.py        # Model training utilities
│   └── data_visualization.py # Data visualization tools
├── static/               # Static files (CSS, JS, uploads)
├── templates/            # HTML templates
└── scripts/              # Utility scripts
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Flask-Vision-AI
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your API keys:
```
GOOGLE_API_KEY=your_google_api_key
```

## Usage

1. Start the Flask application:
```bash
python app.py
```

2. Open your web browser and navigate to `http://localhost:5000`

3. The application provides several endpoints:
   - `/`: Main interface
   - `/about`: About page
   - `/analyze`: Image analysis endpoint
   - `/test_gemini`: Gemini AI testing endpoint

## API Endpoints

### POST /analyze
Analyzes images based on different query types:
- `text_extraction`: Extract text from images
- `text_to_image`: Generate images from text
- `classification`: Classify objects in images
- `object_detection`: Detect objects in images
- `sentiment`: Analyze sentiment from images
- `general`: General image analysis using Gemini AI

### POST /test_gemini
Test endpoint for the Gemini AI model with custom prompts.

## Error Handling

The application includes comprehensive error handling for:
- Invalid file uploads
- API errors
- Model initialization failures
- Image processing errors

