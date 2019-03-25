const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const earthquake = function (option) {
  var page = option.page;
  request({
    url: 'https://forum.gamer.com.tw/B.php?page=' + page + '&bsn=28924&subbsn=0', // 網頁 (巴哈姆特)
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body); // 載入 body
    const result = []; // 建立一個儲存結果的容器
    const table_tr = $(".b-list-wrap tr.b-list__row"); // 爬最外層的 Table 中的 tr

    for (let i = 1; i < table_tr.length; i++) {
      const table_td = table_tr.eq(i).find('td');
      const sort = table_td.eq(0).find('p.b-list__summary__sort > a').html(); // 分類
      const title = table_td.eq(1).find('a').text(); // 文章標題
      // 建立物件並(push)存入結果
      result.push(Object.assign({
        sort,
        title
      }));
    }
    // 在終端機(console)列出結果
    console.log(result);
    // 寫入 result.json 檔案
    fs.writeFileSync("result.json", JSON.stringify(result));
  });
};

earthquake({
  page: 2
});
// 每半小時爬一次資料
// setInterval(earthquake, 30 * 60 * 1000);