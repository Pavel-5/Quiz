import React from "react";

import Category from "../Category/Category.jsx";

import "./Header.css";

class Header extends React.Component {
  render() {
    return (
      <header className="header">
        <div className="title">Опросник</div>
        <div className="choice">
          <label className="label">
            Количество вопросов (max 50):&nbsp;
            <input
              className="count"
              type="text"
              placeholder="10"
              onChange={this.props.changeCount}
              onKeyPress={(e) => {
                if ((e.charCode < 48 || e.charCode > 57) && e.charCode != 8)
                  e.preventDefault();
              }}
            />
          </label>
          <label className="label">
            Категория:&nbsp;
            <Category
              categoryId={this.props.categoryId}
              changeCategory={this.props.changeCategory}
            ></Category>
          </label>
        </div>
      </header>
    );
  }
}

export default Header;
