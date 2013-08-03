(function() {
// Simple modification based on mbostock's Bullet Charts.
d3.bulleT = function() {
  var orient = "left",
      reverse = false,
      vertical = false,
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

      var wrap = g.select("g.wrap");
      
      if (wrap.empty()) wrap = g.append("g").attr("class", "wrap");
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
      var range = wrap.selectAll("rect.range")
          .data(rangez);
      range.enter().append("rect")
          .filter( function(d, i){ if(i != 3){ return d} })
          .attr("class", function(d, i) { return "range s" + i; })
          .attr("width", w)
          .attr("y", 0)
          .attr("height",height)
          .attr("x", reverse ? x0 : terjedelemz[0]);
      range.enter().append("line")
          .filter( function(d, i){ if(i == 3){ return d} })
          .attr("class", "marker")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", 0)
          .attr("y2", height);
      
      // Append the measure rects.
      measurez.unshift(terjedelemz[1]);
      var measure = wrap.selectAll("rect.measure")
          .data(measurez);
      measure.enter().append("rect")
          .attr("class", function(d, i) { return "measure s" + i; })
          .attr("width", w)
          .attr("height", height / 3)
          .attr("x", reverse ? x0 : terjedelemz[0])
          .attr("y", height / 3);
      // Append rect and line marker.    
      var marker = wrap.selectAll("rect.marker")
          .data(markerz);
      marker.enter().append("rect")
          .filter( function(d, i){ if(i == 1){ return d} })
          .attr("class", "marker s1")
          .attr("width", 6)
          .attr("y", -(height/10))
          .attr("height",function(d) {return height+(height/5);})
          .attr("x", x0)
          .attr("transform", "translate(-3,0)");
      marker.enter().append("line")
          .filter( function(d, i){ if(i == 0){ return d} })
          .attr("class", "marker s0")
          .attr("x1", x0)
          .attr("x2", x0)
          .attr("y1", height / 3)
          .attr("y2", height-(height / 3) );
               
      // Compute the tick format.
      var format = tickFormat || x0.tickFormat(8);

      // Update the tick groups.
      var tick = g.selectAll("tick")
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
          .attr("transform", function(d){
            if (vertical) {
              return "rotate(90)";
            }
          })
          .attr("dy",  function(d){
            if(vertical){return width/60; }else{ return height+15 }
          })
          .attr("dx",  function(d){
            if(vertical){return height+15 ;}
          })
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
  bulleT.vertical = function(x) {
    if (!arguments.length) return vertical;
    vertical = x;
    return bulleT;
  };
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
