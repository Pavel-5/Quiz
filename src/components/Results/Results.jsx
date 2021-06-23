import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

import "./Results.css";

class Results extends React.Component {
  render() {
    let difficult = ["easy", "medium", "hard"];

    return (
      <div className="results">
        <h1 className="results__title">Результаты</h1>
        <p className="total">
          Правильных ответов{" "}
          {this.props.quantityRightAnswers + " из " + this.props.count}
        </p>
        <div className="results__answers">
          {difficult.map((diff) => {
            return (
              <div className="difficult" key={diff}>
                <div className="difficult__title">{diff}</div>
                <div className="difficult__main">
                  {this.props.questions.map((item, index) => {
                    if (item.difficulty == diff)
                      return (
                        <div key={index}>
                          <h4 className="difficult__question">
                            Вопрос №{index + 1}
                          </h4>
                          <p className="text">
                            <div className="text__label">Ваш ответ:</div>
                            <ul className="results__list">
                              {this.props.userAnswers[index].map((elem) => (
                                <li>{parse(elem + "<br />")}</li>
                              ))}
                            </ul>
                            <div className="text__label">Правильный ответ:</div>
                            <ul className="results__list">
                              {typeof item.correct_answer === "object" ? (
                                item.correct_answer.map((elem) => (
                                  <li>{parse(elem + "<br />")}</li>
                                ))
                              ) : (
                                <li>{parse(item.correct_answer)}</li>
                              )}
                            </ul>
                          </p>
                        </div>
                      );
                    else return "";
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/">
          <button className="button on-main">На главную</button>
        </Link>
      </div>
    );
  }
}

export default Results;
