"use strict";
/**
 * Effect browser UI layer
 */

var effectbrowser = {
	
	/**
	 * Regenerate timeline based on the new choices made in the editor.
	 */
	reanimate : function() {
						
	
		var baseelem = {				
			type : "image",
			label : null,
			duration : 4.0,
			imageURL : "../testdata/kakku.png"			
		};
		
		var baseplan = [
		     baseelem,
		     baseelem,
		     baseelem
		];
		
		var settings = {

		    // Time in seconds where song starts playing
		    musicStartTime : 0,
		    
		    transitionIn : {
		        type : $("#transitionin option:selected").val() ||"zoomin",
		        duration : 2.0                                             
		    },
		    
		    transitionOut : {
		        type :  $("#transitionout option:selected").val() ||"slightmove",
		        duration : 6.0          
		    },   
		    
		    onScreen : {
		        type : $("#onscreen option:selected").val() ||"zoomout",
		        duration : 2.0
		    }          				
								
		};
		
		for(var i=0; i<baseplan.length; i++) {
			baseplan[i].id = i;
		}
			
		this.createShow(baseplan, settings);						
	},
	
	
	createShow : function(input, settings) {

        var songURL = "../testdata/sample-song.mp3";
		
        var timeliner = krusovice.Timeliner.createSimpleTimeliner(input, sampleSongData, settings);
        var plan = timeliner.createPlan();                              
        
        var visualizer = new krusovice.TimelineVisualizer({plan:plan, rhytmData:sampleSongData});                                
        var div = document.getElementById("visualizer");                               
        visualizer.secondsPerPixel = 0.02;
        visualizer.lineLength = 2000;				        
        visualizer.render(div);          
        
        var audio = document.getElementById("audio");
        audio.setAttribute("src", songURL);
        
        var player = new krusovice.TimelinePlayer(visualizer, audio);
                
        var cfg = {
                rhytmData : sampleSongData,
                songURL : songURL,
                timeline : plan,
                backgroundType : "plain",
                backgroundColor : "#ffffff",
                elem : $("#show")                                                                                
        };
        
        var show = new krusovice.Show(cfg);
        show.bindToAudio(player.audio);   
        
        krusovice.attachSimpleLoadingNote(show);                                                                                                                                
        
        // Automatically start playing when we can do it
        $(show).bind("loadend", function() {
        	audio.play();
        });
        
        show.prepare();
		
	},
	
	/**
	 * Fill in effect selectors
	 */
	populate : function() {
		
		function fill(id, data) {
			var sel = $(id);
			
			var elems = [{id:"random", name:"Random"}] 
			$.merge(elems, data);   
			
			elems.forEach(function(e) {
				sel.append("<option value='" + e.id + "'>" + e.name + "</option>");
			});
		}
		
		var vocab;
		
		vocab = krusovice.effects.Manager.getVocabulary("transitionin");
		fill("#transitionin", vocab);
		
		vocab = krusovice.effects.Manager.getVocabulary("onscreen");
		fill("#onscreen", vocab);

		vocab = krusovice.effects.Manager.getVocabulary("transitionout");
		fill("#transitionout", vocab);
				
	},
	
	init : function() {				
	    this.populate();

	    $("select").change($.proxy(effectbrowser.reanimate, effectbrowser));       
	    $("#reanimate").click($.proxy(effectbrowser.reanimate, effectbrowser));       
	    
	    this.reanimate();	    	    
	}

}


$(document).ready(function() {                                                                                        
	effectbrowser.init();
});
                