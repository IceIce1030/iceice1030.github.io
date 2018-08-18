# mobileDragPages
dragePages


need jquery and link js  
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>  
<script src="./js/myDrag.js"></script>  

# id，高度，寬度，跳頁按鈕  
<pre><code>
var myDrag = new dragenFun('#myDrag',"100vh - 50px","");  
</pre></code>

# 註冊menu事件  
<pre><code>
$('.menu > div').on('click',function(){  
    let page = $(this).data("page");  
    myDrag._jumpView(page);  
});  
</pre></code>


# You can go to the page you want to go to  
<pre><code>
myDrag._jumpView(number);  
</pre></code>


# Will return to the current display page  
<pre><code>
myDrag.getcurrentIndex()  
</pre></code>
