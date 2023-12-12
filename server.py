from flask import Flask, request
from flask_cors import CORS
from PDFSplitter import getFallo
from main import getclasses, getCurador
app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/checkpdf", methods=["POST"])
def checkpdf():
    print("pdf recibido")
    if 'pdf' not in request.files:
        return 'No PDF file uploaded', 400
    
    pdf_file = request.files['pdf']
    
    getFallo(pdf_file,True)

    return 'PDF file uploaded successfully'

@app.route("/simplify", methods=["POST"])
def simplify():
    if 'pdf' not in request.files:
        return 'No PDF file uploaded', 400
    
    pdf_file = request.files['pdf']
    x = getclasses(getFallo(pdf_file,True))
    y = getCurador(getFallo(pdf_file,False))
    
    dictRes = {}
    dictRes["Clases"] = x
    dictRes["Curatela"] = y
    return dictRes

if __name__ == '__main__':
    app.run()    