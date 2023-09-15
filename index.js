import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid'; // 36 characters string generated

const localStorageData = JSON.parse(localStorage.getItem('myTweets'))
if(!localStorageData){
    localStorage.setItem('myTweets', JSON.stringify([]))
} else {
    console.log('storage exists no need create');
}

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    } else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    } else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } else if(e.target.dataset.specificTweet){
        specificTweetReplyBtnClick(e)
    } else if(e.target.dataset.outerModal){
        closeModal(e)
        handleReplyClick(e.target.dataset.outerModal)
    } else if(e.target.dataset.specificTweetBtn){
        postSpecificTweetReply(e)
    } else if(e.target.dataset.delete){
        deleteTweet(e.target.dataset.delete)
    }
})
//like
function handleLikeClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if(targetTweetObj.isLiked){
        targetTweetObj.likes--
    }else{
        targetTweetObj.likes++
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    updateLocalStorage(targetTweetObj)
    render()
}
//retweet
function handleRetweetClick(tweeId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweeId
    })[0]
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    updateLocalStorage(targetTweetObj)
    render()
}
//reply
function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}
//tweet
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value){
    const newTweet =  {
        handle: `@CrispMars`,
        profilePic: `images/mars.jpg`,
        likes: 0,
        retweets: 0,
        tweetText: tweetInput.value,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
    }
    tweetsData.unshift(newTweet)
    updateLocalStorage(newTweet)
    render()
    tweetInput.value = ''
}
}

//modal open
function specificTweetReplyBtnClick(e){
    document.getElementById(`modal-outer-${e.target.dataset.specificTweet}`).classList.toggle('hidden')
}

//modal close
function closeModal(e){
    document.getElementById(`modal-outer-${e.target.dataset.outerModal}`).classList.toggle('hidden')
}

//post specific tweet reply
function postSpecificTweetReply(e){
    const uuidTemp = e.target.dataset.specificTweetBtn;
    let userInput = document.getElementById(`sp-repl-${uuidTemp}`).value
    const userReplyObj = {
                                        handle: `@CrispMars`,
                                        profilePic: `images/mars.jpg`,
                                        tweetText: userInput,
                                    }

    const addReplyObj = tweetsData.filter(function(tweet){
        return tweet.uuid === uuidTemp
    })[0]

    addReplyObj.replies.push(userReplyObj)

    document.getElementById(`sp-repl-${uuidTemp}`).value = ""

    document.getElementById(`modal-outer-${uuidTemp}`).classList.toggle('hidden')
    render()
    // console.log(tweetsData)
}


function createObjForLocalStorage(tweet){
        let tweetDataObj = {
            tweetText: tweet.tweetText,
            likes: tweet.likes,
            retweets: tweet.retweets,
            uuid: tweet.uuid
        }
    return tweetDataObj
}

function updateLocalStorage(tweet){
    const newObj = createObjForLocalStorage(tweet)
    let dataFromLocalStorage = localStorageData
    if(!checkIfTweetInLocalStorage(newObj)){

        //adding new object to storage
        dataFromLocalStorage.unshift(newObj)

        localStorage.setItem('myTweets', JSON.stringify(dataFromLocalStorage))
        
        //updating existent object in storage
    } else if(checkIfTweetInLocalStorage(newObj)){
        const index = dataFromLocalStorage.findIndex(item => item.uuid === newObj.uuid)
        dataFromLocalStorage.splice(index, 1, newObj);
        localStorage.setItem('myTweets', JSON.stringify(dataFromLocalStorage))
    }
}

function deleteTweet(tweetId) {
    //delete tweet from tweetsData
    let index = tweetsData.findIndex(item => item.uuid === tweetId)
    console.log(index);
    tweetsData.splice(index, 1)
    //delete tweet from local storage
    let dataFromLocalStorage = localStorageData
    if(dataFromLocalStorage){
    const storageIndex = dataFromLocalStorage.findIndex(item => item.uuid === tweetId)
    dataFromLocalStorage.splice(storageIndex, 1)
    localStorage.clear()
    localStorage.setItem('myTweets', JSON.stringify(dataFromLocalStorage))
    }
    render()
}






function checkIfTweetInLocalStorage(tweet){
    let isInStorage = false
    if(localStorageData){
        JSON.parse(localStorage.getItem('myTweets')).forEach(function(localStoragetweet){
        if(localStoragetweet.uuid === tweet.uuid){
            isInStorage = true
        }
    })}
    return isInStorage
}



function getFeedHtml(){
    let feedHtml = ""
    tweetsData.forEach(function(tweet){
        let likeIconClass = tweet.isLiked ? 'liked':''
        let retweetIconClass = tweet.isRetweeted ? 'retweeted':''




        //render specific tweet replies
        let repliesHtml = `<button data-specific-tweet="${tweet.uuid}">reply</button>`
        let modalHtml = `
                                    <div class="modal-outer hidden" id="modal-outer-${tweet.uuid}" data-outer-modal="${tweet.uuid}">
                                        <div class="modal" id="modal-${tweet.uuid}">
                                            <textarea data-specific-reply="${tweet.uuid}" id="sp-repl-${tweet.uuid}" placeholder="reply on ${tweet.handle} tweet"></textarea>
                                            <button class="narrow-btn" data-specific-tweet-btn="${tweet.uuid}">reply</button>
                                        </div>
                                    </div>
                                    `
        if(tweet.replies.length){
            tweet.replies.forEach(function(reply){
                repliesHtml += `<div class="tweet-reply">
                                          <div class="tweet-inner">
                                              <img src="${reply.profilePic}" class="profile-pic">
                                                  <div>
                                                      <p class="handle">${reply.handle}</p>
                                                      <p class="tweet-text">${reply.tweetText}</p>
                                                  </div>
                                            </div>
                                        </div>
                                        `
            })
        } 
        repliesHtml += modalHtml
     





        //render tweets
        feedHtml += `<div class="tweet">
                    <div class="tweet-inner">
                        <img src="${tweet.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${tweet.handle}</p>
                            <p class="tweet-text">${tweet.tweetText}</p>
                            <div class="tweet-details">
                                <span class="tweet-detail">
                                    <i class="fa-regular fa-comment-dots" data-reply = "${tweet.uuid}"></i>
                                    ${tweet.replies.length}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                                    ${tweet.likes}
                                </span>
                                <span class="tweet-detail">
                                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                                    ${tweet.retweets}
                                </span>
                                <span class="tweet-detail">
                                <i class="fa-solid fa-trash-can" data-delete="${tweet.uuid}"></i>
                                </span>
                            </div>   
                        </div>            
                    </div>
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                </div>
                `
     })
     return feedHtml
}

function render(){
    document.getElementById("feed").innerHTML = getFeedHtml();
}
render()