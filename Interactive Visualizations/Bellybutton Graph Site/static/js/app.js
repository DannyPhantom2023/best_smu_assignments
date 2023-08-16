d3.json("data/samples.json").then(function (data) {
    console.log(data);
  
    makeDropdown(data);
    makeMetadata(data, data.names[0]);
    makeBarChart(data, data.names[0]);
    makeBubbleChart(data, data.names[0]);
    makeGuageChart(data, data.names[0]);
  });
  
  function optionChanged(val) {
    d3.json("data/samples.json").then(function (data) {
      console.log(data);
  
      makeMetadata(data, val);
      makeBarChart(data, val);
      makeBubbleChart(data, val);
      makeGuageChart(data, val);
    });
  }
  
  function makeDropdown(data) {
    for (let i = 0; i < data.names.length; i++){
      let name = data.names[i];
      d3.select("#selDataset").append("option").text(name);
    }
  }
  
  function makeMetadata(data, val) {
    console.log(val);
  
    // nuke parent
    d3.select("#sample-metadata").html("");
  
    let meta = data.metadata.filter(x => x.id == val)[0];
    let keys = Object.keys(meta);
    for (let i = 0; i < keys.length; i++){
      let key = keys[i];
      d3.select("#sample-metadata").append("p").text(`${key}: ${meta[key]}`);
    }
  }
  
  function makeBarChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];
  
    // Slice the first 10 objects for plotting
    let sample_values = sample.sample_values.slice(0, 10);
    let otu_labels = sample.otu_labels.slice(0, 10);
    let otu_ids = sample.otu_ids.slice(0, 10);
  
    // Reverse the array to accommodate Plotly's defaults
    sample_values.reverse();
    otu_labels.reverse();
    otu_ids.reverse();
  
    // Trace for the Greek Data
    let trace1 = {
      x: sample_values,
      y: otu_ids.map(x => `OTU: ${x}`),
      hovertext: otu_labels,
      type: 'bar',
      orientation: "h",
      marker: {color: '#87CEEB'}
    };
  
    // Data array
    let plotly_data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      "title": `Bacteria for ID: ${val}`,
      "xaxis": {'title': "Number of Bacteria Found"}
    }
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", plotly_data, layout);
  }
  
  function makeBubbleChart(data, val) {
    let sample = data.samples.filter(x => x.id == val)[0];
  

    let sample_values = sample.sample_values;
    let otu_labels = sample.otu_labels;
    let otu_ids = sample.otu_ids;
  
   
    // Trace for the Bubble Plot
    let trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          color: otu_ids,
          size: sample_values,
          colorscale: 'YlGnBu'
        }
    };
  
    // Data array
    let plotly_data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      "title": `Number of Bacteria For ID: ${val} `,
      "xaxis": {'title': "OTU ID"},
      "yaxis": {'title': "Number of Bacteria Found"}
    }
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", plotly_data, layout);
  }

  function makeGuageChart(data, val) {
    let meta = data.metadata.filter(x => x.id == val)[0];
    
    let wfreq = meta.wfreq;
   
    // Trace for the Bubble Plot
    let trace1 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: wfreq,
      title: { text: "" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 5 },
      gauge: {
        axis: { range: [0, 10] },
        bar: { color: "#87CEEB" },
        steps: [
          { range: [0, 5], color: "lightgray" },
          { range: [5, 7], color: "gray" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 9.75
        }
      }
    };
  
    // Data array
    let plotly_data = [trace1];
  
    // Apply a title to the layout
    let layout = {
      "title": `Belly Button Washing Frequency`,
      
    }
  
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("gauge", plotly_data, layout);
  }