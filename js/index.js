window.onload = function() {
    searchEffect();
    timeBack();
    bannerEffect();
}

/*头部js效果*/
function searchEffect() {
    // 1.头部搜索框在页面上滑过程中透明度改变的效果
    // 1.1获取banner高度
    var banner = document.querySelector(".jd_banner");
    var bannerHeight = banner.offsetHeight;
    // console.log(bannerHeight);
    // 1.2获取当前屏幕滚动时，banner滚出屏幕的高度
    var search = document.querySelector(".jd_search")
    window.onscroll = function() {
        var offsetTop = document.documentElement.scrollTop;
        /*此处不能用document.body.scrollTop 因为 DTD问题，值总为0*/
        // console.log(offsetTop);
        // 1.3计算滚出高度与banner高度的比例值
        var opacity = 0;
        if (offsetTop < bannerHeight) {
            opacity = offsetTop / bannerHeight;
            search.style.backgroundColor = `rgba(233,35,34,` + opacity + `)`;
        }
    }
}
/*倒计时效果 */
function timeBack() {
    var spans = document.querySelector(".jd_sk_time").querySelectorAll("span");
    var totalTime = 3440;
    var timer = setInterval(function() {
        totalTime--;
        if (totalTime < 0) {
            clearInterval(timer);
            return;
        }
        var hour = Math.floor(totalTime / 3600);
        var min = Math.floor((totalTime % 3600) / 60);
        var second = totalTime % 60;
        spans[0].innerHTML = Math.floor(hour / 10);
        spans[1].innerHTML = hour % 10;
        spans[3].innerHTML = Math.floor(min / 10);
        spans[4].innerHTML = min % 10;
        spans[6].innerHTML = Math.floor(second / 10);
        spans[7].innerHTML = second % 10;
    }, 1000)
}
/* 轮播图效果实现 */
function bannerEffect() {
    /* 移动web轮播图与PC端轮播图区别： 移动web不仅要向后拖动，
    还需要往前拖动，所以不仅要在最后clone第一个图片元素，
    还要在第一个元素前clone最后一个图片元素*/
    // 1.动态创建图片列表
    // 1.1 获取图片盒子
    var banner = document.querySelector(".jd_banner");
    var imgBox = banner.querySelector("ul:first-of-type");
    var first = imgBox.querySelector("li:first-of-type");
    var last = imgBox.querySelector("li:last-of-type");
    // 1.2 在最后的图片元素后添加第一张图片，true为深度拷贝
    imgBox.appendChild(first.cloneNode(true));
    // 1.3 在第一张元素前添加最后一张图片
    // insertBefore（要插入的元素，插入的位置）
    imgBox.insertBefore(last.cloneNode(true), first);
    // 2.动态设置banner区域样式，让图片正常显示
    var bannerWidth = banner.offsetWidth;
    var lis = imgBox.querySelectorAll("li");
    var count = lis.length;
    var index = 1; // index从0开始，0为clone的最后一张图片
    // 2.1 设置图片盒子的宽度
    imgBox.style.width = bannerWidth * count + "px";
    // 2.2 设置li元素里每张图片的宽度
    for (var i = 0; i < lis.length; i++) {
        lis[i].style.width = bannerWidth + "px";
    }
    // 3 设置默认偏移（还需要在样式中设置相对定位）
    // 不能设置绝对定位，因为没了高度，撑不起盒子
    imgBox.style.left = -bannerWidth + 'px';
    // 4.当屏幕发生变化时，重新计算宽度
    window.onresize = function() {
            /* 此时获取的宽度覆盖全局的宽度值，方便延时500时调用，
            否则轮播图在轮播过程中改变宽度出现问题*/
            bannerWidth = banner.offsetWidth;
            imgBox.style.width = bannerWidth * count + "px";
            for (var i = 0; i < lis.length; i++) {
                lis[i].style.width = bannerWidth + "px";
            }
            imgBox.style.left = -bannerWidth * index + 'px';
        }
        // 自动切换点标记
    function setPoints(index) {
        var points = banner.querySelector("ul:last-of-type").querySelectorAll("li");
        /* 清除li标签的样式 */
        for (var i = 0; i < points.length; i++) {
            points[i].classList.remove("active");
        }
        // 为当前的li元素添加样式
        points[index - 1].classList.add("active");
    }
    // 5 设置自动轮播效果
    startTime();
    var timeId;

    function startTime() {
        timeId = setInterval(function() {
            index++;
            // 设置过渡效果
            imgBox.style.transition = "left 0.5s ease-in-out";
            imgBox.style.left = -bannerWidth * index + 'px';
            // 设置延时操作，否则走不到最后一张
            setTimeout(function() {
                if (index == count - 1) {
                    index = 1;
                    /* 如果一个元素之前添加过过渡效果，那么这个过渡效果就会一直存在
        如果不想要，则需要清除这个过渡效果，否则从最后一张调到第一张
        会有一个明显的过渡 */
                    imgBox.style.transition = "none";
                    imgBox.style.left = -bannerWidth * index + 'px';
                }
            }, 500)
        }, 2000)
    }
    // 6.设置自动轮播效果
    // touch事件的触发，必须保证元素具有具体的宽高值，
    // 否则不会进行触发，所以要给jd_bannerImg清除浮动
    var startX, moveX, distanceX;
    var isEnd = true;
    /* 1.为图片添加触摸事件--触摸开始 */
    imgBox.addEventListener('touchstart', function(e) {
            // 清除定时器，否则滑动的时候按不住图片
            clearInterval(timeId);
            // 获取当前手指的起始位置
            startX = e.targetTouches[0].clientX;
        })
        /* 2.为图片添加触摸事件--滑动过程 */
    imgBox.addEventListener("touchmove", function(e) {
        if (isEnd == true) {
            // 记录手指在滑动过程中的位置
            moveX = e.targetTouches[0].clientX;
            // 计算坐标的差值
            distanceX = moveX - startX;
            // 为了保证效果正常，将之前添加的过渡效果样式清除
            imgBox.style.transition = "none";
            // 实现元素的偏移
            // 在当前的基础之上进行偏移
            imgBox.style.left = (-index * bannerWidth + distanceX) + 'px';
        }
    });
    /* 3.为图片添加触摸事件--触摸结束 */
    imgBox.addEventListener("touchend", function(e) {
        isEnd = false;
        if (Math.abs(distanceX) > 100) {
            if (distanceX > 0) {
                // 上一张
                index--;
            } else {
                // 下一张
                index++;
            }
            imgBox.style.transition = "left 0.5s ease-in-out";
            imgBox.style.left = -index * bannerWidth + "px";
        } else if (Math.abs(distanceX) > 0) {
            // 开启定时器
            imgBox.style.transition = "left 0.5s ease-in-out";
            imgBox.style.left = -index * bannerWidth + "px";
        }
        // 将上一次move所产生的值置为0
        startX = 0;
        moveX = 0;
        distanceX = 0;
        // 重新开启定时器
        // startTime();
    });
    /*webkitTransitionEnd：可以监听当前元素的过渡效果执行完毕
    当这个元素的过渡效果执行完毕时，会触发这个事件*/
    imgBox.addEventListener("webkitTransitionEnd", function() {
        // 如果到了最后一张count-2 回到索引1
        // 如果到了第一张0，回到索引count-2
        if (index == count - 1) {
            index = 1;
            // 清除过渡
            imgBox.style.transition = "none";
            imgBox.style.left = -index * bannerWidth + 'px';
        } else if (index == 0) {
            index = count - 2;
            // 清除过渡
            imgBox.style.transition = "none";
            imgBox.style.left = -index * bannerWidth + 'px';
        }
        // 设置点标记样式
        setPoints(index);
        setTimeout(function() {
            isEnd = true;
            clearInterval(timeId);
            // 重新打开定时器
            startTime();
        }, 500)
    });
}