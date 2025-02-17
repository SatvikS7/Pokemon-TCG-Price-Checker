import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ImageUploader from "./ImageUploader";


const App: React.FC = () => {
  return (
    <div>
      <ImageUploader />
    </div>
  );
};

export default App;
