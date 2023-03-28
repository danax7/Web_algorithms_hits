import { useState } from "react";
import "./App.css";
import Clustering from "./components/Clustering/ui/Clustering";

const App = () => {
  return (
    <div className="App">
      <div className="wrapper">
        <Clustering />
      </div>
    </div>
  );
};

export default App;
