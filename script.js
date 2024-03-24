
var i = 0,
	minimizedWidth = new Array,
	minimizedHeight = new Array,
	windowTopPos = new Array,
	windowLeftPos = new Array,
	panel,
	id;

function adjustFullScreenSize() {
	$(".fullSizeWindow .wincontent").css("width", (window.innerWidth - 32));
	$(".fullSizeWindow .wincontent").css("height", (window.innerHeight - 98));
}
function makeWindowActive(thisid) {
	$(".window").each(function () {
		$(this).css('z-index', $(this).css('z-index') - 1);
	});
	$("#window" + thisid).css('z-index', 1000);
	$(".window").removeClass("activeWindow");
	$("#window" + thisid).addClass("activeWindow");

	$(".taskbarPanel").removeClass('activeTab');

	$("#minimPanel" + thisid).addClass("activeTab");
}

function minimizeWindow(id) {
	windowTopPos[id] = $("#window" + id).css("top");
	windowLeftPos[id] = $("#window" + id).css("left");

	$("#window" + id).animate({
		top: 800,
		left: 0
	}, 200, function () {		//animation complete
		$("#window" + id).addClass('minimizedWindow');
		$("#minimPanel" + id).addClass('minimizedTab');
		$("#minimPanel" + id).removeClass('activeTab');
	});
}

function openWindow(id) {
	if ($('#window' + id).hasClass("minimizedWindow")) {
		openMinimized(id);
	} else {
		makeWindowActive(id);
		$("#window" + id).removeClass("closed");
		$("#minimPanel" + id).removeClass("closed");
	}
}
function closeWindwow(id) {
	$("#window" + id).addClass("closed");
	$("#minimPanel" + id).addClass("closed");
}

function openMinimized(id) {
	$('#window' + id).removeClass("minimizedWindow");
	$('#minimPanel' + id).removeClass("minimizedTab");
	makeWindowActive(id);

	$('#window' + id).animate({
		top: windowTopPos[id],
		left: windowLeftPos[id]
	}, 200, function () {
	});
}

$(document).ready(function () {
	$(".window").each(function () {      		// window template
		$(this).css('z-index', 2)
		$(this).attr('data-id', i);
		minimizedWidth[i] = $(this).width();
		minimizedHeight[i] = $(this).height();
		windowTopPos[i] = $(this).css("top");
		windowLeftPos[i] = $(this).css("left");
		$("#taskbar").append('<div class="taskbarPanel" id="minimPanel' + i + '" data-id="' + i + '"><img src="' + $(this).attr("data-title") + '"></div>');
		if ($(this).hasClass("closed")) { $("#minimPanel" + i).addClass('closed'); }
		$(this).attr('id', 'window' + (i++));
		$(this).wrapInner('<div class="wincontent"></div>');
		$(this).prepend('<div class="windowHeader"><strong>' + $(this).attr("data-name") + '</strong><span title="Minimize" class="winminimize"><span></span>◡</span><span title="Maximize" class="winmaximize"><span></span>◠<span></span></span><span title="Close" class="winclose">●</span></div>');
	});

	$("#minimPanel" + (i - 1)).addClass('activeTab');
	$("#window" + (i - 1)).addClass('activeWindow');

	$(".wincontent").resizable();			// resizable
	$(".window").draggable({ cancel: ".wincontent" });	// draggable


	$(".window").mousedown(function () {		// active window on top (z-index 1000)
		makeWindowActive($(this).attr("data-id"));
	});

	$(".winclose").click(function () {		// close window
		closeWindwow($(this).parent().parent().attr("data-id"));
	});

	$(".winminimize").click(function () {		// minimize window
		minimizeWindow($(this).parent().parent().attr("data-id"));
	});

	$(".taskbarPanel").click(function () {		// taskbar click
		id = $(this).attr("data-id");
		if ($(this).hasClass("activeTab")) {	// minimize if active
			minimizeWindow($(this).attr("data-id"));
		} else {
			if ($(this).hasClass("minimizedTab")) {	// open if minimized
				openMinimized(id);
			} else {								// activate if inactive
				makeWindowActive(id);
			}
		}
	});

	// Cuando se haga clic en el botón de menú
	$(".menuButton").click(function () {
		// Obtener el menú desplegable asociado
		var dropdownMenu = $(this).siblings(".dropdownMenu");
		// Alternar la visibilidad del menú desplegable
		dropdownMenu.toggle();
	});

	// Ocultar el menú desplegable cuando se haga clic en cualquier parte de la página, excepto en el menú
	$(document).click(function (event) {
		if (!$(event.target).closest(".taskbarPanel").length) {
			$(".dropdownMenu").hide();
		}
	});


	$(".openWindow").click(function () {		// open closed window
		openWindow($(this).attr("data-id"));
	});

	$(".winmaximize").click(function () {
		if ($(this).parent().parent().hasClass('fullSizeWindow')) {			// minimize

			$(this).parent().parent().removeClass('fullSizeWindow');
			$(this).parent().parent().children(".wincontent").height(minimizedHeight[$(this).parent().parent().attr("data-id")]);
			$(this).parent().parent().children(".wincontent").width(minimizedWidth[$(this).parent().parent().attr("data-id")]);
		} else {															// maximize
			$(this).parent().parent().addClass('fullSizeWindow');

			minimizedHeight[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").height();
			minimizedWidth[$(this).parent().parent().attr('data-id')] = $(this).parent().parent().children(".wincontent").width();

			adjustFullScreenSize();
		}
	});
	adjustFullScreenSize();
});  

function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth() + 1; // Los meses comienzan desde 0
    var year = now.getFullYear();

    // Añadir ceros delante si es necesario
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    month = month < 10 ? "0" + month : month;

    // Formatear la fecha y la hora
    var currentTime = hours + ":" + minutes;
    var currentDate = day + "/" + month + "/" + year;

    // Actualizar el contenido del reloj en el DOM
    document.getElementById("clock").innerHTML = currentTime + " " + currentDate ;
}

// Actualizar el reloj cada segundo
setInterval(updateClock, 1000);

// Llamar a la función para actualizar el reloj una vez al cargar la página
updateClock();
