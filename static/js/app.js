// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field


    // Filter the metadata for the object with the desired sample number


    // Use d3 to select the panel with id of `#sample-metadata`


    // Use `.html("") to clear any existing metadata


    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field


    // Filter the samples for the object with the desired sample number


    // Get the otu_ids, otu_labels, and sample_values


    // Build a Bubble Chart


    // Render the Bubble Chart


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field


    // Use d3 to select the dropdown with id of `#selDataset`


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.


    // Get the first sample from the list


    // Build charts and metadata panel with the first sample

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Load the data from the URL
d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json').then(data => {
    console.log(data); // Check the structure of your data
    const names = data.names;

    // Populate the dropdown menu
    const dropdown = d3.select("#selDataset");
    names.forEach(name => {
        dropdown.append("option").text(name).property("value", name);
    });

    // Initialize with the first sample
    const firstSample = names[0];
    updateCharts(firstSample);
    updateMetadata(firstSample);
});

// Function to update the bar chart and bubble chart
function updateCharts(sample) {
    d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json').then(data => {
        const sampleData = data.samples.find(s => s.id === sample);
        
        // Prepare data for the bar chart
        const top10OTUs = sampleData.sample_values
            .map((value, index) => ({
                value: value,
                id: sampleData.otu_ids[index],
                label: sampleData.otu_labels[index]
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);

        const barTrace = {
            x: top10OTUs.map(d => d.value),
            y: top10OTUs.map(d => `OTU ${d.id}`),
            text: top10OTUs.map(d => d.label),
            type: 'bar',
            orientation: 'h'
        };

        const barLayout = {
            title: "Top 10 OTUs",
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot('bar', [barTrace], barLayout);

        // Prepare data for the bubble chart
        const bubbleTrace = {
            x: sampleData.otu_ids,
            y: sampleData.sample_values,
            text: sampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: sampleData.sample_values,
                color: sampleData.otu_ids,
                colorscale: 'Earth'
            }
        };

        const bubbleLayout = {
            title: 'Bubble Chart of Sample Values',
            xaxis: { title: 'OTU ID' },
            yaxis: { title: 'Sample Values' },
            hovermode: 'closest'
        };

        Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);
    });
}

// Function to update metadata
function updateMetadata(sample) {
    d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json').then(data => {
        const metadata = data.metadata.find(m => m.id == sample);
        const panel = d3.select("#sample-metadata");
        panel.html(""); // Clear existing metadata

        Object.entries(metadata).forEach(([key, value]) => {
            panel.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Event listener for dropdown changes
d3.select("#selDataset").on("change", function() {
    const newSample = d3.select(this).property("value");
    updateCharts(newSample);
    updateMetadata(newSample);
});


// Initialize the dashboard
init();
