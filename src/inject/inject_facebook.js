let post_count = 0;
let last_pos = 0;

function genButton(buttonText){
    let button = document.createElement("button");
    button.innerText = buttonText;
    button.className = "ibetter_button"
    return button;
}

function genListOfLinks(list){
    let div = document.createElement("div");
    let ul = document.createElement("ul");
    list.forEach(function(l){
        let li = document.createElement("li");
        let a = document.createElement("a");
        a.href = l.url;
        a.innerText = l.url;
        li.appendChild(a);
        ul.appendChild(li);
    })
    div.appendChild(ul);
    return div;
}

function filterByLinkPosts(post){
    let a = post.querySelectorAll('a[target="_blank"]')
    a = Array.prototype.map.call(a,function(aa){
        return window.decodeURIComponent(aa.search).slice(3).split('&')[0]
    });
    if(a.length>0){ return true; } else { return false; }
}


function addButtonsToPosts(){
    let all_posts = document.querySelectorAll('._1dwg._1w_m._q7o');
    all_posts = Array.prototype.filter.call(all_posts,filterByLinkPosts)
    let total_post_count = all_posts.length;

    if(total_post_count>post_count){
        all_posts = Array.prototype.slice.call(all_posts,post_count)
        Array.prototype.forEach.call(all_posts,function(post){
            post_count += 1;
            post.querySelector('._4r_y').classList.add('ibetter_container')

            let a = post.querySelectorAll('a[target="_blank"]')
            a = Array.prototype.map.call(a,function(aa){
                return window.decodeURIComponent(aa.search).slice(3).split('&')[0]
            });
            let checkBtn = genButton('Check');
            let simBtn = genButton('Similar');
            let postInfo = {}

            simBtn.onclick = function(){
                if(postInfo.similar_results){
                    let similar_results = postInfo.similar_results
                    link_div = genListOfLinks(similar_results)
                    post.insertBefore(link_div, buttonDiv);
                    console.log(similar_results)
                } else {
                    fetch('https://ibetter.herokuapp.com/api/detect/?url='+a[0])
                      .then(function(response) {
                        return response.json();
                      })
                      .then(function(myJson) {
                        postInfo = myJson;
                        let similar_results = postInfo.similar_results

                        link_div = genListOfLinks(similar_results)
                        post.insertBefore(link_div, buttonDiv);
                        console.log(similar_results)
                      });
                }
            }

            checkBtn.onclick = function(){
                if(postInfo.similar_results){
                    let pred = +postInfo.our_prediction.toFixed(2);
                    if(pred>50){
                        checkBtn.classList.add('real');
                    } else {
                        checkBtn.classList.add('fake');
                    }
                    checkBtn.innerText = pred;
                } else {
                    fetch('https://ibetter.herokuapp.com/api/detect/?url='+a[0])
                      .then(function(response) {
                        return response.json();
                      })
                      .then(function(myJson) {
                        postInfo = myJson;
                        let pred = +postInfo.our_prediction.toFixed(2);
                        if(pred>50){
                            checkBtn.classList.add('real');
                        } else {
                            checkBtn.classList.add('fake');
                        }
                        checkBtn.innerText = pred;
                      });
                }
            }

            let buttonDiv = post.querySelector('div');
            let newItem = document.createElement("div");  
            newItem.className = "ibetter_div";
            newItem.appendChild(checkBtn)
            newItem.appendChild(simBtn)
            post.insertBefore(newItem, buttonDiv);
        })
    } 
}


chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);

        let all_posts = document.querySelectorAll('._1dwg._1w_m._q7o');
        all_posts = Array.prototype.filter.call(all_posts,filterByLinkPosts)
        // do it for the initial time
        Array.prototype.forEach.call(all_posts,function(post){
            post_count += 1;
            post.querySelector('._4r_y').classList.add('ibetter_container')
            let buttonDiv = post.querySelector('div');
            let newItem = document.createElement("div");  

            let a = post.querySelectorAll('a[target="_blank"]')
            a = Array.prototype.map.call(a,function(aa){
                return window.decodeURIComponent(aa.search).slice(3).split('&')[0]
            });
            let checkBtn = genButton('Check');
            let simBtn = genButton('Similar');
            let postInfo = {}

            simBtn.onclick = function(){
                if(postInfo.similar_results){
                    let similar_results = postInfo.similar_results
                    link_div = genListOfLinks(similar_results)
                    post.insertBefore(link_div, buttonDiv);
                    console.log(similar_results)
                } else {
                    fetch('https://ibetter.herokuapp.com/api/detect/?url='+a[0])
                      .then(function(response) {
                        return response.json();
                      })
                      .then(function(myJson) {
                        postInfo = myJson;
                        let similar_results = postInfo.similar_results
                        link_div = genListOfLinks(similar_results)
                        post.insertBefore(link_div, buttonDiv);
                        console.log(similar_results)
                      });
                }
            }

            checkBtn.onclick = function(){
                if(postInfo.similar_results){
                    let pred = +postInfo.our_prediction.toFixed(2);
                    if(pred>50){
                        checkBtn.classList.add('real');
                    } else {
                        checkBtn.classList.add('fake');
                    }
                    checkBtn.innerText = pred;
                } else {
                    fetch('https://ibetter.herokuapp.com/api/detect/?url='+a[0])
                      .then(function(response) {
                        return response.json();
                      })
                      .then(function(myJson) {
                        postInfo = myJson;
                        let pred = +postInfo.our_prediction.toFixed(2);
                        if(pred>50){
                            checkBtn.classList.add('real');
                        } else {
                            checkBtn.classList.add('fake');
                        }
                        checkBtn.innerText = pred;
                      });
                }
            }


            newItem.appendChild(checkBtn);
            newItem.appendChild(simBtn)
            newItem.className = "ibetter_div";
            post.insertBefore(newItem, buttonDiv);
        })

        window.addEventListener('scroll', function(e) {
            let pos = document.documentElement.scrollTop;
            if(last_pos < pos){
                addButtonsToPosts()
            }
            last_pos = pos;
        });
	}
	}, 1);
});