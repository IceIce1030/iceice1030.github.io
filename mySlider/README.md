# mySlider
mySlider

you need to link css and js
<link rel="stylesheet" href="/css/main.css">
<script src="/js/slider.js"></script>

#how to use



# my data
const images = [
  { img: 'https://fakeimg.pl/650x300/ffaa00/?text=World1&font=lobster%22', href: '#1' },
  { img: 'https://fakeimg.pl/650x300/ffa0aa/?text=World2&font=lobster%22', href: '#2' },
  { img: 'https://fakeimg.pl/650x300/fc0acc/?text=World3&font=lobster%22', href: '#3' },
  { img: 'https://fakeimg.pl/650x300/ffcc00/?text=World4&font=lobster%22', href: '#4' },
];


# option
const sliderArguments = {
  container: '#slider-box', // 內容位置
  containerWidth: 650, // 內容寬度
  containerHeight: 300, // 內容高度
  images: images, // 圖片資料
  initNum: 0, // 預設起始顯示
  autoPlay: { // 自動播放物件
    // moveDirection: 'left', // 方向 not work
    time: 1500, // 多久執行一次
  }, // 是否自動播放
  speed: 300, // 動畫速度
  tools: ['pageBtn', 'dotBtn'], // 要使用什麼功能（上下頁，dot page
};

#do it
new customSlider(sliderArguments);
