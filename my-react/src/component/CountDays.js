import React, { Component } from 'react';

class CountDays extends Component {
  constructor(props) {
    super(props)
    const retiredDate = new Date(2015,9,1)
    const retiredStr = `
      ${retiredDate.getFullYear()} /
      ${retiredDate.getMonth() + 1} /
      ${retiredDate.getDate()}
    `
    
    
      
    this.state = {
      retiredDate,
      retiredStr,
      today: this._clockGet(new Date()),
      memoryDate: Math.floor((new Date() - retiredDate)/1000/60/60/24),
    }
  }
  _clockGet(date){
    const weekdays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");
    const dateStr = `
      ${date.getFullYear()} /
      ${date.getMonth() + 1} /
      ${date.getDate()} 
      ${weekdays[date.getDay()] } 
      ${date.getHours().toString().length < 2 ? 0 + date.getHours().toString(): date.getHours() } :
      ${date.getMinutes().toString().length < 2 ? 0 + date.getMinutes().toString(): date.getMinutes()} :
      ${date.getSeconds().toString().length < 2 ? 0 + date.getSeconds().toString(): date.getSeconds()}
    `
    return dateStr;
  }
  componentDidMount() {
    setInterval(()=>{
      this.setState({
        today: this._clockGet(new Date()),
        memoryDate: Math.floor((new Date() - this.state.retiredDate)/1000/60/60/24),
      })
    },1)
  }
  render() {
    return (
      <div className="CountDays">
        <div className="titleMid">東引回憶越陳越香</div>
        <div>現在時間：{this.state.today}</div>
        <div>退伍日期：{this.state.retiredStr}</div>
        <div>累積天數：{`${this.state.memoryDate} 天`}</div>
      </div>
    );
  }
}

export default CountDays;