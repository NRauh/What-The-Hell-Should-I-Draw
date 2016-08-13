// Function for updating the subject value in various places
function updateSubject(subject) {
	var inspiration = {
		tag: "Want inspiration? Have no idea what " + subject + " looks like?",
		google: "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(subject),
		bing: "https://www.bing.com/images/search?q=" + encodeURIComponent(subject),
		flickr: "https://secure.flickr.com/search/?q=" + encodeURIComponent(subject),
		deviantart: "http://www.deviantart.com/?q=" + encodeURIComponent(subject),
		picsearch: "http://www.picsearch.com/index.cgi?q=" + encodeURIComponent(subject)
	}

	$("#subject").text(subject);
	$("#modal > .modal-content > p > em").text(subject);
	$("#inspiration > .slide-box > h3").text(inspiration.tag);

	// while possible to loop the links, getting the inspiration links
	// isn't possible by index, which is why I'm doing it like this
	var links = $("#inspiration > .slide-box > ul > li a");
	$(links[0]).attr("href", inspiration.google);
	$(links[1]).attr("href", inspiration.bing);
	$(links[2]).attr("href", inspiration.flickr);
	$(links[3]).attr("href", inspiration.deviantart);
	$(links[4]).attr("href", inspiration.picsearch);
}


// Functions for getting, adding, and flagging subjects
// i.e. that interact with the backend
function getSubject() {
	$.get("/api/getsubject", function(data) {
		if (data.err) {
			return console.log("Error with API:", data.err);
		}
		updateSubject(data.sub);
	});
}

function addSubject() {
	var newSubject = $("#new-subject-form input:text").val();

	$.post("/api/addsubject", {subject: newSubject}, function(data) {
		if (data.err) {
			return showErr(data.err);
		} else {
			return showMsg(data.msg);
		}
	});
}

function flagSubject() {
	var flaggedSubject = $("#flag-subject-form input:text").val();
	var currentSubject = $("#subject").text();

	if (flaggedSubject !== currentSubject) {
		return showErr("What you typed doesn't match what you're trying to flag");
	}

	$.post("/api/flagsubject", {subject: flaggedSubject}, function(data) {
		if (data.err) {
			return showErr(data.err);
		} else {
			return showMsg(data.msg);
		}
	});
}

// Snazzy visual feedback if the typed word will be correct
function flagWatch() {
	$("#flag-subject-form input:text").keyup(function() {
		var currentSubject = $("#subject").text();
		var currentlyTyped = $(this).val();

		if (currentlyTyped === currentSubject) {
			$("#flag-subject-form input:submit").removeAttr("disabled");
			$("#flag-subject-form input:submit").removeClass("pure-button-disabled");
		}
	});
}


// Display and close modal functions
function showModal() {
	$("body").prepend("<div class='modal-shadow'></div>");
	$("#modal").css("display", "block");

	$(".modal-shadow").click(function() {
		closeModal();
	});

	$(".modal-footer > button").click(function() {
		closeModal();
	});
}

function closeModal() {
	$(".modal-shadow").remove();
	$("#modal").css("display", "none");
}


// Show and dismiss messages
function showErr(err) {
	var errHtml = "<div class='news bad-news pure-u-1'><p>Whoops! " + err + "</p></div>"
	$("#messages").prepend(errHtml);
	dismissMessage();
}

function showMsg(msg) {
	var msgHtml = "<div class='news good-news pure-u-1'><p>Great! " + msg + "</p></div>"
	$("#messages").prepend(msgHtml);
	dismissMessage();
}

function dismissMessage() {
	$(".news").click(function() {
		this.remove();
	});
}

// Display a slide when the bottom buttons are clicked
function displaySlide() {
	var slides = ["#inspiration", "#add-subject", "#flag-subject"];

	$("#bottom > button").click(function() {
		var buttonIndex = $(this).index();
		var selectedSlide = $(slides[buttonIndex]);

		if (selectedSlide.css("display") === "block") {
			selectedSlide.css("display", "none");
		} else {
			slides.forEach(function(el) {
				if ($(el).css("display") === "block") {
					$(el).css("display", "none");
				}
			});
			selectedSlide.css("display", "block");
		}
	});
}

$(document).ready(function() {
	// Get initial subject
	getSubject();

	// Do things on main button click
	$("#hell-no").click(function() {
		getSubject();
	});

	$("#hell-yeah").click(function() {
		showModal();
	});

	// Do things on bottom button click
	displaySlide();

	// Do things on add subject form being submitted
	$("#new-subject-form input:submit").click(function(e) {
		e.preventDefault();
		addSubject();
	});

	// Monitor status of flag, and do things on it's submission
	flagWatch();

	$("#flag-subject-form input:submit").click(function(e) {
		e.preventDefault();
		flagSubject();
	});
});

