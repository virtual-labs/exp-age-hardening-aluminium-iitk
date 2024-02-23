const charts = {};
const schema = ["hardness", "time"];
const readingData1 = [
  [0, 79],
  [0.5, 128],
  [1, 122],
  [1.5, 126],
  [2.5, 131],
  [5, 158],
  [16, 169],
  [24, 177],
  [42, 168],
  [96, 171],
  [144, 172],
  [476, 169],
];

// x axis
const time = [0, 0.5, 1, 1.5, 2.5, 5, 16, 24, 42, 96, 144, 476];
// y axis
const hardness = [79, 128, 122, 126, 131, 158, 169, 177, 168, 171, 172, 169];

var currPos = 0;

var currentStepProgress = 1;
var sampleLength = 0;
var sampleDiameter = 0;
var sampleFinalLength = 0;
var sampleFinalDiameter = 0;

document.getElementById("step1").classList.remove("disabled");
window.refresh();

window.addEventListener("load", function () {
  setTimeout(() => {
    // if (vc) vc.init();
    // if (sample1) sample1.init();
    //if (furnace) furnace.init();
  }, 1500);
});

function handle() {
  eval(`handleStep${currentStepProgress}()`);
  window.refresh();
}

function handleStep1() {
  let pane = document.getElementById("step1");
  //let len = document.getElementById("step1Length").value;
  /*if (!len) {
    alert("Please enter the length in step 1.");
    return;
  }

  if (len < 42 || len > 45) {
    alert("Wrong readings! Please take your reading correctly via vernier caliper. (Range must be in b/w 42 to 45 mm)");
    return;
  }

  sampleLength = len;*/

  /*pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;*/

  //function handleStep2() {
  //let pane = document.getElementById("step2");
  /*let len = document.getElementById("step2Dia").value;
  if (!len) {
    alert("Please enter the diameter in step 2.");
    return;
  }

  if (len < 8 || len > 10) {
    alert("Wrong readings! Please take your reading correctly via vernier caliper. (Range must be in b/w 8 to 10 mm)");
    return;
  }

  sampleDiameter = len;*/

  //if (vc) vc.destory();
  if (furnace) furnace.init();
  if (sample1) sample1.init();

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step2");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 2;
}

function handleStep2() {
  let pane = document.getElementById("step2");
  // if (furnace) furnace.init();
  // if (sample1) sample1.init();
  if (!furnace || !furnace.isActive()) {
    alert("Please take Furnace from menu first!");
    return;
  }

  if (!furnace.isSampleLoaded()) {
    alert("Please load the sample on the Furnace machine first!");
    return;
  }
  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step3");
  next.classList.add("active");
  next.classList.remove("disabled");
  //if (furnace) furnace.destory();
  if (sample1) sample1.destory();
  currentStepProgress = 3;
  vickers.init();
}

//plot blank graph
plotGraph(
    document.getElementById("outputGraphA").getContext("2d"),
    {
      labels: time,
      datasets: [
        {
          data: [],
          borderColor: "#3e95cd",
          fill: false,
        },
      ],
    },
    "Time in hrs", "Hardness (HV)"
  );

function handleStep3() {
  let pane = document.getElementById("step3");
  //if (utm) utm.destory();
  // if (vickers) vickers.init();
  // if (sample1) sample1.init();
  if (!vickers || !vickers.isActive()) {
    alert("Please take Vickers Tester from menu first!");
    return;
  }

  if (!vickers.isSampleLoaded()) {
    alert("Please load the sample on the Vickers Tester first!");
    return;
  }

  pane.classList.add("done");
  pane.classList.remove("active");

  const images = [
    { time: " Time - 0h", url: "images/result/0h-1.png" },
    { time: "Time - 0.5h", url: "images/result/0.5h-1.png" },
    { time: "Time - 1h", url: "images/result/1h.png" },
    { time: "Time - 1.5h", url: "images/result/1.5h-1.png" },
    { time: "Time - 2.5h", url: "images/result/2.5h.png" },
    { time: "Time - 5h", url: "images/result/5h-1.png" },
    { time: "Time - 16h", url: "images/result/16h.png" },
    { time: "Time - 24h", url: "images/result/24h-1.png" },
    { time: "Time - 42h", url: "images/result/42h-1.png" },
    { time: "Time - 96h", url: "images/result/96h.png" },
    { time: "Time - 144h", url: "images/result/144h.png" },
    { time: "Time - 476h", url: "images/result/476h-1.png" },
    // Add more images as needed
  ];

  // Find the table element where the images will be displayed
  let imageTable = document.getElementById("imageTable");

  // Loop through the images array and create rows in the table
  images.forEach((image) => {
    let row = imageTable.insertRow(); // Create a new row

    // Create cells for name and image
    let timeCell = row.insertCell(0);
    let imageCell = row.insertCell(1);

    // Set the name in the first column
    timeCell.innerHTML = image.time;

    // Create an image element and set its attributes
    let img = document.createElement("img");
    img.src = image.url;
    img.width = 200; // Set image width (adjust as needed)
    img.height = 150; // Set image height (adjust as needed)

    // Append the image to the second column
    imageCell.appendChild(img);
  });

  let next = document.getElementById("step4");
  next.classList.add("active");
  next.classList.remove("disabled");
  if (sample1) sample1.destory();
  if (furnace) furnace.destory();
  currentStepProgress = 4;
}

function handleStep4() {
  let pane = document.getElementById("step4");

  pane.classList.add("done");
  pane.classList.remove("active");

  document.getElementById("btnNext").disabled = true;

  document.getElementById("startTest").addEventListener("click", function testHandler(e) {
    e.currentTarget.disabled = true;
    document.getElementById("btnNext").disabled = true;
    // document.getElementById("arrowNext").classList.add("disabled");
    e.currentTarget.innerHTML = "Running...";

    vickers.setConfig({
      yield_point: 10, // no yield point
      breaking_point: 0.65,
      finish_point: 0.7,
    });

    setTimeout(() => {
      vickers.start(0.015, 1);
    }, 4000);

    let intr = setInterval(() => {
      if (currPos >= readingData1.length) {
        clearInterval(intr);
        document.getElementById("startTest").disabled = false;
        document.getElementById("startTest").innerHTML = "Done";
        // document.getElementById("showGraphBtn").disabled = false;
        furnace.stop();
        document.getElementById("btnNext").disabled = false;
        // document.getElementById("arrowNext").classList.remove("disabled");
        return;
      }

      const tableData1 = readingData1; 
      const tableBody1 = document.getElementById("testData1"); 

      tableBody1.innerHTML += `
        <tr>
          <td>${tableData1[currPos][0]}</td>
          <td>${tableData1[currPos][1]}</td>
        </tr>
      `;

      currPos++;

      let progress1 = (hardness.length / tableData1.length) * currPos;

      const chart1Data = {
        labels: time,
        datasets: [
          {
            data: hardness.slice(0, progress1),
            borderColor: "#3e95cd",
            fill: false,
          },
        ],
      };

      plotGraph(document.getElementById("outputGraphA").getContext("2d"), chart1Data, "Time in hrs", "Hardness (HV)");

      document.querySelector(".menu").scrollTo(0, document.querySelector(".menu").scrollHeight);
    }, 600);
  });

  let next = document.getElementById("step5");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 5;
}

function handleStep5() {
  let pane = document.getElementById("step5");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step6");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 6;
  vickers.destory();
}

function handleStep6() {
  let pane = document.getElementById("step6");

  pane.classList.add("done");
  pane.classList.remove("active");

  let next = document.getElementById("step7");
  next.classList.add("active");
  next.classList.remove("disabled");

  currentStepProgress = 7;

  //if (vc) vc.init();
  if (furnace) furnace.destory();
 
  modal = new Modal({
    title: "Can you answer the questions?",
    body: [
      {
        page: 1,
        title: " The first step in the age-hardening treatment is ?",
        options: [" Solution treatment", "Quenching", "Aging at higher temperature", "Recrystallization"],
        correct: 0,
      },
      {
        page: 2,
        title: "Choose the correct sequence for precipitation treatment of aluminium alloy?",
        options: [
          " Solution Treatment-->Quenching-->Aging",
          "Aging-->Quenching-->Solution Treatment",
          " Solution Treatment-->Aging-->Quenching",
          "Quenching-->Solution Treatment-->Aging",
        ],
        correct: 0,
      },
      {
        page: 3,
        title: "How does hardness profile vary with ageing time?",
        options: [
          "linearly increases with ageing time",
          "first decreasing to lowest then increases",
          "first increasing to peak then decreases",
          "linearly decreases with ageing time",
        ],
        correct: 2,
      },
      {
        page: 4,
        title: "Which of the following is incorrect?",
        options: [
          " Hardness is affected by size of the precipitates",
          "Hardness is not affected by the aging temperature",
          "Hardness is affected by the amount of solute in the solid solution",
          "Hardness is affected by the nature of the interface with the matrix",
        ],
        correct: 1,
      },
      {
        page: 5,
        title: "Which test is typically used to obtain aging curve for aluminum alloys?",
        options: ["Vickers hardness test", "Brinell hardness test", "Tensile test", "Impact test"],
        correct: 0,
      },
    ],
    onClose: () => {
      document.getElementById('btnNext').disabled = true;
      document.getElementById('btnNext').innerHTML = 'Finished';
      let pane = document.getElementById("step7");
      pane.classList.add("done");
      pane.classList.remove("active");
    },
  });
  modal.show();
}

function plotGraph(graphCtx, data, labelX, labelY) {
  let chartObj = charts[graphCtx.canvas.id];
  if (chartObj) {
    chartObj.config.data.labels = data.labels;
    chartObj.config.data.datasets = data.datasets;
    chartObj.update();
  } else {
    charts[graphCtx.canvas.id] = new Chart(graphCtx, {
      type: "line",
      data: data,
      options: {
        responsive: true,
        animation: false,
        scaleOverride: true,
        legend: { display: false },
        scales: {
          xAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: labelX,
              },
              ticks: {
                beginAtZero: true,
                steps: 20,
                stepValue: 10,
                // max: Math.max(...time1),
              },
              // stacked: true,
            },
          ],
          yAxes: [
            {
              display: true,
              scaleLabel: {
                display: true,
                labelString: labelY,
              },
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                // max: Math.max(...elongation1),
              },
            },
          ],
        },
      },
    });
  }
}


function showGraph() {
  graphModal = new Modal({
    title: "Age Hardening in Aluminium Alloy",
    body: [
      {
        page: 1,
        title: "Age Hardening in Aluminium Alloy",
        image: "images/hardness2.jpg",
      },
    ],
  });
  graphModal.show();
}
