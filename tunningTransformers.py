import json
import json
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
import string
import random
import re
from test3 import getFallo
from sklearn.metrics import precision_score, recall_score
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import logging
logging.getLogger('sentence_transformers').setLevel(logging.WARNING)
logging.getLogger('transformers').setLevel(logging.WARNING)
logging.getLogger('spacy').setLevel(logging.WARNING)


logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(message)s',
                    handlers=[logging.StreamHandler(),
                              logging.FileHandler('output.log', 'w', 'utf-8')])

def comparadorSimilaridad(sentencia,classes,model,v,vent):
    for cl in classes:
        samples = classes[cl]["samples"]
        sentences = [sentencia]
        for sample in samples:
            sentences.append(sample)
        embeddings = model.encode(sentences)
        sims = cosine_similarity([embeddings[0]], embeddings[1:])
        for sim in range(len(sims)):
            if sims[0][sim] > v:
                cfound.add(int(cl))
    
def prepareClasses(clvar):
    stpw = set(stopwords.words('spanish'))

    for cl in clvar:
        filtWords = []
        for frase in clvar[cl]["samples"]:
            f = ""
            words = frase.split()
            for i in range(len(words)):
                if words[i] not in stpw:
                    if i < len(words) - 1:
                        f+=words[i] + " "
                    else:
                        f+=words[i] 
            filtWords.append(f)
        clvar[cl]["samples"] = filtWords


if __name__=="__main__":
    logging.info("Starting Script")
    nlp = spacy.load("es_core_news_md")
    with open("classes.json", "r",encoding="utf8") as f:
        classes = json.load(f)
    with open("tuning.json", "r",encoding="utf8") as f:
        tuning = json.load(f)
    model = SentenceTransformer('hiiamsid/sentence_similarity_spanish_es')

    for v in [0.61,0.63,0.65,0.67]:
        for vent in [7,8,9,10]:
            Precision = []
            Recall = []
            for item in range(1,11):
                cfound = set()
                lineas = getFallo(f"C:/Users/elias/Desktop/tuning_raw/tuning_0{item}/{item}.pdf", False)
                
                doc = nlp(lineas)
                
                for oracion in doc.sents:
                    if len(oracion) > 3:
                        subOrations = []
                        for i in range(len(oracion) - vent + 2):
                            ventana = " ".join([token.text_with_ws for token in oracion[i:i+11]]).strip()
                            subOrations.append(ventana)
                            
                            comparadorSimilaridad(ventana,classes,model, v, vent)
                deseada = set(tuning[item-1]["classes"])
                print(f"{item}. Conseguida: {cfound}  Deseada: {deseada}")
                if len(cfound) != 0: 
                    pre = len(cfound.intersection(deseada)) / len(cfound)
                else:
                    pre = 0
                rec = len(cfound.intersection(deseada)) / len(deseada)

                Precision.append(pre)

                Recall.append(rec)
                
            logging.info("--------------------")
            logging.info(f"Con treshold: {v}")
            logging.info(f"Con ventana de: {vent}")
            logging.info(f"Precisión total: {np.mean(Precision)}")
            logging.info(f"Recall total: {np.mean(Recall)}")
    
            
        # calcData(cfound,i)