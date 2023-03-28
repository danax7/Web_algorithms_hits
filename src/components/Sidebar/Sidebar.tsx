import { react } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Sidebar = () => {
  return (
    <Router>
      <div>
        <Route exact path="/" component={MainContainer} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </div>
    </Router>
  );
};

export default Sidebar;
