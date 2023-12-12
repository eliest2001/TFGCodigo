import json
import json
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
from sklearn.metrics import precision_score, recall_score
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


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
    nlp = spacy.load("es_core_news_md")
    with open("classes.json", "r",encoding="utf8") as f:
        classes = json.load(f)
    with open("test.json", "r",encoding="utf8") as f:
        test= json.load(f)
    model = SentenceTransformer('hiiamsid/sentence_similarity_spanish_es')


    Precision = []
    Recall = []
    for item in range(1,9):
        print(f"calculando {item}")
        cfound = set()
                
        lineas = test[item-1]["raw"]
                
        doc = nlp(lineas)
        qweqw = doc.sents
        for oracion in doc.sents:
            if len(oracion) > 3:
                subOrations = []
                for i in range(len(oracion) - 8 + 2):
                    ventana = " ".join([token.text_with_ws for token in oracion[i:i+8]]).strip()
                    subOrations.append(ventana)
                            
                    comparadorSimilaridad(ventana,classes,model, 0.67, 8)
        deseada = set(test[item-1]["hipo"])
        print(f"{item}. Conseguida: {cfound}  Deseada: {deseada}")
        if len(cfound) != 0: 
            pre = len(cfound.intersection(deseada)) / len(cfound)
        else:
            pre = 0
        rec = len(cfound.intersection(deseada)) / len(deseada)

        Precision.append(pre)

        Recall.append(rec)
    print(f"Precisión total: {np.mean(Precision)}")
    print(f"Recall total: {np.mean(Recall)}")           

    