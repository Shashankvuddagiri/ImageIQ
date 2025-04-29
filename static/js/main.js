async function generateResponse() {
    const input = document.getElementById('userInput').value;
    const queryType = document.querySelector('input[name="queryType"]:checked').value;
    const loading = document.getElementById('loading');
    const responseDiv = document.getElementById('response');
    const generateBtn = document.getElementById('generateBtn');

    if (queryType === 'text_to_image') {
        if (!input) {
            showToast('Please enter text to generate an image.', 'error');
            return;
        }
        loading.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';

        try {
            const formData = new FormData();
            formData.append('input', input);
            formData.append('query_type', queryType);

            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.error) {
                console.error(`Error: ${data.error}`);
                showToast(`Error: ${data.error}`, 'error');
            } else {
                displayResults(data);
                showResults();
            }
        } catch (error) {
            console.error('An error occurred during analysis:', error);
            showToast('An error occurred during analysis', 'error');
        } finally {
            loading.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles me-2"></i>Generate Image';
        }
    } else if (queryType === 'text_extraction') {
        if (uploadedImages.size === 0) {
            showToast('Please upload at least one image', 'error');
            return;
        }

        loading.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing...';

        try {
            for (const [filename, imageData] of uploadedImages) {
                const formData = new FormData();
                formData.append('input', input);
                formData.append('image', imageData.file);
                formData.append('query_type', queryType);

                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    console.error(`Error: ${data.error}`);
                    showToast(`Error: ${data.error}`, 'error');
                } else {
                    displayResults(data, filename);
                    showResults();
                }
            }
        } catch (error) {
            console.error('An error occurred during analysis:', error);
            showToast('An error occurred during analysis', 'error');
        } finally {
            loading.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles me-2"></i>Analyze Image';
        }
    } else {
        if (uploadedImages.size === 0) {
            showToast('Please upload at least one image', 'error');
            return;
        }

        loading.style.display = 'flex';
        generateBtn.disabled = true;
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Analyzing...';

        try {
            for (const [filename, imageData] of uploadedImages) {
                const formData = new FormData();
                formData.append('input', input);
                formData.append('image', imageData.file);
                formData.append('query_type', queryType);

                const response = await fetch('/analyze', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.error) {
                    console.error(`Error: ${data.error}`);
                    showToast(`Error: ${data.error}`, 'error');
                } else {
                    displayResults(data, filename);
                    showResults();
                }
            }
        } catch (error) {
            console.error('An error occurred during analysis:', error);
            showToast('An error occurred during analysis', 'error');
        } finally {
            loading.style.display = 'none';
            generateBtn.disabled = false;
            generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles me-2"></i>Analyze Image';
        }
    }
}

// Image preview functionality
function updateImagePreview(file) {
    const preview = document.getElementById('imagePreview');
    const imageInfo = document.getElementById('imageInfo');
    const previewContainer = document.getElementById('imagePreviewContainer');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.classList.remove('d-none');
            
            // Store the image in our Map
            uploadedImages.set(file.name, {
                file: file,
                preview: e.target.result
            });

            // Update image info
            imageInfo.innerHTML = `
                <div class="image-info-content">
                    <span><i class="fas fa-file-image me-2"></i>${file.name}</span>
                    <span class="ms-3"><i class="fas fa-weight-hanging me-2"></i>${formatFileSize(file.size)}</span>
                </div>`;
        }
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add('d-none');
        preview.src = '';
        imageInfo.innerHTML = '';
    }
}

// File size formatter
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Handle file selection
document.getElementById('imageUpload').addEventListener('change', function(event) {
    if (event.target.files[0]) {
        updateImagePreview(event.target.files[0]);
    }
});

// Update response display based on analysis type
function displayResults(data, filename) {
    const responseDiv = document.getElementById('response');
    let html = `
        <div class="analysis-results fade-in">
            <h5 class="mb-3">Results for: ${filename}</h5>
    `;

    switch(data.query_type) {
        case 'general':
            if (data.analysis.gemini_response) {
                html += `
                    <div class="result-section">
                        <h4 class="analysis-title">
                            <i class="fas fa-robot me-2"></i>Analysis Results
                        </h4>
                        <div class="gemini-response">
                            ${formatGeminiResponse(data.analysis.gemini_response)}
                        </div>
                    </div>`;
            }
            break;

        case 'object_detection':
            if (data.analysis.objects && data.analysis.objects.length > 0) {
                html += `
                    <div class="result-section">
                        <h4 class="analysis-title">
                            <i class="fas fa-object-group me-2"></i>Detected Objects
                        </h4>
                        <div class="detection-results">
                            ${data.analysis.objects
                                .sort((a, b) => b.confidence - a.confidence)
                                .map(obj => `
                                    <div class="detection-item">
                                        <span class="object-label">
                                            <i class="fas fa-tag me-2"></i>${obj.class}
                                        </span>
                                        <span class="confidence badge ${getConfidenceBadgeClass(obj.confidence)}">
                                            ${(obj.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                `).join('')}
                        </div>
                    </div>`;
            }
            break;

        case 'classification':
            if (data.analysis.classification && data.analysis.classification.predictions) {
                html += `
                    <div class="result-section">
                        <h4><i class="fas fa-tags me-2"></i>Image Classification</h4>
                        <div class="classification-results">
                            ${Object.entries(data.analysis.classification.predictions)
                                .sort(([,a], [,b]) => b - a)
                                .map(([label, score]) => `
                                    <div class="classification-item">
                                        <span class="label">${label}</span>
                                        <div class="progress">
                                            <div class="progress-bar ${getProgressBarClass(score)}" 
                                                role="progressbar" 
                                                style="width: ${score * 100}%" 
                                                aria-valuenow="${score * 100}" 
                                                aria-valuemin="0" 
                                                aria-valuemax="100">
                                                ${(score * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                        </div>
                    </div>`;
            }
            break;

        case 'text_extraction':
            if (data.analysis.extracted_text) {
                html += `
                    <div class="result-section">
                        <h4><i class="fas fa-font me-2"></i>Extracted Text</h4>
                        <div class="text-extraction-results">
                            ${data.analysis.extracted_text.printed_text ? `
                                <div class="extracted-text-section">
                                    <h5>Printed Text</h5>
                                    <p>${data.analysis.extracted_text.printed_text}</p>
                                </div>
                            ` : ''}
                            ${data.analysis.extracted_text.handwritten_text ? `
                                <div class="extracted-text-section">
                                    <h5>Handwritten Text</h5>
                                    <p>${data.analysis.extracted_text.handwritten_text}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>`;
            }
            break;

        case 'sentiment':
            if (data.analysis.sentiment) {
                html += `
                    <div class="result-section">
                        <h4><i class="fas fa-heart me-2"></i>Sentiment Analysis</h4>
                        <div class="sentiment-result">
                            <span class="badge ${getSentimentBadgeClass(data.analysis.sentiment.sentiment)}">
                                ${data.analysis.sentiment.sentiment}
                                <span class="ms-2">${data.analysis.sentiment.confidence}</span>
                            </span>
                        </div>
                    </div>`;
            }
            break;

        case 'text_to_image':
            if (data.analysis.image_url) {
                html += `
                    <div class="result-section">
                        <h4><i class="fas fa-image me-2"></i>Generated Image</h4>
                        <img src="${data.analysis.image_url}" alt="Generated Image" class="img-fluid">
                    </div>`;
            }
            break;
    }

    html += '</div>';
    
    // Append results instead of replacing
    responseDiv.innerHTML += html;
}

// Helper functions for better display
function formatGeminiResponse(text) {
    return text.split('\n')
        .map(paragraph => paragraph.trim())
        .filter(paragraph => paragraph.length > 0)
        .map(paragraph => `<p class="response-paragraph">${paragraph}</p>`)
        .join('');
}

function getConfidenceBadgeClass(confidence) {
    if (confidence >= 0.8) return 'bg-success';
    if (confidence >= 0.6) return 'bg-primary';
    if (confidence >= 0.4) return 'bg-warning';
    return 'bg-danger';
}

function getProgressBarClass(score) {
    if (score >= 0.8) return 'bg-success';
    if (score >= 0.6) return 'bg-primary';
    if (score >= 0.4) return 'bg-warning';
    return 'bg-danger';
}

function getSentimentBadgeClass(sentiment) {
    switch(sentiment) {
        case 'POSITIVE': return 'bg-success';
        case 'NEGATIVE': return 'bg-danger';
        case 'NEUTRAL': return 'bg-secondary';
        default: return 'bg-primary';
    }
}

function showToast(message, type = 'info') {
    const bgClass = type === 'error' ? 'danger' : 
                   type === 'success' ? 'success' : 
                   'primary';
    
    const iconClass = type === 'error' ? 'exclamation-circle' : 
                     type === 'success' ? 'check-circle' : 
                     'info-circle';

    const toastHTML = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div class="toast align-items-center text-white bg-${bgClass}" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${iconClass} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </div>`;
    
    document.body.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.querySelector('.toast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
    
    setTimeout(() => {
        toastElement.remove();
    }, 3000);
}

// Add these event listeners after your document loads
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('imageUpload');

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop zone when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    // Handle dropped files
    dropZone.addEventListener('drop', handleDrop, false);

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight(e) {
        dropZone.classList.add('dragover');
    }

    function unhighlight(e) {
        dropZone.classList.remove('dragover');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length) {
            // Handle the last dropped file (you could modify this to handle multiple files)
            const file = files[0];
            document.getElementById('imageUpload').files = dt.files;
            updateImagePreview(file);
        }
    }
});

function showResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.classList.add('show');
}

// Call this after receiving the analysis response
function handleAnalysisResponse(response) {
    // ... your existing response handling code ...
    showResults();
}

// Add these functions to handle multiple images
let uploadedImages = new Map(); // Store multiple images

function deleteImage() {
    const preview = document.getElementById('imagePreview');
    const previewContainer = document.getElementById('imagePreviewContainer');
    const imageInfo = document.getElementById('imageInfo');
    const fileInput = document.getElementById('imageUpload');

    // Clear the file input
    fileInput.value = '';
    
    // Clear the preview
    previewContainer.classList.add('d-none');
    preview.src = '';
    imageInfo.innerHTML = '';

    // Remove from our Map
    const currentImageName = preview.getAttribute('data-filename');
    if (currentImageName) {
        uploadedImages.delete(currentImageName);
    }

    // Show toast notification
    showToast('Image deleted successfully', 'success');
}

// New function to display the generated image
function displayGeneratedImage(imageData) {
    const responseDiv = document.getElementById('response');
    const html = `
        <div class="result-section">
            <h4><i class="fas fa-image me-2"></i>Generated Image</h4>
            <img src="${imageData}" alt="Generated Image" class="img-fluid">
        </div>`;
    
    responseDiv.innerHTML += html; // Append the image to the response div
}