import React from 'react';
import {Page, Text, Document, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

import LecturaFacil from "../Fotos/LecturaFacil.png"
import Sentencia from "../Fotos/sentencia.png"
import Modificacion  from "../Fotos/Modificacion.png"
import Ministerio from "../Fotos/Ministerio.png"
import Recurso from "../Fotos/RecursoApelacion.png"
import Procurador from "../Fotos/Procurador.png"
import DiasHabiles from "../Fotos/DiasHabiles.png"
import CuentaConsignacion from "../Fotos/CuentaConsignacion.png"
import Arial from "../fuentes/arial.ttf"
import ArialBold from "../fuentes/arial_bold.ttf"


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

Font.register({ family: 'Arial', fonts: [
  { src: Arial},
  { src: ArialBold, fontWeight: 700  },
 ]});

// Define estilos usando StyleSheet
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: '20px',
  },
  containerInicio: {
    display: 'flex',
    justifyContent : "center",
    flexDirection: 'row',
    alignItems: 'center', // Alinea los elementos horizontalmente en el centro
  },
  title: {
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '10px',
  },
  sectionTitle: {
    textDecoration: 'underline',
    alignSelf: 'center',
    marginRight: '5px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  paragraph: {
    marginBottom: '11px',
  },
  supportPerson: {
    marginBottom: '10px',
  },
  prueba : {
    alignSelf: "center",
    fontSize: "14px"  ,
    fontFamily: "Arial",
    fontWeight: "bold"
  },
  containerParte: {
    marginTop:"15px",
    marginLeft:"12px",
    display: 'flex',
    flexDirection: 'row',
    lineHeight:"2px"
     // Alinea los elementos horizontalmente en el centro
  },
  containerSituaciones: {
    marginTop:"15px",
    marginLeft:"50px",
    display: 'flex',
    flexDirection: 'column',
    lineHeight:"2px"
     // Alinea los elementos horizontalmente en el centro
  },
  containerParteFinal: {
    marginTop:"15px",
    marginLeft:"40px",
    display: 'flex',
    flexDirection: 'row',
    lineHeight:"2px"
     // Alinea los elementos horizontalmente en el centro
  },

});

const PDFDocument = ({ arrSituations, curatela }) => (

    <Document>
      <Page size={"A4"} style= {styles.page} >
        <View>
          <View style= {styles.containerInicio}>
            <View>
              <Text style={styles.prueba}>
                  Fallo de la sentencia de MODIFICACIÓN DE CAPACIDAD
                  {'\n'}
                  {'\n'}
                  Versión en lectura fácil
              </Text>              
            </View>
            <View>
              <Image src={LecturaFacil} style={{width: "100px", marginLeft: "4px"}}/>
            </View>
          </View>

          <View style= {styles.containerParte}>
            <View>
              <Text style={{fontSize: "13px", textDecoration:"underline"}}>
              {"\n"}
              ¿Que es este documento?</Text>
              <Text style={{fontSize: "13px" }}>

              Este documento es la adaptación a lectura fácil
              {"\n"}
              de la sentencia de un juez
              {"\n"}
              sobre la modificación judicial de tu capacidad.
              {"\n"}
              {"\n"}
              {"\n"}
              En esta sentencia un juez ha decidido
              {"\n"}
              que hay diferentes situaciones en tu vida
              {"\n"}
              en las que necesitas apoyos
              {"\n"}
              para proteger tus intereses y tus derechos
              {"\n"}
              {"\n"}
              {"\n"}
              Esta sentencia es para protegerte
              {"\n"}
              y apoyarte en tus decisiones.
              {"\n"}
              </Text>              
            </View>
            <View style = {{marginTop:"50px",flex: 1, alignItems: "flex-end"}}>
              <Image src={Sentencia} style={{width: "180px", marginRight: "15px", marginBottom: "20px"}}/>
              <Image src ={Modificacion} style={{width: "180px", marginRight: "15px",marginBottom: "20px"}} />
              <Image src ={Ministerio} style={{width: "180px", marginRight: "15px",marginBottom: "20px"}} />
            </View>
          </View>
            </View>
      </Page>
      <Page size={"A4"}>
        
          <View style= {styles.containerSituaciones}>
            <Text style={{fontSize: "13px", textDecoration:"underline"}}>
              {"\n"}
              Situaciones en las que necesitas apoyo, según el Juez:</Text>
              
                {arrSituations.map((situation, index) => {
              const lines = splitLongText(situation); // Utiliza la función para dividir el texto
              
              return (
                  <Text key={index} style={{ fontSize: "13px" }}>
                      {`${index + 1}. `}
                      {lines.map((line, lineIndex) => (
                          <Text key={lineIndex}>
                            {line}
                          {"\n"}
                      </Text>
                  ))}
                  {arrSituations.length>=9 ? "\n\n" : "\n"}                          
                </Text>
              );
            })}     
        
          </View>   
           
      </Page>
      <Page>
      <View>
          <View style= {styles.containerParte}>
            <View>
              <Text style={{fontSize: "13px", textDecoration:"underline", marginLeft:"20px"}}>
              {"\n"}
              Quién te apoyará en estas situaciones, según la Juez.</Text>
              {curatela.map((situation, index) => {
              const lines = splitLongText(situation); // Utiliza la función para dividir el texto

              return (
                  <Text key={index} style={{ fontSize: "13px", marginLeft:"20px" }}>
                      {lines.map((line, lineIndex) => (
                          <Text key={lineIndex}>
                            {line}
                          {"\n"}
                      </Text>
                  ))}
                  
                  {"\n"}                          
                </Text>
              );
            })}  
            <Text style={{fontSize: "13px", textDecoration:"underline", marginLeft:"20px" }}>
              {"\n"}
              ¿Qué pasa si no estoy de acuerdo con esta sentencia?</Text>
              <Text style={{fontSize: "13px", marginLeft:"20px"  }}>

              Si no estás de acuerdo con esta sentencia
              {"\n"}
              puedes intentar cambiarla.
              {"\n"}
              {"\n"}
              Tienes que hacer un recurso de apelación.
              {"\n"}
              Para redactar el recurso puedes pedir ayuda
              {"\n"}
              a tu abogado y procurador.
              {"\n"}
              Para entregar el recurso
              {"\n"}
              tienes de plazo 20 días hábiles,
              {"\n"}
              desde que el juez comunique esta sentencia.
              {"\n"}
              {"\n"}
              Antes de presentar el recurso
              {"\n"}
              debes pagar 50 euros
              {"\n"}
              en la cuenta de consignaciones del juzgado
              {"\n"}
              que te envía esta sentencia
              {"\n"}
              </Text>             
            </View>
            <View style = {{marginTop:"50px",flex: 1, alignItems: "flex-end"}}>
              <Image src={Recurso} style={{width: "180px", marginRight: "15px", marginBottom: "20px"}}/>
              <Image src ={Procurador} style={{width: "180px", marginRight: "15px",marginBottom: "20px"}} />
              <Image src ={DiasHabiles} style={{width: "180px", marginRight: "15px",marginBottom: "20px"}} />
              <Image src ={CuentaConsignacion} style={{width: "180px", marginRight: "15px",marginBottom: "20px"}} />
            </View>
          </View>
            </View>
      </Page>
    </Document>

);


export default PDFDocument;

