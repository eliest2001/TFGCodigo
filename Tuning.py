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
import logging
logging.getLogger('sentence_transformers').setLevel(logging.WARNING)
logging.getLogger('transformers').setLevel(logging.WARNING)
logging.getLogger('spacy').setLevel(logging.WARNING)


logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(message)s',
                    handlers=[logging.StreamHandler(),
                              logging.FileHandler('outputSpacy.log', 'w', 'utf-8')])

# def detectorNombres(sentencia,nlp):
#     f = open("sentencias/filtradas/" + sentencia, "r")
#     for linea in f:
#         doc=nlp(linea)
#         for ent in doc.ents:
#             if ent.label_ == 'PER':
#                 print(ent.text)

def comparadorSimilaridad(sentencia,classes,nlp,v,vent):
    for cl in classes:
        samples = classes[cl]["samples"]
        doc1  = nlp(sentencia)
        
        for sample in samples:
            doc2 = nlp(sample)
            num = doc1.similarity(doc2)
            if num > v:
                cfound.add(int(cl))
                break


    
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
    nlp = spacy.load("es_core_news_md")
    with open("classes.json", "r",encoding="utf8") as f:
        classes = json.load(f)
    with open("tuning.json", "r",encoding="utf8") as f:
        tuning = json.load(f)
    prepareClasses(classes)

    for v in [0.75,0.77,0.79,0.8]:
        for vent in [7,8,9,10]:
            Precision = []
            Recall = []
            for item in range(1,11):
                cfound = set()
                lineas = getFallo(f"C:/Users/elias/Desktop/tuning_raw/tuning_0{item}/{item}.pdf", False)
                
                doc = nlp(lineas)
                
                for oracion in doc.sents:
                    if len(oracion) > 3:
                        for i in range(len(oracion) - vent + 2):
                            ventana = " ".join([token.text_with_ws for token in oracion[i:i+vent]]).strip()
                        
                            comparadorSimilaridad(ventana,classes,nlp, v, vent)
                deseada = set(tuning[item-1]["classes"])
                #print(f"{item}. Conseguida: {cfound}  Deseada: {deseada}")
                if len(cfound) != 0: 
                    pre = len(cfound.intersection(deseada)) / len(cfound)
                else:
                    pre = 0
                rec = len(cfound.intersection(deseada)) / len(deseada)

                Precision.append(pre)

                Recall.append(rec)
                # print("Precisión: {:.2f}".format(pre))
                # print("Recall: {:.2f}".format(rec))
            logging.info("--------------------")
            logging.info(f"Con treshold: {v}")
            logging.info(f"Con ventana de: {vent}")
            logging.info(f"Precisión total: {np.mean(Precision)}")
            logging.info(f"Recall total: {np.mean(Recall)}")
        # calcData(cfound,i)