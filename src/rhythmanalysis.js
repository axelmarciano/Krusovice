/**
 * Wrapper around JSON exported Echo Nest Remix data
 *
 * Note that all clocks here are in milliseconds, not seconds
 * (start, duration).
 *
 */

/*global define,window,console*/

define("krusovice/rhythmanalysis", ["krusovice/thirdparty/jquery-bundle", "krusovice/core"], function($, krusovice) {
"use strict";

/**
 * A proxy object which helper functions to deal with rhytm data.
 *
 * @param data EchoNest rhytm data
 */
krusovice.RhythmAnalysis = function(data) {

	if(!data) {
		throw "Rhythm data must be given";
	}

	this.data = data;

};

krusovice.RhythmAnalysis.prototype = {

    /**
     * @type Number
     *
     * What's the max beat confidense value in the whole song
     */
    maxBeatConfidence : 0,

    /**
     * Scan through all beats and initialize boundaries.
     */
    initBeats : function() {

        // Search max confidence in beats
        var maxBeatConfidence = 0;

        this.data.beats.forEach(function(b) {
            if(b.confidence > maxBeatConfidence) {
                maxBeatConfidence = b.confidence;
            }
        });

        this.maxBeatConfidence = maxBeatConfidence;

        // How sure we must be about the beat to accept it

        if(maxBeatConfidence === 0) {
            // Echo Nest could not analyze confidence, but we still got beat list
            this.minBeatConfidence = 0;
        } else {
           // Use beats by arbitary value
           this.minBeatConfidence = 0.5;
        }

        console.log("Using default beat confidence threshold of " + this.minBeatConfidence);

    },

    /**
     * Find the next starting beat from the certain position
     *
     * @param clock Song position in seconds
     *
     * @param skip Skip rate. 1= every beat, 2 = every second beat
     *
     * @return AudioQuantum object
     */
    findNextBeat :function(clock, skip) {

        var beat = 0;

		var i = 0;

		clock *= 1000;

		var confidenceThreshold = this.minBeatConfidence;

		for(i=0; i<this.data.beats.length; i++) {
            var t = this.data.beats[i];
			if(t.confidence < confidenceThreshold) {
                continue;
            }

			if(t.start > clock) {
				beat = t;
				break;
			}

		}

        return beat;
    },

    /**
     * @param clock Song position in seconds
     */
    findBeatAtClock : function(clock) {

        var beat = 0;

        var i = 0;

        clock *= 1000;

        var confidenceThreshold = this.minBeatConfidence;

        for(i=0; i<this.data.beats.length; i++) {
            var t = this.data.beats[i];
            if(t.confidence < confidenceThreshold) {
                continue;
            }

            if(clock >= t.start && clock < t.start + t.duration) {
                beat = t;
                break;
            }

        }

        return beat;

    },

    /**
     * Generic AudioQuantum array search
     *
     * @param {Object} array
     * @param {Object} name
     * @param {Object} clock
     * @param {Object} skip
     * @param {Object} confidence
     */
    findLast: function(array, clock, skip, confidenceThreshold) {

        var item = null;

        var i;
        for(i=0; i<array.length;i++) {

		    var t = array[i];

            if(t.confidence < confidenceThreshold) {
                continue;
            }

            if(t.start > clock) {
                break;
            }

            item = t;
        }

        return item;
    },



    /**
     * Return the next bar following a chosen moment.
     *
     * @param {Number} clock Time in seconds
     *
     * @return bar index or -1 if no hit
     */
    findBarAtClock : function(clock) {
        var i;
        var bars = this.data.bars;

        // Convert to ms
        clock *= 1000;

        for(i=0; i<bars.length; i++) {
            var b = bars[i];

            if(clock >= b.start && clock < b.start+b.duration) {
                return i;
            }
        }

        return -1;
    },



    /**
     * Return the bar being played at certain moment.
     *
     * @param {Number} clock Time in seconds
     *
     * @return bar index or -1 if no hit
     */
    findNextBar : function(clock) {
        var bari = this.findBarAtClock(clock);

        bari += 1;

        if(bari >= this.data.bars.length) {
            return -1;
        }
        return bari;
    }

};

});
