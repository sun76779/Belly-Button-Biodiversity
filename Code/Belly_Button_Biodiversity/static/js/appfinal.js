function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel

    var panelurl = "/metadata/940";

    d3.json(panelurl).then(function(metaData) {
  
      console.log(metaData);
      var complexData = [metaData]
  
      // Grab values from the data json object to build the plots
      d3.select("#sample-metadata").selectAll("div")
        .data(complexData)
        .enter()
        .append("h6")
        .html(function(d) {
          return `<h6>Sample: ${d.sample}</h6>
          <h6>Age: ${d.AGE}</h6>
          <h6>BBType: ${d.BBTYPE}</h6>
          <h6>Ethicity: ${d.ETHNICITY}</h6>
          <h6>Gender: ${d.GENDER}</h6>
          <h6>Location: ${d.LOCATION}</h6>
          <h6>WFREQ: ${d.WFREQ}</h6>         
          
          `;
        });

    
  
    // Use `d3.json` to fetch the metadata for a sample
      // Use d3 to select the panel with id of `#sample-metadata`
  
      // Use `.html("") to clear any existing metadata
  
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
  
      // BONUS: Build the Gauge Chart
      // buildGauge(data.WFREQ);
  });
}

function buildPie() {

  var pieurl = "/samples/940";

  d3.json(pieurl).then(function(data) {

    console.log(data);

    // Grab values from the data json object to build the plots
    var value = data.sample_values.slice(0, 10);
    var otu_ids = data.otu_ids.slice(0, 10);
    var otu_labels = data.otu_labels.slice(0, 10);

    var data = [{
      values: value,
      labels: otu_ids,
      hovertext: otu_labels.slice(0, 10),
      hoverinfo: 'hovertext',
      type: 'pie'
    }];

    var layout = {
      title: `Sample 940 MetaData Chart`,
    };

    Plotly.newPlot("pie", data, layout);

  });

}

buildPie();


function buildBubble() {

  var bubbleurl = "/samples/940";

  d3.json(bubbleurl).then(function(data) {

    console.log(data);

    // Grab values from the data json object to build the plots
    var value_all = data.sample_values;
    var otu_ids_all = data.otu_ids;
    var otu_labels_all = data.otu_labels;
 
    var bubbledata = [{
      y: value_all,
      x: otu_ids_all,
      text: otu_labels_all,
      mode: 'markers',
      marker: {
        size: value_all,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ],
      }
    }];

    var bubblelayout = {
      margin: { t: 0 },
      hovermode: 'closest',
    };

    Plotly.newPlot("bubble", bubbledata, bubblelayout);

  });

}

buildBubble();






function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
