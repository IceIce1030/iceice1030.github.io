import React, { Component } from 'react';

class SmImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data});
  }
  render() {
    return (
      <div className="copyImgBox" style={{left: '0px', top: '0px'}}>
        <img src={`/images/dongying/${this.state.data.img}`} alt="" />
      </div>
    );
  }
}

export default SmImage;
