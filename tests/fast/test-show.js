'use strict';

var ShowTest = TestCase("Show");

/**
 * Check that show initializas synchronously when we have no media to load.
 * 
 */
ShowTest.prototype.testSyncInit = function() {

	var init = this.basicSetup();	

	var show = init.show;
	
	// Construct all elements
	show.prepare();
	
	assertTrue(show.loaded);
	
	assertEquals(2, show.animatedObjects.length);
}

/**
 * Check that transition out effect which uses reserve.
 * 
 * We need to construct timeline, show and animate one element from the show
 * to see what kind output values we get.
 */
ShowTest.prototype.testReverseAnimation = function() {

	var init = this.basicSetup();	

	// Construct all elements
	init.show.prepare();
	
	// Test one element from the show
	// This has zoomin effect with reverse animation
	var object = init.show.animatedObjects[0];
	
	// Animate the object in the middle of zoom out
	var state = object.animate(5.0);

	// See that state looks sane
	console.log(state);
	
	// Fading away
	assertTrue(state.value < 0.7);
	
	// Pick two Z values to compare
	
	object.animate(5.0);
	var z1 = object.object.position.z;

	object.animate(5.5);
	var z2 = object.object.position.z;

	// We are moving closer to camera
	console.log("z1: " + z1 + " z2:" + z2);
	
	assertTrue(z1 > z2);
	
}



/**
 * Create a single timeline element for testing purposes.
 */
ShowTest.prototype.createTimeline = function() {	
	var timeliner = krusovice.Timeliner.createSimpleTimeliner(simpleElements, null);
	var plan = timeliner.createPlan();
	
	// Do not try to load 
	// image asynchronously during unit tests
	var elem = plan[0];
	
	//elem.image = new Image();
	var canvas = document.createElement("canvas");
	canvas.width = 100;
	canvas.height = 100;
	
	elem.image = canvas;
	
	return plan;
}


/**
 * Set up timeline and show objects basd on our test fixture.
 */
ShowTest.prototype.basicSetup = function() {
		
	var plan = this.createTimeline();
	
    var cfg = {
            rhytmData : null, // No music
            songURL : null,
            timeline : plan,
            elem : null // Don't animate
    };
    
    // Create show
    var show = new krusovice.Show(cfg);		
    
    return {
    	show : show,
    	plan : plan
    }
}


