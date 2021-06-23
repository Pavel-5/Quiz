import React from "react";
import {Link} from 'react-router-dom';

import "./Home.css";

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Link to="/question"><button className="button">Приступить к опросу</button></Link>
      </div>
    );
  }
}

export default Home;
