import os
import tempfile
import whisper
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load Whisper model once at startup
logger.info("Loading Whisper model...")
model = whisper.load_model("base")
logger.info("Whisper model loaded successfully")

# Configure upload settings
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'wav', 'webm', 'mp3', 'mp4', 'm4a', 'ogg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Whisper transcription service is running"})

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    try:
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({"success": False, "error": "No audio file provided"}), 400
        
        file = request.files['audio']
        
        if file.filename == '':
            return jsonify({"success": False, "error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            # Create a temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_file:
                temp_filename = temp_file.name
                file.save(temp_filename)
            
            try:
                logger.info(f"Transcribing audio file: {temp_filename}")
                
                # Transcribe using Whisper
                result = model.transcribe(temp_filename)
                transcribed_text = result["text"].strip()
                
                logger.info(f"Transcription completed: {transcribed_text[:50]}...")
                
                # Clean up - delete the temporary file
                os.unlink(temp_filename)
                
                return jsonify({
                    "success": True,
                    "text": transcribed_text,
                    "language": result.get("language", "unknown")
                })
                
            except Exception as e:
                # Clean up file even if transcription fails
                if os.path.exists(temp_filename):
                    os.unlink(temp_filename)
                
                logger.error(f"Transcription error: {str(e)}")
                return jsonify({
                    "success": False,
                    "error": f"Transcription failed: {str(e)}"
                }), 500
        
        else:
            return jsonify({
                "success": False,
                "error": "Invalid file type. Supported formats: wav, webm, mp3, mp4, m4a, ogg"
            }), 400
            
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)