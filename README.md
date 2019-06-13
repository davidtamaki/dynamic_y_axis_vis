# Dynamic Y-Axis Custom Visualisation for Looker

Example of a custom visualisation that can unpin the Y-axis from zero and be dynamically scaled. This chart is built using Highcharts library, check out there [API](https://api.highcharts.com/highcharts/) to add any custom configuration. 

## Example
![Screenshot](https://github.com/davidtamaki/dynamic_y_axis_vis/blob/master/screen-shots/dynamic_y_example.gif)

## Implementation Instructions
1. Fork this repository

2. Turn on [GitHub Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)

3. Follow directions on Looker's documentation to add a [new custom visualisation manifest](https://docs.looker.com/admin-options/platform/visualizations#adding_a_new_custom_visualization_manifest):
    - In the 'Main' field, the URI of the visualization will be `https://DOMAIN_NAME/dynamic_y_axis_vis/dynamic_y_highchart.js`. For example: https://davidtamaki.github.io/dynamic_y_axis_vis/dynamic_y_highchart.js
    - The only required dependencies is [Highcharts](https://code.highcharts.com/highcharts.js)
      
