const customSlider = function({ container = "", containerWidth = "auto", containerHeight = "auto", images = [], initNum = 0, autoPlay = "", speed = 0 ,tools = [] }){
  this.mainContainer = container; // 主要的box
  this.containerWidth = containerWidth; // 內容寬度
  this.containerHeight = containerHeight, // 內容高度
  this.images = images; // 圖片資料
  this.initNum = initNum; // 預設起始顯示
  this.autoPlay = autoPlay; // 自動播放物件
  this.speed = speed; // 動畫速度
  this.tools = tools; // 功能
  this.itemCount = this.images.length;// 總共數量
  this.timeInterval = "";
  this.current_index = 0; // 目前顯示的index
  this.sliderState = false;  // slider 移動狀態
  const _this = this;
  this.show = () =>{
    // 顯示傳入的資料
    console.log(this.mainContainer, this.images, this.autoPlay, this.speed, this.tools);
  };

  // Siblings(遍歷)
  const getChildren = (n, skipMe) =>{
    let r = [];
    for ( ; n; n = n.nextSibling ) 
      if ( n.nodeType == 1 && n != skipMe)
          r.push( n );        
    return r;
  };
  const getSiblings = (n) =>{
    return getChildren(n.parentNode.firstChild, n);
  };

  // 取得index
  const getIndex = (n) =>{
    let r ='';
    let n_list = n.parentNode.firstChild;
    let i = 0;
    for ( ; n_list; n_list = n_list.nextSibling ) {
      if ( n_list.nodeType == 1 && n_list == n){
        r = i;
      }
      if( n_list.nodeType == 1) i++; 
    }
    return r;
  };

  // 幫某東西上class，其他清除
  // active 要加上的element ,className 想新增的class
  const addActiveClass = ({ active, className = 'active' }) =>{
    active.classList.add(className);
    getSiblings(active).forEach((item) =>{
      item.classList.remove(className);
    });
  };

  // (prev or next) return index
  const checkIndex = (path) =>{
    let final = false;
    let moving = 0;
    switch (path) {
      case 'prev':
        this.current_index--;
        if(this.current_index < 0){
          final = 'finalLeft';
          moving =  this.containerWidth * (this.current_index + 1) * (-1);
          this.current_index = this.itemCount - 1;
        } else{
          moving =  this.containerWidth * (this.current_index + 1) * (-1);
        }
      break;
      case 'next':
        this.current_index++;
        if(this.current_index > (this.itemCount - 1)){
          final = 'finalRight';
          moving = this.containerWidth * (this.current_index + 1) * (-1);
          this.current_index = 0;
        } else {
          moving = this.containerWidth * (this.current_index + 1) * (-1);
        }
      break;
    }
    
    SliderMoving(moving, true);

    if(final){
      // 動畫做完要重新移動位置
      if(final === 'finalLeft'){
        // 往左邊到底
        moving = this.itemCount * this.containerWidth * (-1);
      } else if(final === 'finalRight') {
        // 往右到底
        moving = this.containerWidth * (-1);
      } else {
        console.log('final=> error');
        return false;
      }
      setTimeout(() => {
        this.wrap.style.transitionDuration = `${0}ms`;
        this.wrap.style['-webkit-transition-duration'] = `${0}ms`;
        SliderMoving(moving, false);
      }, this.speed);
    }
  };

  // 點擊左右按鈕事件-上一頁 下一頁
  const prevNextTool = function(){
    // 檢查是否是在移動狀態
    if(_this.sliderState){
      return false;
    }
    // 開始移動
    _this.sliderState = true;
    const todo = Array.from(this.classList)[1];
    switch (todo) {
      case 'prev':
        checkIndex('prev');
      break;
      case 'next':
        checkIndex('next');
      break;
    }
  };

  // 點擊dot事件
  const dotTool = function(){
    let _i = getIndex(this);
    _this.current_index = _i;
    let moving =  _this.containerWidth * (_i + 1) * (-1);
    SliderMoving(moving);
  };

  // slider 移動 function (距離)
  const SliderMoving = (moving, transition = true) => {
    this.wrap.style.webkitTransform = `translate3d(${moving}px, 0px, 0px)`;
    this.wrap.style.MozTransform = `translate3d(${moving}px, 0px, 0px)`;
    this.wrap.style.msTransform = `translate3d(${moving}px, 0px, 0px)`;
    this.wrap.style.OTransform = `translate3d(${moving}px, 0px, 0px)`;
    this.wrap.style.transform = `translate3d(${moving}px, 0px, 0px)`;
    if(transition){
      this.wrap.style.transitionDuration = `${speed -10}ms`;
      this.wrap.style['-webkit-transition-duration'] = `${speed- 10}ms`;
      // dot 上色
      let active = document.querySelectorAll(this.mainContainer + ' .slider-pages span')[this.current_index];
      addActiveClass({ active, className: 'active' });
      // 移動結束狀態還原
      setTimeout(() => {
        this.sliderState = false;
      }, speed - 10);
    } else{
      this.sliderState = false;
    } 
  };
  

  // 執行
  this.init = () =>{
    let render = ``;
    let imgRender = '';
    let nnn= 0;
    
    const sliderItemFun = (image) =>{
      let imgCom = ``;
        imgCom += `<li class="slider-item" style="width:${this.containerWidth}px; height:${this.containerHeight}px;>`;
        // 是否有超連結
        if(image.href){
          imgCom += `<a href="${image.href}">`;
        }
        imgCom += `<img src="${image.img}" alt="slider-image" />`;
        // 是否有超連結（結尾）
        if(image.href){
          imgCom += '</a>'
        }
        imgCom +='</li>';
        return imgCom;
    };
    imgRender += sliderItemFun(this.images[this.itemCount - 1]);
    imgRender += this.images.map(image=>{
      return sliderItemFun(image);
    }).join('');
    imgRender += sliderItemFun(this.images[0]);


    // 'pageBtn', 'dotBtn'
    let toolPages = '';
    if(this.tools.indexOf('pageBtn') != -1){
      toolPages = `<div class="slider-tool prev"></div>
                   <div class="slider-tool next"></div>`;
    }
    let toolDots = '';
    if(this.tools.indexOf('dotBtn') != -1){
      let dotSpan = images.map(()=>{
        return '<span></span>';
      }).join('');
      toolDots = `
        <div class="slider-pages">
          ${dotSpan}
        </div>
      `;
    }
    render = `
      <div class="my-slider" style="width:${this.containerWidth}px; height:${this.containerHeight}px;">
       <ul class="slider-wrap" style"width:${(this.itemCount + 2 )+ '00%'}">${imgRender}</ul>
       ${toolPages}
       ${toolDots}
      </div>
    `;
    // 畫面render
    document.querySelector(this.mainContainer).innerHTML = render;
    // 移動的element
    this.wrap = document.querySelector(this.mainContainer + ' .slider-wrap');

    if(toolPages!==''){
      // 註冊click 上一頁 下一頁事件
      const tools = document.querySelectorAll(this.mainContainer + ' .slider-tool');
      tools.forEach((tool)=>{
        tool.addEventListener('click', prevNextTool, false);
      });
    }
    if(toolDots!==''){
      // 設定第 n 個dot上色
      document.querySelectorAll(this.mainContainer + ' .my-slider .slider-pages span')[this.initNum].classList.add('active');
      // 註冊 click page dot
      const dots = document.querySelectorAll(this.mainContainer + ' .slider-pages span');
      dots.forEach((dot)=>{
        dot.addEventListener('click', dotTool, false);
      });
    }

    // 設定初始位置
    const initMoving = this.containerWidth * (-1) * (this.initNum + 1);
    SliderMoving(initMoving, false); 

    // 是否自動輪播
    if(this.autoPlay){
      // 計算auto 次數
      let times = 0;
      // 無限輪播
      const autoPlayFun = () =>{
        this.timeInterval = setInterval(() => {
          times++;
          checkIndex('next');
        }, this.autoPlay.time);
      }
      autoPlayFun();
      // 註冊滑鼠移動到slider事件
      document.querySelector(this.mainContainer).addEventListener('mouseenter', function(){
        clearInterval(_this.timeInterval);
      },false);
      document.querySelector(this.mainContainer).addEventListener('mouseleave', function(){
        autoPlayFun();
      },false);
    }

  };
  // 執行
  this.init();
}



