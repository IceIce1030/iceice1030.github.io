import React, { Component } from 'react';

class CollectBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    }
  }

  // todo
  componentDidMount() {
    setTimeout(()=>{
      this.setState({
        isOpen: false,
      });
    },1000)
  }
  
  
  render() {
    return (
      <div>
        <div className="titleSM bubble">My memory</div>
        <div className="collectBox">
          <div className={this.state.isOpen ? 'tubShell open' : 'tubShell'}></div>
          <div className="tubBody"></div>
        </div>
      </div>
      
    );
  }
}

export default CollectBox;