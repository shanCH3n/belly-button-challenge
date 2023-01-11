// Build a dashboard to explore the Belly Button Biodiversity dataset (http://robdunnlab.com/projects/belly-button-biodiversity/).

// Define a url endpoint with a constant.
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Use a Promise function to fetch JSON data from APIs on the web with d3.json.
const dataPromise = d3.json(url);


// Review sample.json to check keys of interes (e.g. otu_labels)
// Create charts function.

function charts(selectedID) {
    // Use dataPromise to load samples.json file from url endpoint.
    dataPromise.then((data) => {
        var samples = data.samples;
        var filterSpNo = samples.filter(sampleobject =>
            sampleobject.id == selectedID);
        var result = filterSpNo[0];

        console.log(result);

        // Create variables to hold results from filtering.
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        // Build a horizontal bar chart//
        var trace1 = {
            x: values.slice(0, 10).reverse(), // Pick out top 10 most prevalent OTUs to display
            y: ids.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
            text: labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
        };

        var bar_data = [trace1];

        var bar_layout = {
            title: "Top 10 Most Common MicroBacteria found in Subject's Navel",
            margin: {t: 60, l: 160},
        };


        Plotly.newPlot("bar", bar_data, bar_layout);

        
        // Create a bubble chart//
        var trace2 = {
            x: ids,
            y: values,
            text: labels,
            mode: "markers",
            marker: {
                color: ids,
                colorscale: "Earth",
                size: values,
            },
        };

        var bubble_data = [trace2];

        var bubble_layout = {
            margin: {t: 0},
            xaxis: { title: "OTU ID"},
            hovermode: "closest",
            width: window.width,
        };

        Plotly.newPlot("bubble", bubble_data, bubble_layout);
    });
};

// TBC Bonus gauge chart

// Display sample metadata, i.e., an individual's demographic information.

function MetaDemo(sample) {
    dataPromise.then((data) => {
        var Metadata = data.metadata;
        var resultsarray = Metadata.filter(sampleobject =>
            sampleobject.id == sample);
        var result = resultsarray[0];
        var demo_Panel = d3.select(`#sample-metadata`); // Select panel with div id of `#sample-metadata'
        demo_Panel.html("");

        Object.entries(result).forEach(([key, value]) => {
            demo_Panel.append("h5").text(`${key}: ${value}`);
        });

    });
};


// Initialize default plot.

function init() {
    
    dataPromise.then(function (data) {
        console.log("samples.json: ", data);

        let DropDown = d3.select(`#selDataset`);

        data.names.forEach((name) => {
            DropDown.append(`option`).text(name).property(`value`, name);
        });

        const firstSample = data.names[0];
        charts(firstSample);
        MetaDemo(firstSample);
    });
};

console.log("Data Promise: ", dataPromise);



// Retrieve data each time a new sample is selected to update demographics and charts.

function optionChanged(newSample) {
    charts(newSample);
    MetaDemo(newSample);
}

init();