window.onload = function() {
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