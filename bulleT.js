(function() {
// Simple modification based on mbostock's Bullet Charts.
// 
// Chart design based on the recommendations of Stephen Few. Implementation
// based on the work of Clint Ivy, Jamie Love, and Jason Davies.
// http://projects.instantcognition.com/protovis/bulletchart/
d3.bulleT = function() {
  var orient = "left", // TODO top & bottom
      reverse = false,
      duration = 0,
      terjedelem = bulleTTerjedelem,
      ranges = bulleTRanges,
      markers = bulleTMarkers,
      measures = bulleTMeasures,
      width = 380,
      height = 30,
      tickFormat = null;

  // For each small multiple…
  function bulleT(g) {
      
    g.each(function(d, i) {
      var terjedelemz = terjedelem.call(this, d, i),
          rangez = ranges.call(this, d, i).slice().sort(d3.descending),
          markerz = markers.call(this, d, i),
          measurez = measures.call(this, d, i).slice().sort(d3.descending),
          g = d3.select(this);
      // Compute the x-scale.
      var x0 = d3.scale.linear()
          .domain([terjedelemz[0], terjedelemz[1]])
          .range(reverse ? [width, terjedelemz[0]] : [terjedelemz[0], width]);

      // Stash the new scale.
      this.__chart__ = x0;

      // Derive width-scales from the x-scales.
      var w = bulleTWidth(x0,terjedelemz[0]);

      // Update the range rects.
      rangez.unshift(terjedelemz[1]);
      var range = g.selectAll("rect.range")
          .data(rangez);

      range.enter().append("rect")
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w)
          .attr("y", function(d, i) {
            if ( (i==0)||(i==3) ){
              return -1;
            }else{
              return 0;
            }
          })
          .attr("height", function(d, i) {
            if ( (i==0)||(i==3) ){
              return height+2;
            }else{
              return height;
            }
          })
          .attr("x", reverse ? x0 : terjedelemz[0]);
          
      // Update the measure rects.
      measurez.unshift(terjedelemz[1]);       
      var measure = g.selectAll("rect.measure")
          .data(measurez);

      measure.enter().append("rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w)
          .attr("height", height / 2)
          .attr("x", reverse ? x0 : terjedelemz[0])
          .attr("y", height / 4);
          
      // Update the marker lines.
      var markerLine = g.selectAll("line.marker")
          .data(markerz.slice(0,1)); // 1,2
      markerLine.enter().append("line")
          .attr("class", function(d) { return "marker s0" })     
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", function(d) {return height / 4;})
          .attr("y2", function(d) {return height - height / 4;}); 
          
      // Update the marker lines.
      var markerRect = g.selectAll("rect.marker")
          .data(markerz.slice(1,2)); // 
      markerRect.enter().append("rect")
          .attr("class", function(d) { return "marker s1" })     
          .attr("x", x0)
          .attr("transform", "translate(-3,0)")
          .attr("width", 6)
          .attr("y", -4)
          .attr("height", function(d) {return height+8;});
           
      // Compute the tick format.
      var format = tickFormat || x0.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("g.tick")
          .data(x0.ticks(8), function(d) {
            return this.textContent || format(d);
          });

      // Initialize the ticks with the old scale, x0.
      var tickEnter = tick.enter().append("g")
          .attr("class", "tick")
          .attr("transform", bulleTTranslate(x0))
          .style("opacity", 1);

      tickEnter.append("line")
          .attr("y1", height)
          .attr("y2", height * 7 / 6);

      tickEnter.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "1em")
          .attr("y", height * 7 / 6)
          .text(format);
    });
  }

  // left, right, top, bottom
  bulleT.orient = function(x) {
    if (!arguments.length) return orient;
    orient = x;
    reverse = orient == "right" || orient == "bottom";
    return bulleT;
  }; 

  // terjedelem
  bulleT.terjedelem = function(x) {
    if (!arguments.length) return terjedelem;
    terjedelem = x;
    return bulleT;
  };

  // ranges (bad, satisfactory, good)
  bulleT.ranges = function(x) {
    if (!arguments.length) return ranges;
    ranges = x;
    return bulleT;
  };
//*
  // markers (previous, goal)
  bulleT.markers = function(x) {
    if (!arguments.length) return markers;
    markers = x;
    return bulleT;
  };

  // measures (actual, forecast)
  bulleT.measures = function(x) {
    if (!arguments.length) return measures;
    measures = x;
    return bulleT;
  };
//*/
  bulleT.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bulleT;
  };

  bulleT.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bulleT;
  };

  bulleT.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bulleT;
  };
  return bulleT;
};

function bulleTTerjedelem(d) {
  return d.terjedelem;
}

function bulleTRanges(d) {
  return d.ranges;
}

function bulleTMarkers(d) {
  return d.markers;
}

function bulleTMeasures(d) {
  return d.measures;
}

function bulleTTranslate(x) {
  return function(d) {
    return "translate(" + x(d) + ",0)";
  };
}
  
function bulleTWidth(x,y) {
  var x0 = x(0);
  return function(d) {
    return Math.abs(x(d-y) - x0);
  };
}

})();
