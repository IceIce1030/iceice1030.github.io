;(function(){
  // fetch玩家資料
  var getPlayers = () => {
    var res = '';
    $.ajax({
      url: 'player.json',
      type: 'GET',
      data: {},
      dataType: 'text',
      async: false,
      error: function(e) {
        console.log('ajax request error!=>', e);
      },
      success: function(response) {
        try {
          res = JSON.parse(response);
        } catch (error) {
          console.log(error);
        }
      }
    });
    /* use 靜態資料
    res = [
      {
        "name": "我是玩家1",
        "id": 1,
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEtD3nBtqwGaZMgsfNeuPB_PfkpYvcc5rT-HbwaW8kVtVGS8P5"
      },
      {
        "name": "我是玩家2",
        "id": 2,
        "img": "data:image/jpeg;base64,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"
      },
      {
        "name": "我是玩家3",
        "id": 3,
        "img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiASq00hehMgaY1iwCYKY1p9nyxVNRJiH8UTuB6_BDBkt52VNbGQ"
      },
      {
        "name": "我是玩家4",
        "id": 4,
        "img": "https://i.ytimg.com/vi/8M7Qie4Aowk/hqdefault.jpg"
      },
      {
        "name": "我是玩家5",
        "id": 5,
        "img": "https://pbs.twimg.com/media/C8PDDBMUwAAuid4.jpg"
      }
    ]
    */
    return res;
  }

  // 玩家資料
  var players = getPlayers();
  // 取得玩家總數
  var playersSum = players.length;
  // 遊戲開始狀態
  var gameStart = false;
  // 預設抽三個名額
  var winnerCount = 3;
  // 計時器
  var lotteryInterval = '';
  // delay時間
  var delay = 800;
  var btnTxt = {
    start: '開始',
    stop: '停止',
    pick: '自動抽獎中...'
  };
  var $btn = $('.statBtn');
  var $option = $('.option');
  var $winPlayerSum = $('.winPlayerSum');

  // 隨機選出一位玩家
  var randomPlayer = players => {
    var x = players.length;
    return players[Math.floor(Math.random()*x)];
  }

  // 按鈕事件
  $btn.on('click', function() {
    if(!gameStart && $(this).text() === btnTxt.start){
      // 改變btn文字
      $(this).text(`${btnTxt.stop}`);
      // 清空中獎名單
      $('.winnerLists').empty();
      // 改變遊戲狀態
      gameStart = true;
      // 執行亂數顯示
      lotteryInterval = panelRandomRender();
    }else if(gameStart && $(this).text() === btnTxt.stop ){
      // 停止計時器
      clearInterval(lotteryInterval);
      var winsArr = [];
      // 抽獎
      lottery();
    }
    // 抽獎 function
    function lottery(){
      clearInterval(lotteryInterval);
      var player = '';
      var _find = true;
      // 檢查是否重複中獎
      while(_find) {
        player = randomPlayer(players);
        _find = winsArr.find( win =>{
          return win === player.id;
        });
      }
      winsArr.push(player.id);

      // 刪除中獎者資料
      players.find( (_player, index) =>{
        if(_player.id === player.id){
          players.slice(index, 1);
        }
      });

      $btn.text(`${btnTxt.pick}(剩餘${winnerCount - winsArr.length})`);
      // 加入中獎名單
      var winnerItem = `
        <div class="item">
          <div 
            class="imgBox"
            style="
              background: url(${player.img});
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;"
          >
          </div>
          <div class="userName">${player.name}</div>
        </div>
      `;
      panelRender(player);
      $('.winnerLists').prepend(winnerItem);
      // 尚未抽完
      if(winsArr.length !== winnerCount) {
        // 停頓顯示中講者
        setTimeout(() => {
          lotteryInterval = panelRandomRender();
          setTimeout(lottery, delay);
        }, delay);
      }
      else { // 抽完獎
        gameStart = false;
        $btn.text(`${btnTxt.start}`);
        // 重新取得資料
        players = getPlayers();
      }
    }

    // 執行亂數顯示
    function panelRandomRender(){
      var speed = 100;
      return  setInterval(()=>{
        var player = randomPlayer(players);
        panelRender(player);
      }, speed);
    }

    // panelRender
    function panelRender(player){
      var $panel = $('.panelContainer');
        $panel.find('.imgBox').css({
          'background': `url(${player.img})`,
          'background-size': 'contain',
          'background-repeat': 'no-repeat',
          'background-position': 'center',
        });
        $panel.find('.imgBox > .userName').text(player.name);
    }
  });


  // 點擊加減中獎人數
  $option.on('click', function(){
    if($(this).hasClass('minus')){
      // minus event
      winnerCount = winnerCount-- <= 1 ? 1: winnerCount--;
    }else if($(this).hasClass('plus')){
      // plus event
      winnerCount = winnerCount++ >= playersSum ? playersSum: winnerCount++;
    }
    $winPlayerSum.text(winnerCount);
  });
})();