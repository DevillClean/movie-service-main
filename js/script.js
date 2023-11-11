let button_filter = document.getElementById("button-filter");
let panel_filter = document.getElementById("panel-filter");
let flag = 0;

button_filter.onclick = function(){
    if(flag == 0){
        panel_filter.classList.add('active');
        flag = 1;
    } else {
        panel_filter.classList.remove('active');
        flag = 0;
    }
}