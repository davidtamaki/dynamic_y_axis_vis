# Dynamic Y-Axis Custom Visualisation for Looker

Example of a custom visualisation that can unpin the Y-axis from zero and be dynamically scaled.

## Implementation Instructions
1. Fork this repository

2. Turn on [GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)

3. Follow directions on Looker's documentation to add a [new custom visualisation manifest](https://docs.looker.com/admin-options/platform/visualizations#adding_a_new_custom_visualization_manifest):
    - In the 'Main' field, the URI of the visualization will be `https://DOMAIN_NAME/dynamic_y_axis_vis/dynamic_y_highchart.js`. For example: https://davidtamaki.github.io/dynamic_y_axis_vis/dynamic_y_highchart.js
    - The required dependencies are:
      - [Highcharts](https://code.highcharts.com/highcharts.js)
      
