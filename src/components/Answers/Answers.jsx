import React from "react";
import parse from "html-react-parser";

import "./Answers.css";

class Answers extends React.Component {
  constructor(props) {
    super(props);

    this.view = "";
    this.answers = [];
  }

  render() {
    if (!this.props.noAnswer) {
      if (typeof(this.props.correctAnswer) === "object") {
        this.view = "checkbox";
        this.answers = [
          ...this.props.incorrectAnswers,
          ...this.props.correctAnswer,
        ];
      } else {
        this.view = "radio";
        this.answers = [
          ...this.props.incorrectAnswers,
          this.props.correctAnswer,
        ];
      }

      //Перемешивание вариантов ответов
      for (var i = this.answers.length - 1; i > 0; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = this.answers[num];
        this.answers[num] = this.answers[i];
        this.answers[i] = d;
      }
    }

    return (
      <div className="answers">
        {this.answers.map((item, index) => (
          <label className="answer" key={index}>
            <input
              name="Answers"
              type={this.view}
              value={item}
              ref={"r" + index}
            />
            &nbsp;
            {parse(item)}
          </label>
        ))}
      </div>
    );
  }
}

export default Answers;
