import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

import CloseButton from 'react-bootstrap/CloseButton';

var json = require('../classes.json')

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

const getTagForText = (inputText) => {
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        if (json[key].template.includes(inputText)) {
          return json[key].name;
        }
      }
    }
    
  };
  const getColorTagForText = (inputText) => {
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        if (json[key].template.includes(inputText)) {
          return json[key].colorTag;
        }
      }
    }
    return 'defaultColor';
  };

const OrderedListItem = ({ text, index, editMode, onDelete }) => {

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Simple tooltip
    </Tooltip>
  );
  
    const handleDelete = () => {
      console.log(index)
      onDelete(index);
    };

    return (
      <div className='d-flex rounded mb-5 lh-lg'style={editMode ? { backgroundColor: getColorTagForText(text) } : null}
       data-tooltip-id="my-tooltip" data-tooltip-content={getTagForText(text)}
      data-tooltip-place = "right" 
      >
      <li  
     
      >
     
  
        {splitLongText(text).map((line, lineIndex) => (
          <span key={lineIndex}>
            {line}
            <br />
          </span>
        ))}

        

      </li>

      {editMode && (
          <Tooltip id="my-tooltip" />
        )}
      {editMode && (
        <div style={{flex:"1"}}  >
          <CloseButton onClick={handleDelete} style={{float:"right"}} />
        </div>
        )}

 
     

      
      </div>
    );
  };

  export default OrderedListItem;