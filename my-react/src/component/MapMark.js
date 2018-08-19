import React, {Component} from 'react'
import {
  Marker,
  InfoWindow,
} from "react-google-maps"
import {getPosition} from '../common/Tools';

export default class MapMarks extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      mark: props.mark,
      keep: false,
    }
  }
  handleToggleOpen (open){
    this.setState({
      isOpen: open,
    })
  }
  introBtnClick = (e) =>{
    this.setState({
      keep: this.state.keep ? false : true
    })
    let btn = e.target
    let img = btn.parentNode.parentNode.querySelector('.imgBox > img')

    let imgPosition = getPosition(img);

    this.state.mark.btnClick(this.state.mark, imgPosition)
    
  }
  
  render() {
    return (
      <Marker
        position={{ lat: this.state.mark.lat, lng: this.state.mark.lng }}
        onClick={() => this.handleToggleOpen(true)}
      > 
        {
          this.state.isOpen &&
          <InfoWindow onCloseClick={()=>this.handleToggleOpen(false)}>
            <div className="infoBox">
              <div className="infoTitle">{this.state.mark.name}</div>
                <div className="imgBox">
                  <img src={`/images/dongying/${this.state.mark.img}`} alt={this.state.mark.name} />
                </div>
                <div className="intro">{this.state.mark.intro}</div>
                <div className="btnBox">
                  <div className={this.state.keep? 'active' : ''} 
                    onClick={(e)=>{
                      this.introBtnClick(e)
                    }}
                  >
                  {
                    this.state.keep ? '已收藏':'收藏'
                  }
                  </div>
                </div>
            </div>
          </InfoWindow>
        }
        
      </Marker>
    )
  }
}


