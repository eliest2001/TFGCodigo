import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import MarcaUPV from "./Fotos/marca_UPV.png"
const HomePage = ({ onFileSubmit }) => {
  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];

    
    const formData = new FormData();
    formData.append('pdf', selectedFile);

    try {

      const response = await fetch('http://127.0.0.1:5000/checkpdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        onFileSubmit(selectedFile);
      } else {

        console.error('Failed to upload PDF file');
      }
    } catch (error) {
      console.error('Error uploading PDF file', error);
    }
  };

  return (
    <div className="m-0 vh-100 row justify-content-center align-items-center"> {/* Agrega las clases "container" y "text-center" para centrar */}
    <div className='col-auto p-5 text-center'>
      <img src={MarcaUPV} height={"400px"}></img>
      <h1 className="m-4">Simplificador de Sentencias Judiciales a Lectura Fácil</h1>
   
      <div className="m-3">
      <label htmlFor="pdf-upload" className="btn btn-primary">
            SUBIR PDF
          </label>
          {/* Input oculto para seleccionar archivos */}
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
      
    </div>


      </div>
    </div>
  );
};

export default HomePage;

