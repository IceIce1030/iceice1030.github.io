const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const earthquake = function (option) {
  var page = option.page;
  request({
    url: 'https://www.youtube.com/', // 網頁
    method: "GET"
  }, function (error, response, body) {
    if (error || !body) {
      return;
    }
    const $ = cheerio.load(body); // 載入 body
    const result = []; // 建立一個儲存結果的容器
    const table_tr = $('#video-title'); // 爬最外層的 Table 中的 tr
    console.log(table_tr.text());

    // for (let i = 1; i < table_tr.length; i++) {
    //   const table_td = table_tr.eq(i).find('td');
    //   const sort = table_td.eq(0).find('p.b-list__summary__sort > a').html();
    //   const title = table_td.eq(1).find('a').text(); // title
    //   // 建立物件並(push)存入結果
    //   result.push(Object.assign({
    //     sort,
    //     title
    //   }));
    // }
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