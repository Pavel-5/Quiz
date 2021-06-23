import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Question from "../Question/Question.jsx";
import Home from "../Home/Home.jsx";
import Header from "../Header/Header.jsx";

import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.categoryId = -1;
		this.count = 10;
  }

  changeCategory(event) {
    this.categoryId = event.value;
  }

	changeCount(event) {
		this.count = (event.target.value === "") ? 10 : Number(event.target.value);
		if (this.count <= 0) this.count = 10;
		if (this.count > 50) this.count = 50;
	}

  render() {
    const { history } = this.props;

    return (
      <div className="app">
        <Header
          categoryId={this.categoryId}
          changeCategory={this.changeCategory.bind(this)}
					changeCount={this.changeCount.bind(this)}
        ></Header>
        <Switch>
          <Route
            history={history}
            path="/question"
            render={(props) => (
              <Question {...props} count={this.count} categoryId={this.categoryId} />
            )}
          />
          <Route history={history} path="/" component={Home} />
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
