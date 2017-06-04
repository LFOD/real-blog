$( document ).ready(() => {

    //javascript for intro loader

    //Function to immitate R's seq
    function seq(start, end, increment) {
      var length = Math.round((end - start)/increment);
      return Array(length).fill().map((_, idx) => start + idx*increment)
    }


    //define the pdf of the distribution.
    var logistic = function(x, theta, i) {
        var mu = 0.1;
        sign = 1
        var y = sign * (1 / (Math.sqrt(2 * Math.PI) * theta)) * (1 / x) *
            Math.exp(-Math.pow((Math.log(x) - mu), 2) / (2 * Math.pow(theta, 2)))
        return y;
    }

    var width   = $(".main-header").width() ,
        height  = $(".main-header").outerHeight(),
        padding = 10,
        numOfLines = 20,
        xs = seq(0.01, 5, .01),
        colors = ['rgb(165,0,38)', 'rgb(215,48,39)', 'rgb(244,109,67)', 'rgb(253,174,97)', 'rgb(254,224,144)',
            'rgb(224,243,248)', 'rgb(171,217,233)', 'rgb(116,173,209)', 'rgb(69,117,180)', 'rgb(49,54,149)'
        ];
  
    console.log("trying to run this shit.")
    //define the svg.
    var svg = d3.select("#header_viz").append("svg")
        .attr("width", width)
        .attr("height", height + 2 * padding)
        .append("g")


    var animatelines = function(whichline) {
        d3.selectAll(".line").style("opacity","0.5");

        //Select All of the lines and process them one by one
        d3.selectAll(".line").each(function(d,i){
            // Get the length of each line in turn
            var totalLength = d3.select("#line" + i).node().getTotalLength();

            d3.selectAll("#line" + i).attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
              .duration(5000)
              .delay(100*i)
              .attr("stroke-dashoffset", 0)
              .style("stroke-width",2)
        })

        writeGreeting()
    }



    // The Scales:
    var thetaMap = d3.scaleLinear() //name the values from 0 to 20 and make their values from .1-.7
        .domain([0, numOfLines])
        .range([0.8, 0.085])

    var yPos = d3.scaleLinear() //scalling for creating horizontal lines
        .domain([0, numOfLines])
        .range([0, 4])

    var x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, 4.5])
        .range([height, 0]);

    // The line functions:
    var logistic = d3.range(numOfLines).map(function(i) {
        var odd = true
        var toReturn = xs.map(function(num) {
            return {
                "x": num,
                "y": logistic(num, thetaMap(i), i)
            }
        })
        return toReturn;
    })

    //make a greeting message for after the line animation.
    function writeGreeting(){

        var text_scale = width < 500 ? 1 : 0.65;
        console.log(text_scale);
        var intro_text = "Live Free or Dichotomize";

        var title = svg.append("text")
            .attr("font-size", 30)
            .attr("font-family", "optima")
            .attr("text-anchor", "end")
            .attr("fill-opacity", 0.65)
            .attr("x", width < 500 ? x(4.8) : x(4.2))
            .attr("y", width < 500 ? y(3.12) : y(2.1) )
            .attr("opacity", 0)
            .text(intro_text)
            .attr("font-size", function(d) { return ( text_scale*width - 8) / this.getComputedTextLength() * 24 + "px"; })
            .text("")
            .attr("opacity", 1);

        (function drawGreeting (i, start, greeting) {
            setTimeout(function () {

                //add next letter to the greeting in progress
                start += greeting[i];

                title.html(start) //append this to the html

                if (start.length < greeting.length) { //if the in progress greeting is less than the full, keep going.
                    drawGreeting(i+1,start,greeting);      //  increment i and call again.
                };
            }, 100)
        })(0, "", intro_text);
    }


    // The d3 stuff
    var line = d3.line()
        // .interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });


    svg.selectAll(".line")
        .data(logistic)
        .enter().append("path")
        .attr("class", "line")
        .attr("id" , function(d, i){ return "line" + i;})
        .attr("d", line)
        .style("stroke-width", 2)
        .style("stroke", function(d, i) { return colors[i % 10] })
        .style("opacity", 0)
        .style("fill", "none")
        .on("mouseover", function(d){
            d3.select(this).style("stroke", "black")
        })
        .on("mouseout", function(d,i){
            d3.select(this).style("stroke", colors[i % 10])
        })

    // var introMessage = isMobile ? "tap" : "click"
    // var introMessage = "click"
    //
    // var intro = svg.append("text")
    //     .text(introMessage)
    //     .attr("font-size", 35)
    //     .attr("font-family", "optima")
    //     .attr("text-anchor", "middle")
    //     .attr("x", x(2.5))
    //     .attr("y", y(2.01))

    //kick it off on a click. (or tap)
    animatelines(2)
    // d3.select("svg").on("click", function() { animatelines(2) })

})
