import React from "react";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

import Answers from "../Answers/Answers.jsx";
import Results from "../Results/Results.jsx";

import "./Question.css";
import back from "../../img/back1.png";

class Question extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true, //Идет ли запрос к серверу
      number: 0, //Номер вопроса
      titleButton: "Следующий вопрос",
      completed: false, //Перейти к результатам
      noAnswer: false, //Нужна, чтобы следить, нажал ли пользователь хоть на какой то ответ
      messageError: "",
    };

    this.userAnswers = [];
    this.token = "";
    this.questions = [];
    this.quantityRightAnswers = 0;
    this.controller = new AbortController();

    this.getToken();
  }

  getToken() {
    //Получение токена
    fetch("https://opentdb.com/api_token.php?command=request")
      .then((response) => response.json())
      .then((data) => {
        this.token = data.token;

        this.getQuestions();
      })
      .catch((err) => {
        this.setState({
          messageError:
            "Не удалось получить ответ от сервера. Попробуйте снова.",
        });
      });
  }

  getQuestions() {
    //Получение списка вопросов
    if (this.state.messageError == "") {
      let url =
        "https://opentdb.com/api.php?amount=" +
        this.props.count +
        "&token=" +
        this.token;

      if (this.props.categoryId != -1)
        url += "&category=" + this.props.categoryId;

      this.setState({
        loading: true,
      });

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          switch (data.response_code) {
            case 0:
              this.questions = data.results;
              break;
            case 1:
              this.setState({
                messageError:
                  "Недастаточно вопросов в базе для вашего запроса. Поменяйте категорию или поставьте меньшее количество вопросов.",
              });
              break;
            case 2:
              this.setState({
                messageError: "Произошла ошибка. Попробуйте снова.",
              });
              break;
            case 3:
              this.setState({
                messageError: "Произошла ошибка. Попробуйте снова.",
              });
              // this.getToken();
              break;
            case 4:
              this.setState({
                messageError: "Произошла ошибка. Попробуйте снова.",
              });
              // this.getToken();
              break;
          }

          this.setState({
            loading: false,
          });
        })
        .catch((err) => {
          this.setState({
            messageError:
              "Не удалось получить ответ от сервера. Попробуйте снова.",
          });
        });
    }
  }

  nextQuestion() {
    let refs = this.refs.Answer.refs;
    let correctAnswer = this.questions[this.state.number].correct_answer;

    //Записываем ответы пользователя
    for (let key in refs) {
      if (refs[key].checked === true)
        this.userAnswers[this.state.number] != null
          ? this.userAnswers[this.state.number].push(refs[key].value) //Так как может быть несколько правильных ответов на один вопрос
          : (this.userAnswers[this.state.number] = [refs[key].value]);
    }

    //Проверка, нажал ли пользователь хоть на какой то ответ
    if (this.userAnswers[this.state.number] != null) {
      if (this.state.number === this.props.count - 2) {
        this.setState({
          number: this.state.number + 1,
          titleButton: "Закончить опрос",
          noAnswer: false,
        });

        //Скидываем radio buttons
        for (let key in refs) {
          refs[key].checked = false;
        }
      } else if (this.state.number < this.props.count - 2) {
        this.setState({
          number: this.state.number + 1,
          noAnswer: false,
        });

        //Скидываем radio buttons
        for (let key in refs) {
          refs[key].checked = false;
        }
      } else {
        //Вопросы закончились
        this.setState({
          completed: true,
        });
      }

      //Количество правильных ответов
      if (this.refs.Answer.view === "radio") {
        //Если правильный ответ только один

        if (this.userAnswers[this.state.number][0] === correctAnswer)
          this.quantityRightAnswers++;
      } else {
        //Если правильных ответов несколько

        if (
          correctAnswer.length == this.userAnswers[this.state.number].length
        ) {
          let flag = false;

          for (let i = 0; i < correctAnswer.length; i++) {
            flag = false;

            this.userAnswers[this.state.number].forEach((item) => {
              if (correctAnswer[i] === item) flag = true;
            });

            //Если какого то правильного ответа нет в ответах пользователя, то выходим из цикла
            if (!flag) break;
          }

          //Если мы вышли заранее из цикла, то flag = false
          if (flag) this.quantityRightAnswers++;

          //Ответ пользователя считается верным, только если все его ответы совпали с правильными
        }
      }
    } else {
      this.setState({
        noAnswer: true,
      });
    }
  }

  render() {
    let div;

    if (this.state.messageError !== "") {
      div = (
        <div>
          <div className="messageError">{this.state.messageError}</div>
        </div>
      );
    } else if (this.state.loading)
      div = <div className="loading">Loading...</div>;
    else {
      if (this.state.completed) {
        div = (
          <Results
            questions={this.questions}
            quantityRightAnswers={this.quantityRightAnswers}
            count={this.props.count}
            userAnswers={this.userAnswers}
          ></Results>
        );
      } else
        div = (
          <div className="question">
            <div className="params">
              <div className="difficulty">
                Сложность:&nbsp;{this.questions[this.state.number].difficulty}
              </div>
              <div className="number">
                {this.state.number + 1}&nbsp;из&nbsp;{this.props.count}
              </div>
            </div>
            <div className="topic">
              {parse(this.questions[this.state.number].question)}
            </div>
            <Answers
              correctAnswer={this.questions[this.state.number].correct_answer}
              incorrectAnswers={
                this.questions[this.state.number].incorrect_answers
              }
              noAnswer={this.state.noAnswer}
              ref="Answer"
            ></Answers>
            {this.state.noAnswer ? (
              <div className="noAnswer">
                Ответьте на вопрос, чтобы продолжить
              </div>
            ) : (
              ""
            )}
            <button
              className="next-question"
              onClick={this.nextQuestion.bind(this)}
            >
              {this.state.titleButton}
            </button>
          </div>
        );
    }

    return (
      <div className="questions">
        <Link to="/">
          <img className="back" src={back} title="На главную"></img>
        </Link>
        {div}
      </div>
    );
  }
}

export default Question;
