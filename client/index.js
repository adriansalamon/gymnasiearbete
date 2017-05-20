import React, { Component } from "react";
import { render } from "react-dom";
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";
import "whatwg-fetch";

const listStyle = {
  backgroundColor: "#f3f3f3",
  border: "1px solid #efefef",
  borderRadius: "3px",
  marginBottom: "0.8em"
};

const listItemStyle = {
  backgroundColor: "#fff",
  margin: "0",
  listStyleType: "none",
  padding: "12px 20px",
  borderBottom: "1px solid #efefef"
};

const buttonStyle = {
  float: "right"
};

const SortableItem = SortableElement(({ value, number }) => (
  <li style={listItemStyle}>{value}</li>
));

const SortableList = SortableContainer(({ items }) => {
  return (
    <ul style={listStyle}>
      {items.map((value, index) => (
        <SortableItem
          key={`item-${index}`}
          index={index}
          value={value.name}
          number={index}
        />
      ))}
    </ul>
  );
});

class SortableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        { name: "Socialdemokraterna", index: 0 },
        { name: "Moderaterna", index: 1 },
        { name: "Sverigedemokraterna", index: 2 },
        { name: "Centerpartiet", index: 3 },
        { name: "Vänsterpartiet", index: 4 },
        { name: "Liberalerna", index: 5 },
        { name: "Miljöpartiet", index: 6 },
        { name: "Kristdemokraterna", index: 7 },
        { name: "Feministiskt initiativ", index: 8 }
      ]
    };
    this.onSortEnd = ({ oldIndex, newIndex }) => {
      this.setState({
        items: arrayMove(this.state.items, oldIndex, newIndex)
      });
    };
  }

  handleClicks = () => {
    let json = { votes: this.state.items.map(item => item.index) };
    if (confirm("Are you sure you want to submit your vote?")) {
      fetch("https://gymnasiearbete.herokuapp.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
      })
        .then(res => {
          window.location = "./done";
        })
        .catch(err => console.log(err));
    } else {
      // Do nothing!
    }
  };

  render() {
    return (
      <div>

        <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
        <button onClick={this.handleClicks} style={buttonStyle}>Submit</button>
      </div>
    );
  }
}

render(<SortableComponent />, document.getElementById("root"));
