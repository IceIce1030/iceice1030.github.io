;(function(){
  // 取得玩家資料
  var getPlayers = () => {
    var res = '';
    $.ajax({
      url: 'player.json',
      type: 'GET',
      data: {},
      dataType: 'text',
      async: false, // 啟用同步請求
      error: function(e) {
        console.log('Ajax request 發生錯誤', e);
      },
      success: function(response) {
        try {
          res = JSON.parse(response);
        } catch (error) {
          console.log(error);
        }
      }
    });
    return res;
  }

  // 玩家資料
  var players = getPlayers();

  // 隨機選出一位玩家
  var randomPlayer = players => {
    var x = players.length;
    return players[Math.floor(Math.random()*x)];
  }

  // 遊戲開始狀態
  var gameStart = false;
  // 抽三個名額
  var winnerCount = 3;
  // 計時器
  var lottoInterval = '';
  // delay時間
  var delay = 800;
  var btnTxt = {
    start: '開始',
    stop: '停止',
    pick: '自動抽獎中...'
  };
  var $btn = $('.statBtn');

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
      lottoInterval = panelRandomRender();
    }else if(gameStart && $(this).text() === btnTxt.stop ){
      // 停止計時器
      clearInterval(lottoInterval);
      var winsArr = [];
      // 抽獎
      lottery();
    }
    // 抽獎 function
    function lottery(){
      clearInterval(lottoInterval);
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
          lottoInterval = panelRandomRender();
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


  


})();