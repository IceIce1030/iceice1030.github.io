/*
 mySlider(params)
 ** params.data = json data
 ** params.width = container width (px)
 ** params.height = container height (px)
 ** params.transitionTime = transition (ms)，default 300ms
 ** params.container =  id or className
 ** params.autoPlay = { time: delayTime(ms) }
 */

function mySlider(params) {
  try {
    this.data = params.data || []; // 資料
    this.width = params.width || ''; // 寬度
    this.height = params.height || ''; // 高度
    this.container = params.container || ''; // container id or class
    this.transitionTime = params.transitionTime || 300; // 過場動畫時間
    this.autoPlay = params.autoPlay || ''; // 自動輪播

    if (this.data.length === 0) throw 'data is error';
    if (this.width === '') throw 'width is null';
    if (this.height === '') throw 'height is null';
    if (this.container === '') throw 'container is null';
    if (this.autoPlay === '') throw 'params.autoPlay is error';
    if (isNaN(this.autoPlay.time)) throw 'this.autoPlay.time is NaN';

    var index = 0; // 目前index
    var pageItemCount = 5; // 每一頁的數量
    var pages = Math.ceil(this.data.length / pageItemCount); // 總頁數
    var itemWidth = this.width; // li 寬度
    var itemHeight = this.height; // li 高度
    var transitionTime = this.transitionTime; // 過場動畫時間
    var deviationTime = 5; // 時間誤差值
    var moving = false; // 移動的狀態
    var autoPlay = this.autoPlay;
    var timeInterval = ''; // 輪播計時器
    var $container = $(this.container);

    // 初始執行
    this.init = function () {
      renderSlider(this.data); // 處理畫面
      addSliderEvent(); // 註冊事件
      // 初始定位
      $container.find('.sliderContainer').css({
        transform: 'translate3d(-' + itemWidth * (index + 1) + 'px, 0, 0)',
      });
    }
    // slider 渲染
    function renderSlider(data) {
      var sliderTag = '';
      sliderTag += '<div class="customSlider">';
      sliderTag += '<ul class="sliderContainer">';

      for (var i = 0; i < data.length; i++) {
        var nextPage = i % pageItemCount === 0 ? true : false;
        var mainClass = nextPage ? 'mainProd' : '';
        var mainTitle = nextPage ? '<div class="mainTitle"><span>熱賣推薦</span></div>' : '';
        if (nextPage) sliderTag += '<li><div class="pageContainer">';

        sliderTag += '<a class="prodItem ' + mainClass + '" href="' + data[i].href + '" >';
        sliderTag += mainTitle;
        sliderTag += '<div class="imgBox">';
        sliderTag += '<img src="' + data[i].image + '" />';
        sliderTag += '</div>'; // imgBox
        sliderTag += '<div class="txtContent">' + data[i].name + '</div>';
        sliderTag += '<div class="price">$<span>' + data[i].price + '</span></div>';
        sliderTag += '</a>'; // prodItem

        if ((i + 1) % pageItemCount === 0) sliderTag += '</div></li>'
      }

      sliderTag += '</ul>'; // sliderContainer 
      if (pages > 1) {
        sliderTag += '<div class="sliderToolPages">';
        sliderTag += '<div class="sliderToolPagesContainers">';
        sliderTag += '<div class="pagesBtn prevPage"></div>';
        sliderTag += '<div class="pagesInfo"><span class="currentPage">1</span>';
        sliderTag += '/<span class="totalPages">' + pages + '</span>'
        sliderTag += '</div>'; // pagesInfo
        sliderTag += '<div class="pagesBtn nextPage"></div>';
        sliderTag += '</div>'; //sliderToolPagesContainers
        sliderTag += '</div>'; // sliderToolPages
      }
      sliderTag += '</div>'; // customSlider

      $container.html(sliderTag);

      // 複製假的頁面
      var $sliderContainerUl = $container.find('.sliderContainer');
      var firstPage = $sliderContainerUl.find('li').eq(0).clone();
      var lastPage = $sliderContainerUl.find('li').eq(pages - 1).clone();
      // 將第一頁複製到最後一頁
      $sliderContainerUl.find('li').eq(pages - 1).after(firstPage);
      // 將最後一頁複製到第一頁
      $sliderContainerUl.find('li').eq(0).before(lastPage);
      // 設定寬度 高度 樣式
      $container.find('.customSlider').width(itemWidth);
      $sliderContainerUl.width((pages + 2) * 100 + '%'); // +2 因為有fake page
      $sliderContainerUl.find('li').css({
        width: itemWidth,
        height: itemHeight,
        float: 'left',
      });
    }
    // 上一頁 或 下一頁動作
    function prevNextOnePage(pagePath) {
      if (pagePath === 'next') {
        index++;
        var promise = sliderMoving();
        promise.done(sliderMovingCallback);
      } else if (pagePath === 'prev') {
        index--;
        var promise = sliderMoving();
        promise.done(sliderMovingCallback);
      }
    }
    // 註冊事件
    function addSliderEvent() {
      // 下一頁事件
      $container.find('.nextPage').on('click', function () {
        if (!moving) prevNextOnePage('next');
      });
      // 上一頁事件
      $container.find('.prevPage').on('click', function () {
        if (!moving) prevNextOnePage('prev');
      });
      // 自動輪播事件
      if (autoPlay) {
        clearInterval(timeInterval);
        timeInterval = '';
        timeInterval = setInterval(function () {
          prevNextOnePage('next');
        }, autoPlay.time);
        $container.on('mouseenter', function () {
          clearInterval(timeInterval);
          timeInterval = '';
        });
        $container.on('mouseleave', function () {
          timeInterval = setInterval(function () {
            prevNextOnePage('next');
          }, autoPlay.time);
        });
      }


    }
    // slide 移動
    // param = jump (直接跳轉，不出現過場動畫)
    function sliderMoving(param) {
      var $dfd = $.Deferred();
      moving = true;
      if (param === 'jump') {
        $container.find('.sliderContainer').css({
          'transform': 'translate3d(-' + itemWidth * (index + 1) + 'px, 0, 0)',
        });
        moving = false;
        $dfd.resolve();
      } else {
        $container.find('.sliderContainer').css({
          'transform': 'translate3d(-' + itemWidth * (index + 1) + 'px, 0, 0)',
          'transition-duration': transitionTime + 'ms',
        });
        setTimeout(function () {
          moving = false;
          $dfd.resolve();
          // 設定頁數
          setPages();
        }, transitionTime + deviationTime);
      }
      return $dfd.promise();
    }
    // 設定頁數
    function setPages() {
      $container.find('.pagesInfo .currentPage').text(index + 1);
    }
    // 移動後callback function
    function sliderMovingCallback() {
      $container.find('.sliderContainer').css({
        'transition-duration': '0ms',
      });
      if (index === pages) {
        index = 0;
        sliderMoving('jump');
      } else if (index === -1) {
        index = pages - 1;
        sliderMoving('jump');
      }
    }
    // init apply
    this.init();
  } catch (error) {
    $(this.container).html('Some thing Error!');
    console.log('error=>', error);
  }
}