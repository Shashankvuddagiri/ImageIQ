import google.generativeai as genai
from PIL import Image
import logging
import os
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class TextExtractionEnsemble:
    def __init__(self):
        try:
            # Use the gemini-1.5-flash model for text extraction
            self.model = genai.GenerativeModel('gemini-1.5-flash')
            logger.info("Text Extraction Ensemble initialized")
        except Exception as e:
            logger.error(f"Error initializing text extraction: {str(e)}")
            raise

    def extract(self, image):
        try:
            prompt = """
            Extract all text visible in this image. Format the response as follows:
            - Include only the text found in the image
            - Separate different text blocks with line breaks
            - Do not include any analysis or commentary
            - Return only the extracted text
            """
            # Ensure the prompt is a single string and image is passed correctly
            response = self.model.generate_content([prompt, image])  # Pass as a list
            extracted_text = response.text.strip()
            
            return {
                'printed_text': extracted_text,
                'handwritten_text': '',
                'text_regions': []
            }
        except Exception as e:
            logger.error(f"Error in text extraction: {str(e)}")
            raise

class ImageClassificationEnsemble:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel('gemini-1.5-pro')
            logger.info("Image Classification Ensemble initialized")
        except Exception as e:
            logger.error(f"Error initializing image classification: {str(e)}")
            raise

    def predict(self, image):
        try:
            prompt = """
            Classify the main objects/items in this image. Return exactly 5 classifications in order of confidence.
            Format each classification as follows:
            - Label: what the item/object is
            - Confidence: a percentage between 0-100
            Return only the classifications, no additional text.
            """
            response = self.model.generate_content([prompt, image])
            if not response or not hasattr(response, 'text'):
                logger.error("Invalid response from classification model.")
                return [{'label': 'No classifications found.', 'confidence': 0.0}]
            
            # Parse the response into structured format
            classifications = []
            lines = response.text.strip().split('\n')
            for line in lines[:5]:  # Take top 5 classifications
                if ':' in line:
                    label, confidence = line.split(':')
                    confidence = float(confidence.strip().replace('%', '')) / 100
                    classifications.append({
                        'label': label.strip(),
                        'confidence': confidence,
                        'supporting_models': ['gemini']
                    })
            
            if not classifications:
                classifications.append({'label': 'No classifications found.', 'confidence': 0.0})
            
            return classifications
        except Exception as e:
            logger.error(f"Error in image classification: {str(e)}")
            return [{'label': 'Error in classification.', 'confidence': 0.0}]

class ObjectDetectionEnsemble:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel('gemini-1.5-pro')
            logger.info("Object Detection Ensemble initialized")
        except Exception as e:
            logger.error(f"Error initializing object detection: {str(e)}")
            raise

    def detect(self, image):
        try:
            prompt = """
            Detect and locate objects in this image. For each object, provide:
            - Class: what the object is
            - Confidence: how sure you are (as a percentage)
            - Location: general position in the image (e.g., "top left", "center", etc.)
            - Additional details: any relevant attributes of the object
            
            Format as a list of objects. Return only the detections, no additional text.
            """
            response = self.model.generate_content([prompt, image])
            logger.info(f"Object detection response: {response.text}")

            # Check if the response is valid
            if not response or not hasattr(response, 'text'):
                logger.error("Invalid response from object detection model.")
                return {'summary': "No objects detected."}

            # Parse the response into structured format
            detections = []
            objects = response.text.strip().split('\n')
            for obj in objects:
                if ':' in obj:
                    class_name, details = obj.split(':', 1)
                    confidence = 0.9  # Default confidence
                    if '%' in details:
                        confidence = float(details.split('%')[0].strip()) / 100
                    detections.append({
                        'class': class_name.strip(),
                        'confidence': confidence,
                    })

            # Create a summary response
            if not detections:
                summary = "No objects detected."
            else:
                detected_classes = [d['class'] for d in detections]
                summary = f"The image is a {', '.join(detected_classes)}."

            return {
                'summary': summary,
                'objects': detections
            }
        except Exception as e:
            logger.error(f"Error in object detection: {str(e)}")
            return {'summary': "Error in object detection."}

class SentimentEnsemble:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel('gemini-1.5-pro')
            logger.info("Sentiment Ensemble initialized")
        except Exception as e:
            logger.error(f"Error initializing sentiment analysis: {str(e)}")
            raise

    def analyze(self, text):
        try:
            prompt = f"""
            Analyze the sentiment of the following text. Classify it as POSITIVE, NEGATIVE, or NEUTRAL.
            Also provide a confidence score as a percentage.
            Text: {text}
            Return only the classification and confidence, no additional text.
            """
            response = self.model.generate_content(prompt)
            if not response or not hasattr(response, 'text'):
                logger.error("Invalid response from sentiment model.")
                return {'ensemble_prediction': {'sentiment': 'UNKNOWN', 'confidence': 0.0}}  # Default response
            
            # Parse the response
            result = response.text.strip().split('\n')[0]
            sentiment = 'NEUTRAL'
            confidence = 0.0
            
            if 'POSITIVE' in result.upper():
                sentiment = 'POSITIVE'
            elif 'NEGATIVE' in result.upper():
                sentiment = 'NEGATIVE'
                
            if '%' in result:
                confidence = float(result.split('%')[0].strip()) / 100
            
            if sentiment == 'NEUTRAL' and confidence == 0.0:
                return {
                    'ensemble_prediction': {
                        'sentiment': 'No sentiment detected.',
                        'confidence': 0.0,
                        'semantic_similarities': {}
                    },
                    'individual_predictions': {
                        'gemini': {
                            'label': 'No sentiment detected.',
                            'score': 0.0
                        }
                    }
                }
            
            return {
                'ensemble_prediction': {
                    'sentiment': sentiment,
                    'confidence': f"{confidence:.2%}",
                    'semantic_similarities': {}
                },
                'individual_predictions': {
                    'gemini': {
                        'label': sentiment,
                        'score': confidence
                    }
                }
            }
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {str(e)}")
            return {'ensemble_prediction': {'sentiment': 'Error in sentiment analysis.', 'confidence': 0.0}}

class ImageGenerationEnsemble:
    def __init__(self):
        try:
            self.model = genai.GenerativeModel('imagegen')  # Use imagegen model
            logger.info("Image Generation Ensemble initialized")
        except Exception as e:
            logger.error(f"Error initializing image generation: {str(e)}")
            raise

    def generate(self, prompt):
        try:
            response = self.model.generate_content(prompt)
            if not response or not hasattr(response, 'image_url'):
                logger.error("Invalid response from image generation model.")
                return {'image_url': None}
            return {'image_url': response.image_url}
        except Exception as e:
            logger.error(f"Error in image generation: {str(e)}")
            return {'image_url': None}