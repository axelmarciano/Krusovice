/*global document, require, simpleElements, sampleSongData, console, jQuery, $ */

/* Sample songs

http://localhost:8000/olvi/music/irreplaceableperson.json
http://localhost:8000/olvi/music/TNT.json

*/

"use strict";

require(["krusovice/api", "../../src/thirdparty/domready!"], function(krusovice) {

    // Create a show with two elements
    var simpleElements = [
            {
                type : "image",
                id : 0,
                label : null,
                duration : 10,
                imageURL : "../../testdata/kakku.png"
            },

            {
                type : "text",
                id : 1,
                shape : "clear",
                texts : {
                     text : "long long long long long text"
                },
                duration : 10
            },

            {
                type : "text",
                id : 3,
                shape : "clear",
                texts : {
                     text : "Third elem"
                },
                duration : 6.0
            }
    ];



   simpleElements.forEach(function(e) {
        e.transitions = {
            transitionIn : {
                type : "zoomfar",
                duration : 1
            },
            transitionOut : {
                type : "zoomin",
                duration : 1
            },
            onScreen : {
                type : "slightrotatez"
            }
        };
   });


  /**
   *  Create a visualization with realistic transition parameters.
   *
   * Load Echo Nest audio data over AJAX, make timing plan for it and visualize it.
   */
  function doVis(url){
      $.getJSON(url, function success(data) {
          var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, data);
          timeliner.leadTime = 3;
          timeliner.steppingTime = 1.5;

          // Start playing in 5 seconds
          timeliner.musicStartTime = 0;

          var plan = timeliner.createPlan();

          var visualizer = new krusovice.TimelineVisualizer({plan:plan, rhythmData:data});
          var div = document.createElement("div");
          visualizer.secondsPerPixel = 0.02;
          visualizer.lineLength = 2000;
          visualizer.render(div);

          $("#results").append("<p>" + url + "</p>");

          $("#results").append(div);

      });
  }

  function go() {

      $("#results").empty();

      var urls = $("textarea").val().split("\n");

      urls.forEach(function(u) {
        u = u.trim();
        if(u !== "") {
            doVis(u);
        }
      });
  }

  function init() {
    $("button").click(function() {
        go();
    });
  }

  init();

});