import React, { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import HomePage from './HomePage';
import PDFReader from './PDFReader';
import MarcaUPV from "./Fotos/marca_UPV.png"
import Spinner from 'react-bootstrap/Spinner';
const App = () => {
  const [pdfFile, setPDFFile] = useState(null);
  const [ClasesApi, setClasesApi] = useState([]);
  const [CuratelaApi, setCuratelaApi] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSubmit = async (file) => {
    setPDFFile(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/simplify', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setClasesApi(data.Clases);
        setCuratelaApi(data.Curatela);
      } else {
        console.error('Failed to upload PDF file');
      }
    } catch (error) {
      console.error('Error uploading PDF file', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {!pdfFile ? (
        <HomePage onFileSubmit={handleFileSubmit} />
      ) : (
        <div className="pdf-reader-container">
          {loading ? (
            <div className="container text-center vh-100 d-flex justify-content-center align-items-center">
              <div className='col-auto p-5'>
                <img src={MarcaUPV} height={"400px"} alt="Marca UPV"></img>
                <div className="mt-3">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </div>
            </div>

   
          ) : (
            ClasesApi.length > 0 && (
              <PDFReader pdfURL={pdfFile} clases={ClasesApi} curatela={CuratelaApi} loading={loading} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default App;

