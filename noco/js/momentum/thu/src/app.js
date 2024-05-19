const htmlbody = document.body;

const superEventHandler = {
    windowResize: function() {
        if (window.innerWidth >= 1300) {
            htmlbody.className = "bgcolor1";
        } else if(1300 > window.innerWidth && window.innerWidth >= 800){
            htmlbody.className = "bgcolor2";
        } else{
            htmlbody.className = "bgcolor3";
        }
    }
}

window.addEventListener("resize", superEventHandler.windowResize);