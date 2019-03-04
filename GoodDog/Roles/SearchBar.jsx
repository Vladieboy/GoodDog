import React, { PureComponent } from "react";
import { Input, Form, Button, Card } from "reactstrap";

class SearchBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
  }

  handleInputChange = e => {
    this.setState({
      searchQuery: e.target.value
    });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.searchMode !== this.props.searchMode) {
      this.setState({
        searchQuery: this.props.searchMode.query
      });
    }
  }

  render() {
    return (
      <Form
        onSubmit={e => this.props.handleSearchSubmit(e, this.state.searchQuery)}
      >
        <Card>
          <div className="input-group with-focus">
            <Input
              className={this.props.searchMode.active ? "border-right-0" : ""}
              type="text"
              value={this.state.searchQuery}
              placeholder="Search"
              aria-label="Search"
              onChange={this.handleInputChange}
              style={{ margin: "-3px" }}
            />
            {this.props.searchMode.active && (
              <div className="input-group-append">
                <span
                  className="input-group-text text-muted bg-transparent border-left-0"
                  onClick={this.props.handleSearchCancel}
                  style={{
                    margin: "-3px"
                  }}
                >
                  <i className="fas fa-times" />
                </span>
              </div>
            )}
            <div className="input-group-append">
              <Button
                type="submit"
                color="secondary"
                style={{
                  margin: "-3px",
                  marginLeft: "3px"
                }}
              >
                <i className="fas fa-search" />
              </Button>
            </div>
          </div>
        </Card>
      </Form>
    );
  }
}

export default SearchBar;
