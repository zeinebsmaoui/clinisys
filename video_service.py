from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import os
import tempfile
import base64
import io

app = Flask(__name__)
CORS(app)

@app.route('/generate-video', methods=['POST'])
def generate_video():
    data = request.json
    image_urls = data.get('imageUrls', [])
    menu_name = data.get('menuName', 'video')

    if not image_urls:
        return jsonify({'error': 'No images provided'}), 400

    frames = []

    for i, url in enumerate(image_urls):
        try:
            if url.startswith('data:'):
                # Base64 image
                base64_data = url.split(',')[1]
                img_bytes = base64.b64decode(base64_data)
                img = Image.open(io.BytesIO(img_bytes)).convert('RGB')
            else:
                # URL image (old captures)
                import requests
                response = requests.get(f"http://localhost:8080{url}", timeout=10)
                img = Image.open(io.BytesIO(response.content)).convert('RGB')
            
            img = img.resize((1280, 720), Image.LANCZOS)
            frames.append(img)
            print(f"Success: image_{i}")
        except Exception as e:
            print(f"Error loading image {i}: {e}")

    if not frames:
        return jsonify({'error': 'Could not process images'}), 500

    print(f"Total frames: {len(frames)}")

    temp_dir = tempfile.mkdtemp()
    output_path = os.path.join(temp_dir, f"video.gif")
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=2000,
        loop=0
    )

    return send_file(output_path, mimetype='image/gif', as_attachment=True, download_name=f"{menu_name}.gif")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)