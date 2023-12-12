import React, { useState } from 'react';

import { BiLoaderAlt } from 'react-icons/bi';
import OrderedListItem from './components/OrderedListItem';
import Button from 'react-bootstrap/Button';
import NestedDropdown from './components/PanelSituaciones';
import PDFDocument from './components/PDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Stack from 'react-bootstrap/Stack';

const splitLongText = (text) => {
  const words = text.split(" ");
  let lines = [];
  let line = "";

  for (const word of words) {
    if (line.length + word.length + 1 <= 44) {
      line += (line ? " " : "") + word;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
};

const DocumentTitle = ({ text }) => (
  <p className="Titulo">
    <strong >{text}</strong>
  </p>
);

const SectionTitle = ({ text }) => (
  <p className="SectionTitle">
    <strong style={{alignSelf: "center",marginRight:"5px", textDecoration: "underline"}}>{text}</strong>
  </p>
);

const Paragraph = ({ children }) => <p>{children}</p>;

const Br = () => <br />;

const SupportSituationList = ({ situations, editMode, onDelete }) => {
  console.log("ahiva")
  console.log(situations)

  return (
    <ol id="listaClases">
      {situations.map((situation, index) => (
        <OrderedListItem key={index} text={situation} index={index} editMode={editMode} onDelete={onDelete}/>
      ))}
    </ol>
  );
};



const SupportPerson = ({ element }) => (
  <div>

        {splitLongText(element).map((line, lineIndex) => (
          <p key={lineIndex}>
          
            {line}
            <br />
          </p>
        ))}
      </div>

);



const PDFReader = ({ pdfURL, clases, curatela, loading }) => {
  console.log(curatela)
  const [editMode, setEditMode] = useState(false); // Track edit mode
  const [arrSituations, setarrSituations] = useState(clases)

  const handleDeleteItem = (index) => {
    const newSituations = [...arrSituations];
    newSituations.splice(index, 1);
    setarrSituations(newSituations);
  };

  const handlePhraseSelect = (phrase) => {
    const newSituations = [...arrSituations];
    newSituations.push(phrase)
    setarrSituations(newSituations);
  };
  const downloadPDF = () => {
    console.log("clik")
  }
  console.log(arrSituations)
  // Toggle edit mode
  const toggleEditMode = () => {
    // setarrSituations(clases)
    setEditMode(!editMode);
  };

  console.log(typeof(arrSituations),"valor")

  return (
    <div className="pdf-reader  d-flex" style={{fontFamily:"Arial",fontSize:"23px" ,height: '100vh'}}>
      <div className="col-md-6 p-3 bg-light pdf-side" style={{ height: '100%' }}>
        {pdfURL ? (
          <embed src={pdfURL} type="application/pdf" width="100%" height="100%" />
        ) : (
          <p>No PDF selected</p>
        )}
      </div>
      <div className="col-md-6 overflow-auto text-side" style={{ height: '100%' }}>
        {loading ? (
          <div className="">
            <BiLoaderAlt className="animate-spin text-gray-500" size={32} />
            
          </div>
        ) : (
          <html id='printDoc' >
          <Stack direction="horizontal" gap={2} className='bg-light'>
            <div className="p-2">
            <Button variant="primary" onClick={toggleEditMode}  style={{marginLeft : "10px"}}>
              {editMode ? 'Salir de Modo Edicion' : 'Editar Situaciones'}
            </Button>{' '}
            </div>
            <div className="p-2 ms-auto">
            <PDFDownloadLink document={<PDFDocument arrSituations={arrSituations} curatela={curatela}/>} fileName='sentencia2'>
              <Button variant="primary"   style={{marginRight : "10px"}}>
                  Descargar
              </Button>{' '}
            </PDFDownloadLink>
            </div>
          </Stack>
          <div className="page" style={{marginLeft:"30px", marginTop:"30px"}}>

            <DocumentTitle text="Fallo de la sentencia de MODIFICACIÓN DE CAPACIDAD" />
            <DocumentTitle text="Versión en lectura fácil" />

            <SectionTitle  text="¿Qué es este documento?" />
            <Paragraph>
              <Br/>
              Este documento es la adaptación a lectura fácil
              <Br/>
              de la sentencia de un juez
              <Br/>
              sobre la modificación judicial de tu capacidad.
            </Paragraph>

            <Paragraph>
              <Br/>
              En esta sentencia un juez ha decidido
              <Br/>
              que hay diferentes situaciones en tu vida
              <Br/>
              en las que necesitas apoyos
              <Br/>
              para proteger tus intereses y tus derechos
            </Paragraph>

            <Paragraph>
              <Br/>
              Esta sentencia es para protegerte
              <Br/>
              y apoyarte en tus decisiones.
            </Paragraph>

            
          </div>
          
          <div className="page" style={{marginLeft:"30px"}}>
            <div className='situacionesGridTitle d-flex '>
              <SectionTitle text="Situaciones en las que necesitas apoyo, según el Juez:" /> 
           
            </div>
            <div  style= {{display : 'flex'}}>
             
             
              <SupportSituationList situations={arrSituations} editMode={editMode} onDelete={handleDeleteItem}/>
                

              
             
              

            </div>
            {editMode && (<NestedDropdown onSelect={handlePhraseSelect}></NestedDropdown>)}

          </div>
          
          <div className="page" style={{marginLeft:"30px"}}>
         
            <SectionTitle text="Quién te apoyará en estas situaciones, según la Juez." /> 

            <Paragraph>
              <Br/>
              <SupportPerson className ="Curatela" element={curatela[0]} />
            </Paragraph>
            <Paragraph>
            <Br/>
              <SupportPerson element={curatela[1]} />
            </Paragraph>
            
            <SectionTitle  text="¿Qué pasa si no estoy de acuerdo con esta sentencia?" />

            <Paragraph>
              <Br/>
              Si no estás de acuerdo con esta sentencia
              <Br/>
              puedes intentar cambiarla.
            </Paragraph>

            <Paragraph>
              <Br/>
              Tienes que hacer un recurso de apelación.
              <Br/>
              Para redactar el recurso puedes pedir ayuda
              <Br/>
              a tu abogado y procurador.
              <Br/>
              Para entregar el recurso
              <Br/>
              tienes de plazo 20 días hábiles,
              <Br/>
              desde que el juez comunique esta sentencia.
            </Paragraph>

            <Paragraph>
              <Br/>
              Antes de presentar el recurso
              <Br/>
              debes pagar 50 euros
              <Br/>
              en la cuenta de consignaciones del juzgado
              <Br/>
              que te envía esta sentencia
            </Paragraph>
          </div>

        </html>  
        )}
      </div>
    </div>
  );
};



export default PDFReader;