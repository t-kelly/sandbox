performance.mark('2 exec');
function wait2(){
    performance.mark('later 2');
}
setTimeout(wait2, 0);
!function wait2b(){
    performance.mark('later 2b');
}();