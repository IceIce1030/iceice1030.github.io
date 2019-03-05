function customSlide(option) {
  // todo
  // * option[dot ,[prev, next]]

  try {
    var objPara = {
      eleContainer: option.element, // container Dom
      size: {}, // container 高度 寬度
      currentIndex: 0, // 目前頁數
      totalPages: 0, // 總頁數
      slideShow: option.slideShow || false, // 是否自動播放
      animationSpeed: option.animationSpeed || 300, // 動畫滾動速度
      slideshowSpeed: option.slideshowSpeed || 5000, // 滾動間隔時間
      loop: option.loop || false, // 是否循環
      slideInterval: '', // save slide setInterval
      touchDeviation: 50, // 碰觸偏差值
      touchTime: 150, // touch 時間
      movingStatus: false, // 移動狀態
      originTranslate: '', // moving start origin position
      timer: {
        interval: '',
        duration: 0
      } // timer interval
    };
    var $container = $(objPara.eleContainer);
    Object.defineProperty(this, 'objPara', {
      enumerable: true,
      get() {
        return objPara;
      }
    });
    var _this = this;
    // 取得 container 寬度高度
    this.getContainerSize = function() {
      var size = {
        width: $container.outerWidth(),
        height: $container.outerHeight()
      };
      return size;
    };
    // 設定每一頁寬度及高度
    this.setPageSize = function() {
      var totalPage = objPara.loop
        ? objPara.totalPages + 2
        : objPara.totalPages;
      $(objPara.eleContainer + ' .swipeSlide').css({
        width: objPara.size.width,
        height: objPara.size.height
      });
      // pagesContainer size
      $(objPara.eleContainer + ' .customSlideContainer').css({
        width: parseFloat(objPara.size.width * totalPage),
        height: objPara.size.height
      });
    };
    // set all style or resize reset
    this.setSlideStyle = function() {
      // set outside style
      $(objPara.eleContainer).css({
        height: objPara.size.height,
        width: objPara.size.width,
        overflow: 'hidden',
        position: 'relative'
      });
      // set customSlideContainer style
      $(objPara.eleContainer + ' > .customSlideContainer').css({
        'transition-duration': 0 + 'ms',
        position: 'relative',
        '-webkit-transform': 'translate3d(0,0,0)',
        '-moz-transform': 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)',
        '-webkit-transform-style': 'preserve-3d',
        '-moz-transform-style': 'preserve-3d',
        'transform-style': 'preserve-3d',
        '-webkit-transition-property': 'transform',
        '-moz-transition-property': 'transform',
        'transition-property': 'transform'
      });
      // set swipeSlide width
      $(objPara.eleContainer + ' > div.customSlideContainer > .swipeSlide').css(
        {
          height: objPara.size.height,
          width: objPara.size.width,
          float: 'left',
          'overflow-y': 'scroll'
          // 'outline' : '1px solid #f00', // 測試用
        }
      );
    };
    // get customSlideContainer style translateX
    this._getTranslateVal = function() {
      var $customSlideContainer = $(
        objPara.eleContainer + ' > .customSlideContainer'
      );

      var trl =
        $customSlideContainer.css('transform') ||
        $customSlideContainer.css('-webkit-transform') ||
        $customSlideContainer.css('-moz-transform');

      var mat = trl.match(/^matrix3d\((.+)\)$/);
      if (mat) return parseFloat(mat[1].split(', ')[13]);
      mat = trl.match(/^matrix\((.+)\)$/);

      var mat_s = mat[1].split(', ');
      return parseFloat(mat_s[4]);
    };
    // autoSlide
    this.autoSlide = function(para) {
      if (para === 'start') {
        if (objPara.slideInterval !== '') {
          clearInterval(objPara.slideInterval);
          objPara.slideInterval = '';
        }
        objPara.slideInterval = setInterval(function() {
          var _index = objPara.loop
            ? objPara.currentIndex + 1
            : (objPara.currentIndex + +1 + objPara.totalPages) %
              objPara.totalPages;
          _this.jumpPage({
            index: _index,
            animate: true
          });
        }, objPara.slideshowSpeed);
      } else if (para === 'stop') {
        clearInterval(objPara.slideInterval);
        objPara.slideInterval = '';
      }
    };
    // 初始執行
    this.init = function() {
      objPara.size = _this.getContainerSize();
      // get pages sum
      objPara.totalPages = $(objPara.eleContainer + ' .swipeSlide').length;
      if (objPara.loop) {
        var $customSlideContainer = $(
          objPara.eleContainer + ' .customSlideContainer'
        );
        var $lastPage = $(
          objPara.eleContainer + ' .customSlideContainer .swipeSlide'
        )
          .eq(objPara.totalPages - 1)
          .clone();
        var $firstPage = $(
          objPara.eleContainer + ' .customSlideContainer .swipeSlide'
        )
          .eq(0)
          .clone();
        $customSlideContainer.prepend($lastPage);
        $customSlideContainer.append($firstPage);
      }
      // addEvent
      _this.addSlideEvent();
      // set each page
      _this.setPageSize();
      // set each style
      _this.setSlideStyle();
      _this.jumpPage({
        index: option.startAt
      });
      if (objPara.slideShow) _this.autoSlide('start');
    };
    // touchTimer
    this.touchTimer = function(_switch) {
      if (_switch === 'start') {
        if (objPara.timer.interval !== '') {
          clearInterval(objPara.timer.interval);
          objPara.timer.interval = '';
        }
        objPara.timer.interval = setInterval(function() {
          objPara.timer.duration += 10;
        }, 10);
      } else if (_switch === 'end') {
        clearInterval(objPara.timer.interval);
        objPara.timer.interval = '';
        objPara.timer.duration = 0;
      }
    };
    // remove touch and mouse event
    this.removeSlideEvent = function() {
      var $container = $(objPara.eleContainer);
      var div = document.createElement('div');
      var supTouch = (supportTouch = 'ontouchstart' in div);
      var myEvent = {
        start: 'mousedown.slide',
        move: 'mousemove.slide',
        end: 'mouseup.slide'
      };
      if (supTouch) {
        myEvent = {
          start: 'touchstart.slide',
          move: 'touchmove.slide',
          end: 'touchend.slide'
        };
      }
      $.each(myEvent, function(index, value) {
        $container.off(value);
      });
    };
    // add touch and mouse event
    this.addSlideEvent = function() {
      var $container = $(objPara.eleContainer);
      var touchDeviation = objPara.touchDeviation;
      var startPoint = (endPoint = {
        x: 0,
        y: 0
      });
      var div = document.createElement('div');
      var supTouch = (supportTouch = 'ontouchstart' in div);
      var myEvent = {
        start: 'mousedown.slide',
        move: 'mousemove.slide',
        end: 'mouseup.slide'
      };
      if (supTouch) {
        myEvent = {
          start: 'touchstart.slide',
          move: 'touchmove.slide',
          end: 'touchend.slide'
        };
      }

      // start
      $container.on(myEvent.start, touchStart);
      // touchStart (mousedown) event
      function touchStart(e) {
        startPoint = {
          x: e.clientX || e.touches[0].clientX,
          y: e.clientY || e.touches[0].clientY
        };
        objPara.originTranslate = _this._getTranslateVal();
        _this.touchTimer('start');
        if (objPara.slideShow) _this.autoSlide('stop');
        // console.log('touchstart', startPoint);
      }

      // move
      $container.on(myEvent.move, touchMove);
      // touchmove (mousemove) event
      function touchMove(e) {
        if (startPoint.x === 0 && startPoint.y === 0) return;
        endPoint = {
          x: e.clientX || e.touches[0].clientX,
          y: e.clientY || e.touches[0].clientY
        };
        var moving = {
          x: endPoint.x - startPoint.x, // x > 0 向左 , ｘ < 0 向右
          y: endPoint.y - startPoint.y
        };
        var touchTime = objPara.touchTime;
        var duration = objPara.timer.duration;
        if (
          moving.y < touchDeviation &&
          duration > touchTime &&
          !objPara.movingStatus
        ) {
          // console.log('touchMove', moving);
          _this.containerMove({
            distance: objPara.originTranslate + moving.x
          });
        }
      }

      // end
      $container.on(myEvent.end, touchEnd);
      // touchend (mouseup) event
      function touchEnd(e) {
        _this.touchTimer('end');
        var _remainderRate =
          (Math.abs(_this._getTranslateVal() - objPara.originTranslate) /
            objPara.size.width) *
          100;
        var _path =
          _this._getTranslateVal() - objPara.originTranslate > 0 ? -1 : 1;
        if (_remainderRate < 10) _path = 0;

        if (!objPara.loop) {
          if (
            objPara.currentIndex + _path < 0 ||
            objPara.currentIndex + _path >= objPara.totalPages
          )
            _path = 0;
        }
        _this.jumpPage({
          index: objPara.currentIndex + _path,
          animate: true
        });
        startPoint = endPoint = {
          x: 0,
          y: 0
        };
        if (objPara.slideShow) _this.autoSlide('start');
        // console.log('touchend', { startPoint, endPoint });
      }
    };
    // customSlideContainer Move
    this.containerMove = function(para) {
      // check loop
      var maxDis = (objPara.totalPages - 1) * objPara.size.width * -1;
      var disPercent = 1;
      if (!objPara.loop && objPara.currentIndex === 0 && para.distance > 0) {
        var disPercent = 1 - Math.abs(para.distance - 1) / objPara.size.width;
        para.distance = para.distance * disPercent;
      } else if (
        !objPara.loop &&
        objPara.currentIndex === objPara.totalPages - 1 &&
        para.distance < maxDis
      ) {
        disPercent =
          1 - (Math.abs(para.distance) + maxDis) / objPara.size.width;
        para.distance = maxDis + (para.distance - maxDis) * disPercent;
      }
      var translate = 'translate3d(' + para.distance + 'px,0,0)';
      if (!para.speed) para.speed = 0;
      $(objPara.eleContainer + ' .customSlideContainer').css({
        '-webkit-transform': translate,
        '-moz-transform': translate,
        transform: translate,
        'transition-duration': para.speed + 'ms'
      });
    };
    // 跳頁 ({index, animate})
    this.jumpPage = function(para) {
      var _index = (objPara.currentIndex = para.index);
      var _multiple = objPara.loop ? _index + 1 : _index;
      var _distance = _multiple * objPara.size.width * -1;
      var _speed = para.animate ? objPara.animationSpeed : 0;
      var $container = $(objPara.eleContainer + ' .customSlideContainer');
      _this.containerMove({
        distance: _distance,
        speed: _speed
      });
      if (_speed !== 0) {
        objPara.movingStatus = true;
        // 還原 transitionDuration
        setTimeout(function() {
          $container.css({
            'transition-duration': '0ms'
          });
          // 若是循環模式 (檢查)
          if (objPara.loop) {
            if (objPara.currentIndex === objPara.totalPages) {
              // 若已經到 fake 最後一頁
              objPara.currentIndex = 0;
            } else if (objPara.currentIndex === -1) {
              // 若已經到 fake 第一頁
              objPara.currentIndex = objPara.totalPages - 1;
            }
            _this.jumpPage({
              index: objPara.currentIndex
            });
          }
          objPara.movingStatus = false;
        }, _speed);
      }
    };
    // init
    this.init();
  } catch (error) {
    console.log({
      error
    });
  }
}
