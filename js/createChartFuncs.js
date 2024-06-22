var createGenreChart = function(container,data_source,chart_name, start_year,end_year){
    var genres = ["Action","Animation","Comedy","Drama","Documentary","Romance"];

    var genre_svg = dimple.newSvg(container, "100%", "100%");
    var legend_title = "Legend";
    d3v3.tsv(data_source, function (year_data) {
      console.log(year_data)
      year_data = year_data.filter(function(entry){return entry.year>=start_year
                                                          && entry.year<=end_year;});

      var count_data = year_data.map(function(entry){
        return {'Year':entry.year,
                'Count':entry.count};
      });

      var genre_data = year_data.map(function(entry){
        return genres.map(function(genre){
          return {'Year':entry.year,
                  'Genre':genre,
                  'Count':entry[genre]};
          });
        })
      .reduce(function(all_data,year_data){
        return all_data.concat(year_data);
       },[]);

      console.log(genre_data);
      console.log(count_data);

      var genre_chart = new dimple.chart(genre_svg);
      genre_chart.setMargins("10%", "12%", "16%", "14%");

      var x_axis = genre_chart.addTimeAxis("x", "Year");
      x_axis.timePeriod = d3v3.time.years;
      x_axis.timeInterval = 5;

      x_axis.tickFormat = "%Y";

      var y_axis = genre_chart.addMeasureAxis("y", "Count");
      y_axis.oldFormat = y_axis.tickFormat;
      y_axis.tickFormat = 'd';

      var genreSeries = genre_chart.addSeries("Genre", dimple.plot.area, [x_axis, y_axis]);
      genreSeries.data = genre_data;
      genreSeries.interpolation = "cardinal";

      var c_axis = genre_chart.addColorAxis(null, "#000000");
      var countSeries = genre_chart.addSeries(null, dimple.plot.line, [x_axis, y_axis, c_axis]);
      countSeries.data = count_data;
      countSeries.interpolation = "cardinal";
      countSeries.lineWeight = 6;

      var legend = genre_chart.addLegend("-10%", "25%", "10%", "50%", "Right");
      legend.verticalPadding = 20;
      legend._getEntries_old = legend._getEntries;
      legend._getEntries = function()
      {
        entries = legend._getEntries_old.apply(this, arguments).reverse();
        entries[0].stroke = '#405869';
        entries[0].fill = '#405869';
        entries[0].key = 'Total Movies';
        return entries;
      }

      genre_chart.draw();

      genre_svg.append("text")
       .attr("x", "50%")
       .attr("y", "5%")
       .style("text-anchor", "middle")
       .style("font-family", "sans-serif")
       .text(chart_name);

      genre_svg.selectAll("title_text")
        .data([legend_title])
        .enter()
        .append("text")
          .attr("x", "88%")
          .attr("y", "25%")
          .style("font-family", "sans-serif")
          .style("color", "Black")
          .text(function (d) { return d; });

      var tickCounter = 1;
      x_axis.shapes.selectAll("text").each(function (d) {
        if (tickCounter % 2 !== 0) {
            this.remove();
        }
        tickCounter += 1;
      });

      genre_chart.legends = [];
      var filterValues = genres;
      var displayingTotal = true;
      legend.shapes.selectAll("rect")
        .attr("cursor","pointer")
        .on("click", function (e) {
          var clickedOnText=e.aggField.slice(-1)[0];
          console.log('Clicked on '+clickedOnText);
          if('All'===clickedOnText){
            if(displayingCounts){
              if(displayingTotal){
                d3v3.select(this).style("opacity", 0.2);
                countSeries.data = [];
                genre_chart.draw(800);
                displayingTotal = false;
              } else {
                d3v3.select(this).style("opacity", 0.8);
                countSeries.data = count_data;
                genre_chart.draw(800);
                displayingTotal = true;
              }
            }
          } else {
            var hide = false;
            var newFilters = [];
            filterValues.forEach(function (f) {
              if (f === e.aggField.slice(-1)[0]) {
                hide = true;
              } else {
                newFilters.push(f);
              }
            });
            if (hide) {
              d3v3.select(this).style("opacity", 0.2);
            } else {
              newFilters.push(e.aggField.slice(-1)[0]);
              d3v3.select(this).style("opacity", 0.8);
            }
            filterValues = newFilters;
            genreSeries.data = dimple.filterData(genre_data, "Genre", filterValues);
            genre_chart.draw(800);
          }
      });

      var displayingCounts = true;
      var form = document.querySelector("#genreToggleForm");
      form.addEventListener("change", function(event) {
        console.log("Toggling chart display!");
        y_axis.showPercent = displayingCounts;
        if(displayingCounts){
          y_axis.title = "Percent";
          y_axis.tickFormat = y_axis.oldFormat;
          countSeries.data = [];
          legend.shapes.select("rect")
            .filter(function (d, i) { return i === 0;})
            .style("opacity", 0)
            .attr("cursor", "pointer");
          legend.shapes[0][0].firstChild.textContent = "";
          console.log(legend);
        }else{
          y_axis.title = "Counts";
          y_axis.tickFormat = 'd';
          countSeries.data = count_data;
          legend.shapes.select("rect")
            .filter(function (d, i) { return i === 0;})
            .style("opacity", 0.8)
            .attr("cursor", "pointer");
          legend.shapes[0][0].firstChild.textContent = "Total Movies";
          console.log(legend);
        }
        displayingCounts = !displayingCounts;
        genre_chart.draw(2000);
      });

      form.reset();
    });
  }
