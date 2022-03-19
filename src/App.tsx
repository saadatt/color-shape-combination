import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import ShapeTaskScreen from "./screens/ShapeTaskScreen";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
      <div className="container-lg">
        <Routes>
          <Route path="/" element={<Navigate to="/shape"/>}/>
          <Route path="shape" element={<ShapeTaskScreen/>}/>
        </Routes>
      </div>
  );
}

export default App;
