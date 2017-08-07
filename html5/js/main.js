"use strict";
var initiate = (function(_root)
{
    var videoElements = {};

	videoElements =
	{
	    container : "#customVideoContainer", // Video Container Name
		video: ".video_player", // HTML5 Video
		muteBtn: ".mute-unmute" , // Mute/Unmute button.
		playBtn: ".play-pause", // Play/Pause button.
		replayBtn : ".replay", // Play video from beginning.
		seekContainer: ".seek-container", //Name of seek  container
		seekBar : ".seek-bar", //Name of the seek bar style it in css.
		volumeSlider : ".volume-range" , //Name of the seek bar style it in css.
		politeAutoplay : true, //Video will be muted and autoplayed.
		autoplay : true, // Make polite autoplay false to  change the value to false if not autoplay
		muted : false, // Make polite autoplay false to  change the value to false if not muted
	};
	(function()
	{
	    var self = this;
	        self.getElement = function(c)
            {
                return document.querySelector(videoElements.container+"").querySelector(c+"");
            }
            self.hasClass = function(el, c)
            {
                console.log(el.classList);
                  if (el.classList)
                    return el.classList.contains(c)
                  else
                    return !!el.className.match(new RegExp('(\\s|^)' + c + '(\\s|$)'))
            }
            self.addClass = function (el, c)
            {
                  if (el.classList)
                    el.classList.add(c)
                  else if (!self.hasClass(el, c)) el.className += " " + c
            }
            self.removeClass = function removeClass(el, c)
            {
                  if (el.classList)
                    el.classList.remove(c)
                  else if (self.hasClass(el, c)) {
                    var reg = new RegExp('(\\s|^)' + c + '(\\s|$)')
                    el.className = el.className.replace(reg, ' ')
                  }
            }
            self.addEvents  = function(elm)
            {
                // Adding Events
                elm.video.addEventListener("timeupdate", trackQuartileEvents, false);
                elm.video.addEventListener("ended", videoEnded, false);
                elm.playBtn.addEventListener("click", playStateHandler, false);
                elm.muteBtn.addEventListener("click", muteStateHandler, false);
                elm.seekContainer.addEventListener("click", seekHandler, false);
                elm.volumeSlider.addEventListener("change", volumeSliderHandler, false);
                elm.replayBtn.addEventListener("click", replayStateHandler, false);
                // On timeupdate
                function trackQuartileEvents(e)
                {
                  var per = parseInt((this.currentTime/this.duration) * 100);
                      elm.seekBar.style.cssText += "width : "+per+"%;";
                }
                // VideoEnded button
                function videoEnded()
                {
                     self.addClass(videoElements.playBtn,"paused");
                     self.removeClass(videoElements.playBtn,"playing");
                     self.addClass(videoElements.replayBtn,"showElm");
                }
                // Play button
                function playStateHandler()
                {
                    self.removeClass(elm.replayBtn,"showElm");self.addClass(elm.replayBtn,"hideElm");
                    if(elm.video.paused)
                    {
                          self.addClass(this,"playing"); self.removeClass(this,"paused");
                          elm.video.play();
                    }
                    else
                    {
                          self.addClass(this,"paused"); self.removeClass(this,"playing");
                          elm.video.pause();
                    }
                }
                // Mute/Unmute button
                function muteStateHandler()
                {
                    if(elm.video.muted)
                    {
                       self.addClass(this,"unmuted"); self.removeClass(this,"muted");
                       elm.volumeSlider.value = 100;
                       elm.video.volume =1;
                       elm.video.muted = false;
                    }
                    else
                    {
                        self.addClass(this,"muted"); self.removeClass(this,"unmuted");
                        elm.volumeSlider.value = 0;
                        elm.video.volume =0;
                        elm.video.muted = true;
                    }
                }
                // Video volume bar controller
                function volumeSliderHandler()
                {
                    videoElements.video.volume = this.value / 100;
                    if(videoElements.video.volume > 0) {
                        self.addClass(videoElements.muteBtn,"unmuted"); self.removeClass(videoElements.muteBtn,"muted");
                        videoElements.video.muted = false;
                    }
                    else {
                        self.addClass(videoElements.muteBtn,"muted"); self.removeClass(videoElements.muteBtn,"unmuted");
                        videoElements.video.muted = true;
                    }
                }
                // Seek container
                function seekHandler(e)
                {
                      var left = (e.pageX - this.offsetLeft),
                          totalWidth = this.offsetWidth,
                          per = ( left / totalWidth ),
                          vid = videoElements.video,
                          time = vid.duration * per;
                          vid.currentTime = time;
                };
                //Replay Button
                function replayStateHandler()
                {
                    self.removeClass(this,"showElm");self.addClass(this,"hideElm");
                    self.addClass(videoElements.playBtn,"playing"); self.removeClass(videoElements.playBtn,"paused");
                    console.dir(elm.video);
                    elm.video.currentTime = 0;
                    elm.video.play();
                }
            },
            self.checkAttributes = function()
            {
                if(videoElements.politeAutoplay || videoElements.autoplay === true && videoElements.muted === true )
                {
                    videoElements.video.setAttribute("autoplay", '');
                    videoElements.video.setAttribute("muted", true);
                    self.addClass(videoElements.playBtn,"playing");
                    self.addClass(videoElements.muteBtn,"muted");
                }
                else
                {
                    if(videoElements.autoplay)
                    {
                        videoElements.video.setAttribute("autoplay", '');
                         self.addClass(videoElements.playBtn,"playing");
                    }
                    if(!videoElements.autoplay)
                    {
                         videoElements.video.removeAttribute("autoplay");
                          self.addClass(videoElements.playBtn,"paused");
                    }
                    if(videoElements.muted)
                    {
                          videoElements.volumeSlider.value = videoElements.video.volume = 0;
                          videoElements.video.setAttribute("muted", true);
                          self.addClass(videoElements.muteBtn,"muted");
                    }
                    if(!videoElements.muted)
                    {
                        videoElements.volumeSlider.value = 50; videoElements.video.volume = 0.50;
                        videoElements.video.removeAttribute("muted");
                        self.addClass(videoElements.muteBtn,"unmuted");
                    }
                }
                videoElements.video.load();
            }
            self.init = function()
            {
                videoElements.video         =  self.getElement(videoElements.video);
                videoElements.muteBtn       =  self.getElement(videoElements.muteBtn);
                videoElements.playBtn       =  self.getElement(videoElements.playBtn);
                videoElements.seekContainer =  self.getElement(videoElements.seekContainer);
                videoElements.seekBar       =  self.getElement(videoElements.seekBar);
                videoElements.volumeSlider  =  self.getElement(videoElements.volumeSlider);
                videoElements.replayBtn     =  self.getElement(videoElements.replayBtn);
                // Check attributes and load with attributes;
                self.checkAttributes();
                self.addEvents(videoElements);
            }
    }).apply(videoElements);
    return videoElements.init;
}(window))();
