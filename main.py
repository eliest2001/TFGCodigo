import json
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
import string
import random
import re

with open("classes.json", "r",encoding="utf8") as f:
    classes = json.load(f) 
cfound = set()  
 
def comparadorSimilaridad(sentencia,clase,nlp,v,vent):
    listaClase=classes[clase]["samples"]
    listaSentencias=[]

    for lineaSentencias in sentencia:
        words = lineaSentencias.split()
        if len(words) < vent:
            listaSentencias.append(words)
        else:
            for i in range(0,len(words)- vent):
                listaSentencias.append(words[i:i+vent])

    for linea1 in listaClase:
        for elemento in listaSentencias:
            linea2 =(" ").join(elemento)
            doc1 = nlp(linea1)
            doc2 = nlp(linea2)
            if doc1.vector_norm:
                num = doc1.similarity(doc2)
            if num >= v:
                print(clase)
                cfound.add(int(clase))
    
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
        
def getclasses(lineas):
    nlp = spacy.load("es_core_news_md") 
    prepareClasses(classes)
    filteredLines = []  
    stop_words = set(stopwords.words('spanish'))  
    for l in lineas:
        ws = []
        for w in l.split():
            if w not in stop_words:
                ws.append(w)
        x = " ".join(ws)
        filteredLines.append(x) 
    for clase in classes:
        comparadorSimilaridad(filteredLines,clase,nlp,0.77,8)
    
    print(cfound)    
    sol = []
    for i in cfound:
        sol.append(random.choice(classes[str(i)]["template"]))
    return sol 

def getInicio():
    return "¿Qué es este documento?\nEste documento es la adaptación a lectura fácil de la sentencia de un juez sobre la modificación judicial de tu capacidad.\n\nEste es un documento informativo que no tiene validez legal.\nLa validez legal la tiene la sentencia original.\n\nEn esta sentencia un juez ha decidido que hay diferentes situaciones en tu vida en las que necesitas el apoyo de un tutor, para proteger tus intereses y tus derechos.\n\nEsta sentencia es para protegerte y apoyarte en tus decisiones."

    
def getFinal():
    return "¿Qué pasa si no estoy de acuerdo con esta sentencia?\nSi no estás de acuerdo con esta sentencia puedes intentar cambiarla.\nTienes que hacer un recurso de apelación.\nPara redactar el recurso puedes pedir ayuda a tu abogado y procurador.\nPara entregar el recurso tienes de plazo 20 días hábiles, desde que el juez comunique esta sentencia.\nAntes de presentar el recurso debes pagar 50 euros en la cuenta de consignaciones del juzgado que te envía esta sentencia."

def funcCurPluFam(f,nombre):
   return [f"Para apoyarte en estas situaciones, aunque seas mayor de edad, el Juez ha decidido que tus {f}{nombre} te apoyen en tus decisiones.",
f"Tus {f} te apoyarán en las situaciones que te hemos explicado."]

def funcCurSingFam(f,nombre):
   return [f"Para apoyarte en estas situaciones, aunque seas mayor de edad, el Juez ha decidido que tu {f}{nombre} te apoye en tus decisiones.",
f"Tu {f} te apoyará en las situaciones que te hemos explicado."]


def funcCurEnt(nombre):
   return [f"Para apoyarte en estas situaciones, aunque seas mayor de edad, el Juez ha decidido que sea tu tutor la{nombre}.",
f"La{nombre} te apoyará en las situaciones que te hemos explicado."]

def funcSoloNombre(nombre):
    return [f"Para apoyarte en estas situaciones, aunque seas mayor de edad, el Juez ha decidido que sea tu tutor{nombre}."
,f"{nombre[1:]} te apoyará en las situaciones que te hemos explicado."]
    
def funcSoloNombrePlu(nombre):
    return [f"Para apoyarte en estas situaciones, aunque seas mayor de edad, el Juez ha decidido que sean tus tutores{nombre}.",
f"{nombre[1:]} te apoyarán en las situaciones que te hemos explicado."]

   
 
def getCurador(texto):
    patrones = [
    r"(curador|curadora|régimen de curatela|régimen de tutela), (cargo que|que) (desempeñará|será|será nombrado|será designado)",
    r"régimen de tutela y designando como ",
    r"rehabilitada la patria potestad (de la|del) (demandada|demandado) en favor de",
    r"Se nombra tutor a",
    r"Se adopta como (MEDIDA DE APOYOnombrar|MEDIDA DE APOYO|MEDIDA DE APOYOla) (a|la rehabilitación de la patria potestad de|rehabilitación de la patria potestadde)"
    ]
    nlp = spacy.load("es_core_news_md")
    for patron in patrones:
        match = re.search(patron, texto)
        if match:
                        
            textorelevante = texto[texto.find(match.group(0))+len(match.group(0))+1:]
            doc = nlp(textorelevante)
                
            with doc.retokenize() as retokenizer:
                for ent in doc.ents:
                    retokenizer.merge(ent)
            if match.group() != "régimen de tutela y designando como":            
                nombre = f" {doc[:15].ents[0].text}"
                if "Poss" in doc[0].morph.to_dict() and doc[0].morph.to_dict()["Poss"] == "Yes": #Si es posesivo es familia
                    
                    if "Number" in doc[0].morph.to_dict() and doc[0].morph.to_dict()["Number"] == "Sing":
                    
                        r =funcCurSingFam(doc[1],nombre)
                    else:
                    
                        r =funcCurPluFam(doc[1],nombre)      
                        
                elif doc[0].text == "la":
                    r =funcCurEnt(nombre)
                else:
                    r =funcSoloNombre(nombre)
                return r       
                 
            else: 
                for ent in doc.ents:
                    print(ent.text,ent.label)
                nombre = f" {doc[:15].ents[0].text}"
                print(nombre)
                print(doc[0].text)
                if doc[0].text == "tutor" or doc[0].text == "tutora":
                    return funcSoloNombre(nombre)
                else:
                    return funcSoloNombrePlu(nombre)
                    
                    
                    
                
                
                 
                
                        
            
                
                
        
  
    


   
