

function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`, function(error, metaData) {
      if (error) return console.warn(error);
      getMetadata(metaData);
  })
  
  function getMetadata(data) {
      // Use d3 to select the panel with id of `#sample-metadata`
      var panel = document.getElementById("#sample-metadata");
      
    // Use `.html("") to clear any existing metadata
    panel.innerHTML = '';
    
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    // create new metadata tags
    for(var key in data) {
        h6tag = document.createElement("h6");
        h6Text = document.createTextNode(`${key}: ${data[key]}`);
        h6tag.append(h6Text);
        panel.appendChild(h6tag);
    }
}


function buildCharts(sampleData) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart

    var url = `http://127.0.0.1:5000/samples/940`;

    d3.json(url).then(function(sampleData) {
  
      // Grab values from the response json object to build the plots
      console.log(sampleData[0]['sample_values'].slice(0, 10))
  
      var pieData = [{
        values: sampleData[0]['sample_values'].slice(0, 10),
        labels: sampleData[0]['otu_ids'].slice(0, 10),
        hovertext: labels.slice(0, 10),
        hoverinfo: 'hovertext',
        type: 'pie'
    }];
    var pieLayout = {
        margin: { t: 0, l: 0 }
    };
    var PIE = document.getElementById('pie');
    Plotly.plot(PIE, pieData, pieLayout);


    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}


function getData(sample, callback) {
  // Use a request to grab the json data needed for all charts
  Plotly.d3.json(`/samples/${sample}`, function(error, sampleData) {
      if (error) return console.warn(error);
      Plotly.d3.json('/otu', function(error, otuData) {
          if (error) return console.warn(error);
          callback(sampleData, otuData);
      });
  });
  Plotly.d3.json(`/metadata/${sample}`, function(error, metaData) {
      if (error) return console.warn(error);
      updateMetaData(metaData);
  })
  // BONUS - Build the Gauge Chart
  buildGauge(sample);
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
