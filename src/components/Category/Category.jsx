import React from "react";
import Select from 'react-select';

import "./Category.css";

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    fetch("https://opentdb.com/api_category.php")
      .then((response) => response.json())
      .then((data) => {
        data.trivia_categories.unshift({ id: -1, name: "All categories" });
        this.setState({
          categories: data.trivia_categories,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let options = this.state.categories.map((item, index) => {
      return { label: item.name, value: item.id };
    });

    return (
      <Select
        onChange={this.props.changeCategory}
        name="category"
        className="category"
        options={options}
				defaultValue={{label: "All categories", value: -1}}
      />
    );
  }
}

export default Category;
