import React, { Component } from 'react';
import Header from './component/Header';
import MyMaps from './component/MyMaps';
import CountDays from './component/CountDays';
import CollectBox from './component/CollectBox';
import SmImage from './component/SmImage';

import {getPosition} from './common/Tools';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state ={
      marks:[
        {
          key: 0,
          name: '東引燈塔',
          lat: 26.366439,
          lng: 120.510599,
          img: '0021.jpg',
          intro: '傳說中的東引燈塔，這裡是下午跑步必跑的地方！',
          btnClick: this._btnClick,
        },
        {
          key: 1,
          name: '國之北疆',
          lat: 26.383417,
          lng: 120.476169,
          img: '0004.jpg',
          intro: '第一次島休，和同梯一起去探索未知的地方！傳說這是台灣最北邊的地方！',
          btnClick: this._btnClick,
        },
        {
          key: 2,
          name: '一線天',
          lat: 26.366360,
          lng: 120.505458,
          img: '0007.jpg',
          intro: '往等塔方向跑去，順路下來看美美的風景！都是無可取代的回憶！',
          btnClick: this._btnClick,
        },
        {
          key: 3,
          name:
          '三山據點',
          lat: 26.373252,
          lng: 120.470686,
          img: '0011.jpg',
          intro: '說跑就跑，環島任務現在開始，從東引跑到西引，最遠的地方！',
          btnClick: this._btnClick,
        },
      ],
      smImageData : {
        key: 1,
        name: '國之北疆',
        lat: 26.383417,
        lng: 120.476169,
        img: '0004.jpg',
        intro: '第一次島休，和同梯一起去探索未知的地方！傳說這是台灣最北邊的地方！',
        btnClick: this._btnClick,
      },
    }
  }
  _btnClick = (obj, position="") =>{
    this.setState({
      smImageData: obj,
    })
    document.querySelector('.copyImgBox').style.left = `${position.x}px`
    document.querySelector('.copyImgBox').style.top = `${position.y}px`

    let BoxPosition = getPosition(document.querySelector('.tubBody'))


    const copyImgBox = {
      dom: document.querySelector('.copyImgBox'),
      startPosition: {
        x: Number(document.querySelector('.copyImgBox').style.left.replace('px', '')),
        y: Number(document.querySelector('.copyImgBox').style.top.replace('px', '')),
      },
      endPosition: {
        x: BoxPosition.x,
        y: BoxPosition.y,
      }
    }
    this.MoveAnimation(copyImgBox)
    
    
  }
  MoveAnimation = (obj) => { 
    let time = 0;
    obj.dom.style.left = obj.startPosition.x + 'px'
    obj.dom.style.top = obj.startPosition.y + 'px'
    obj.dom.style.display = 'block'

    const domStyle = obj.dom.style
    const para = {
      x : obj.startPosition.x > obj.endPosition.x ? -1 : 1,
      y : obj.startPosition.y > obj.endPosition.y ? -1 : 1,
    }
    

    const motion = t =>{
      const moving = (t - time)/1000
      const movingStatus = {x: true, y: true}
      if(para.x===1){
        if(Math.round(Number(domStyle.left.replace('px',''))) <= obj.endPosition.x ) {
          domStyle.left = Number(domStyle.left.replace('px','')) + (moving)*para.x + 'px'
        }else{
          movingStatus.x = false
        }
      }else{
        if(Math.round(Number(domStyle.left.replace('px',''))) >= obj.endPosition.x ) {
          domStyle.left = Number(domStyle.left.replace('px','')) + (moving)*para.x + 'px'
        }
        else{
          movingStatus.x = false
        }
      }
      
      if(para.y===1){
        if(Math.round(Number(domStyle.top.replace('px',''))) <= obj.endPosition.y) {
          domStyle.top = Number(domStyle.top.replace('px','')) + (moving)*para.y + 'px'
        }else{
          movingStatus.y = false
        }
      }else{
        if(Math.round(Number(domStyle.top.replace('px',''))) >= obj.endPosition.y ) {
          domStyle.top = Number(domStyle.top.replace('px','')) + (moving)*para.y + 'px'
        }else{
          movingStatus.y = false
        }
      }

      // stop motion
      if(movingStatus.x===false && movingStatus.y===false) return false
      requestAnimationFrame(motion)
    }
    motion(time)
  }
  render() {
    return (
      <div className="container">
        <Header title={"My googleMaps example"} />
        <CountDays />
        <MyMaps
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `800px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          zoom={14}
          defaultCenter={ {lat: 26.367554, lng: 120.487424} }
          marks={this.state.marks}
        />
        <SmImage data={this.state.smImageData} />
        
        <CollectBox />
      </div>
    );
  }
}

export default App;
