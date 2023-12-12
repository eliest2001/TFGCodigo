import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
var data = require('../classes.json')

const NestedDropdown = ({onSelect}) => {
  const [selectedKey, setSelectedKey] = useState(null)
  const [selectedName, setSelectedName] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleNameSelect = (name,key) => {
    setSelectedKey(key)
    setSelectedName(name);
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (templateIndex) => {
    setSelectedTemplate(templateIndex);
    onSelect(data[selectedKey].template[templateIndex])
    setSelectedName(null);
    
  };

  return (
    <div className='mb-3'>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="name-dropdown-toggle">
          {selectedName ? selectedName : 'Añadir Situación'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {Object.keys(data).map((key) => (
            <Dropdown.Item key={key} onClick={() => handleNameSelect(data[key].name,key)}>
              {data[key].name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {selectedName && (
        <Dropdown className="mt-2">
          <Dropdown.Toggle variant="primary" id="template-dropdown-toggle">
            {selectedTemplate !== null ? 'Template seleccionado' : 'Selecciona una frase'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {data[selectedKey].template.map((phrase, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => handleTemplateSelect(index)}
              >
                {phrase}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

export default NestedDropdown;
