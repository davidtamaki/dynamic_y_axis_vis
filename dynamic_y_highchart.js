looker.plugins.visualizations.add({
  options: {
    chart_type: {
      section: "Data",
      order: 1,
      type: "string",
      label: "Chart Type",
      values: [
        { "Area": "area" },
        { "Bar": "bar" },
        { "Column": "column" },
        { "Line": "line" } // can add more types here
      ],
      display: "select",
      default: "line"
    },
    color_range: {
      section: "Data",
      order: 2,
      type: "array",
      label: "Color Range",
      display: "colors",
      default: ["#9E0041", "#C32F4B", "#E1514B", "#F47245", "#FB9F59", "#FEC574", "#FAE38C", "#EAF195", "#C7E89E", "#9CD6A4", "#6CC4A4", "#4D9DB4", "#4776B4", "#5E4EA1"]
    },
    plot_null: {
      section: "Data",
      order: 3,
      type: "string",
      label: "Plot Null Values",
      display: "radio",
      values: [
        { "Yes": true},
        { "No": false}
      ],
      default: true
    },
    range_scale: {
      section: "Data",
      order: 4,
      type: "number",
      label: "Y-Axis Range Scale",
      display: "number",
      default: .02
    },
    x_axis_label: {
      section: "Format",
      order: 1,
      type: "string",
      label: "X Axis Label"
    },
    y_axis_label: {
      section: "Format",
      order: 2,
      type: "string",
      label: "Y Axis Label"
    },
    show_legend: {
      section: "Format",
      order: 3,
      type: "string",
      label: "Show Legend",
      display: "radio",
      values: [
        { "Yes": true},
        { "No": false}
      ],
      default: true
    },
    point_style: {
      section: "Format",
      order: 4,
      type: "string",
      label: "Point Style",
      display: "radio",
      values: [
        { "None": "none"},
        { "Filled": "filled"},
        { "Outline": "outline"}
      ],
      default: "none"
    }
  },

  // Set up the initial state of the visualization / CSS if required
  create: function(element, config) {
  },


  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {
    this.clearErrors(); // clear any errors from previous updates

    // ensure data fit
    if (!handleErrors(this, queryResponse, { 
      min_pivots: 0, max_pivots: 0, 
      min_dimensions: 1, max_dimensions: 1, 
      min_measures: 1, max_measures: 99})) {
      return;
    }
    
    var dimension = queryResponse.fields.dimension_like[0].name, measure_count = queryResponse.fields.measure_like.length,
      series = [], x = [], all_series = [];

    for (let i = 0; i < measure_count; i++) {
      series[i] = {}
      series[i]['name'] = queryResponse.fields.measure_like[i].label;
      series[i]['field_name'] = queryResponse.fields.measure_like[i].name;
      series[i]['data'] = [];
      series[i]['marker'] = { "symbol": "circle" };
    }
    
    for (let i = 0; i < data.length; i++) {
      x.push(data[i][dimension].value); 
      for (let j = 0; j < measure_count; j++) {
        let datapoint = data[i][series[j]['field_name']].value; 
        if (config.plot_null && !datapoint) { // plot nulls as zero
          series[j]['data'].push(0);
        } else {
          series[j]['data'].push(datapoint);
          all_series.push(datapoint); // skip nulls
        }
      }
    } 

    var minX = Math.min( ...all_series)*(1-config.range_scale), 
      maxX = Math.max( ...all_series)*(1+config.range_scale);

    var marker = {}
    if (config.point_style == "outline") {
      marker.fillColor = '#FFFFFF';
      marker.lineWidth = 2;
      marker.lineColor = null;      
    } else if (config.point_style == "filled") {
      marker.lineWidth = 2;
      marker.lineColor = null;
    } else {
      marker.enabled = false;
    }

    var chart = Highcharts.chart('vis', {
        colors: config.color_range,
        chart: { 
          type: config.chart_type,
          spacing: [0,0,0,0]
        },
        title: { text: null },
        legend: { enabled: config.show_legend },
        xAxis: { 
          labels: {
            formatter: function(){
              return x[this.value];
            }
          },
          title: { text: config.x_axis_label }
          // dateTimeLabelFormats: {} // TODO - format dates and sort
        },
        yAxis: {
          endOnTick: false,
          maxPadding: 0.2,
          ceiling: maxX,
          floor: minX,
          title: { text: config.y_axis_label }
        },
        series: series,
        plotOptions: {
          series: { marker: marker }
        },
        credits: { enabled: false }
    });

    // console.log(chart)


    // Helper functions
    function handleErrors(vis, res, options) {
      var check = function (group, noun, count, min, max) {
          if (!vis.addError || !vis.clearErrors) {
              return false;
          }
          if (count < min) {
              vis.addError({
                  title: "Not Enough " + noun + "s",
                  message: "This visualization requires " + (min === max ? 'exactly' : 'at least') + " " + min + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                  group: group
              });
              return false;
          }
          if (count > max) {
              vis.addError({
                  title: "Too Many " + noun + "s",
                  message: "This visualization requires " + (min === max ? 'exactly' : 'no more than') + " " + max + " " + noun.toLowerCase() + (min === 1 ? '' : 's') + ".",
                  group: group
              });
              return false;
          }
          vis.clearErrors(group);
          return true;
      };
      var _a = res.fields, pivots = _a.pivots, dimensions = _a.dimension_like, measures = _a.measure_like;
      return (check('pivot-req', 'Pivot', pivots.length, options.min_pivots, options.max_pivots)
          && check('dim-req', 'Dimension', dimensions.length, options.min_dimensions, options.max_dimensions)
          && check('mes-req', 'Measure', measures.length, options.min_measures, options.max_measures));
    }

    done()
  }
});