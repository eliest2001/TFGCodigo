import re
import PyPDF2
def getFallo(pdf,splitted):    
    pdf_reader = PyPDF2.PdfReader(pdf)

    
    text = ""
    for page in range(len(pdf_reader.pages)):
        page_text = pdf_reader.pages[page].extract_text().split("\n")
        
        # Excluir encabezado y pie de página basado en la ubicación
        content_text = page_text[1:-1]
        text += "\n".join(content_text)

   
    start_pos = text.find("F A L L O")
    if start_pos == -1:
        start_pos = text.find("FALLO")
        if start_pos == -1:
            print("No se encontró el string 'F A L L O' en el PDF.")
            exit()

    
    frasesFin = ["Los actos jurídicos realizados sin la","Sin hacer pronunciamiento", "Firme esta resolución", "Firme que sea esta resolución", "Una vez firme esta resolución", "notifíquese al Registro Civil" , "Modo de Impugnación", "MODO DE IMPUGNACIÓN", "veinte días" , "VEINTE DÍAS"]    
    minEndPos = 0

    for i in frasesFin:
        endpos = text.find(i,start_pos)
        if endpos != -1:
            if minEndPos == 0:
                minEndPos = endpos
            else:
                if endpos < minEndPos:
                    minEndPos = endpos        


    if minEndPos == 0:
        output = text[start_pos+9:]
    else:
        output = text[start_pos+9:minEndPos]
        
    if splitted: 
        lines = output.split("\n")
    else:
        lines = output
        lines = re.sub(r"\n", " ", lines)
        lines = re.sub(r"\s+", " ", lines).strip()
       
    return lines

    
        
    
if __name__ == "__main__":
    getFallo("SJPI_129_2020.pdf",True)
    getFallo("SJPI_129_2020.pdf",False)