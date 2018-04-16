let post_count = 0;
let last_pos = 0;
function addButtonsToPosts(){
    let all_posts = document.querySelectorAll('._1dwg._1w_m._q7o');
    let total_post_count = all_posts.length;
    if(total_post_count>post_count){
        //post_count = total_post_count;
        all_posts = Array.prototype.slice.call(all_posts,post_count)
        //all_posts.slice(post_count);
        Array.prototype.forEach.call(all_posts,function(post){
            post_count += 1;
            let buttonDiv = post.querySelector('div');
            let newItem = document.createElement("div");  
            newItem.innerText = "POOP";
            newItem.className = "ibetter_div";
            post.insertBefore(newItem, buttonDiv);
            //buttonDiv.insertBefore(newItem, buttonDiv.childNodes[0]);
        })
    } 
}


chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        let all_posts = document.querySelectorAll('._1dwg._1w_m._q7o');
        // do it for the initial time
        Array.prototype.forEach.call(all_posts,function(post){
            post_count += 1;
            let buttonDiv = post.querySelector('div');
            let newItem = document.createElement("div");  
            newItem.innerText = "POOP";
            post.insertBefore(newItem, buttonDiv);
            //buttonDiv.insertBefore(newItem, buttonDiv.childNodes[0]);
        })

        window.addEventListener('scroll', function(e) {
            let pos = document.documentElement.scrollTop;
            if(last_pos < pos){
                addButtonsToPosts()
            }
            last_pos = pos;
            //console.log(total_post_count)
        });

        //console.log("Happening fater page load");
        //console.log("Happening fater page load");
        //console.log("FACEBOOOOOKK  ONLY");
	}
	}, 1);
});