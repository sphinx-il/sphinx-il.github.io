window.HELP_IMPROVE_VIDEOJS = false;

// Lazy loading function for videos
function lazyLoadVideos() {
  const videos = document.querySelectorAll('video[data-src]');
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.src = video.dataset.src;
        video.load();
        observer.unobserve(video);
      }
    });
  }, options);

  videos.forEach(video => {
    observer.observe(video);
  });
}

// Function to initialize carousels
function initCarousels() {
  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  var carousels = bulmaCarousel.attach('.carousel', options);

  carousels.forEach(carousel => {
    carousel.on('before:show', state => {
      console.log(state);
    });
  });
}

const labelToColor = {
  'DP': '#dcebf5',
  'ACT': '#b8cacc',
  'MT-π (H+R)': '#f5a802'
};

function handleBarClick(event, chartElements) {
  if (chartElements.length === 0) return;

  const clickedElement = chartElements[0];
  const datasetIndex = clickedElement.datasetIndex;
  const index = clickedElement.index;

  // Get the clicked dataset
  const clickedDataset = event.chart.data.datasets[datasetIndex];
  const label = clickedDataset.label;
  const barColor = labelToColor[label];

  // List of video sources
  const videoSources = [
    // DP
    "media/table1/dp_fold.mp4",
    "media/table1/dp_fork.mp4",
    "media/table1/dp_serve.mp4",
    "media/table1/dp_socks.mp4",
    // ACT
    "media/table1/act_fold.mp4",
    "media/table1/act_fork.mp4",
    "media/table1/act_serve.mp4",
    "media/table1/act_socks.mp4",
    // MT-π (H+R)
    "media/table1/mt_pi_fold.mp4",
    "media/table1/mt_pi_fork.mp4",
    "media/table1/mt_pi_serve.mp4",
    "media/table1/mt_pi_socks.mp4",
  ];

  // Calculate the video index
  const videoIndex = datasetIndex * 4 + index;
  const videoSrc = videoSources[videoIndex];

  // Select the existing video container
  const videoContainer = document.getElementById('video-container');

  // Clear previous content
  videoContainer.innerHTML = '';

  // Create video element
  const videoElement = document.createElement('video');
  videoElement.src = videoSrc;
  videoElement.controls = true;
  videoElement.autoplay = true;
  videoElement.className = 'centered-video';  // Add a class for styling
  videoElement.style.borderColor = barColor;  // Set border color dynamically

  // Create caption element
  const captionElement = document.createElement('div');
  captionElement.className = 'video-caption';

  // Convert percentage to fraction out of 20
  const fractionValue = Math.floor(clickedDataset.data[index] / 5);
  captionElement.innerText = `${label} - ${event.chart.data.labels[index]}: ${fractionValue}/20`;

  // Append video and caption to container
  videoContainer.appendChild(videoElement);
  videoContainer.appendChild(captionElement);

  // Automatically scroll to the video
  videoContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
}


// Bar chart generation function (partially modified)
function generateBarChart() {
  const ctx = document.getElementById('taskBarChart').getContext('2d');

  const data = {
      labels: ['Fold Cloth', 'Fork on Plate', 'Serve Egg', 'Put Away Socks'],
      datasets: [
          {
              label: 'DP',
              data: [7/20 * 100, 3/20 * 100, 7/20 * 100, 10/20 * 100], 
              backgroundColor: '#bfbfbf',
              borderWidth: 1
          },
          {
              label: 'ACT',
              data: [14/20 * 100, 5/20 * 100, 3/20 * 100, 11/20 * 100],
              backgroundColor: '#b8cacc',
              borderWidth: 1
          },
          {
              label: 'MT-π (H+R)',
              data: [18/20 * 100, 18/20 * 100, 17/20 * 100, 16/20 * 100],
              backgroundColor: '#f5a802', 
              borderWidth: 1
          }
      ]
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    stepSize: 20,
                    color: 'black',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Palatino, serif'
                    }
                },
                title: {
                    display: true,
                    text: 'Success Rate (%)',
                    color: 'black',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family: 'Palatino, serif'
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: true
                },
                borderWidth: 2
            },
            x: {
                ticks: {
                    color: 'black',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Palatino, serif'
                    }
                },
                title: {
                    display: true,
                    text: 'Tasks',
                    color: 'black',
                    font: {
                        size: 20,
                        weight: 'bold',
                        family: 'Palatino, serif'
                    }
                },
                grid: {
                    display: false
                },
                border: {
                    display: true
                },
            },
        },
        onClick: handleBarClick,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Palatino, serif'
                    },
                    color: 'black'
                }
            },
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  return `Task: ${tooltipItems[0].label}`;
                },
                label: (context) => {
                  return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`;
                }
              }
            }
        },
        elements: {
            bar: {
                borderRadius: 4
            }
        }
    }
  };

  new Chart(ctx, config);
}

// Main initialization function
function init() {
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  lazyLoadVideos();
  initCarousels();

  // Adjust video playback speeds
  const videos = document.querySelectorAll('#results-carousel video');
  videos.forEach(video => {
    video.playbackRate = 0.5;
  });

  bulmaSlider.attach();

  // Generate the bar chart after the page has loaded
  if (document.getElementById('taskBarChart')) {
    generateBarChart(); // Ensure this is called after the canvas is in the DOM
  }

  // Display initial message in the video container
  const videoContainer = document.getElementById('video-container');
  const initialMessage = document.createElement('div');
  initialMessage.className = 'initial-message';
  initialMessage.innerHTML = '<b>Click on any bar to see the recorded rollouts!</b>';
  videoContainer.appendChild(initialMessage);
}

// Use DOMContentLoaded instead of $(document).ready for faster execution
document.addEventListener('DOMContentLoaded', init);

// Preload interpolation images in the background
function preloadInterpolationImages() {
  const INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
  const NUM_INTERP_FRAMES = 240;
  const interp_images = [];

  for (let i = 0; i < NUM_INTERP_FRAMES; i++) {
    const path = `${INTERP_BASE}/${String(i).padStart(6, '0')}.jpg`;
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }

  return interp_images;
}

// Load interpolation images after main content has loaded
window.addEventListener('load', () => {
  const interp_images = preloadInterpolationImages();
  const slider = document.getElementById('interpolation-slider');
  
  if (slider) {
    slider.max = NUM_INTERP_FRAMES - 1;
    slider.addEventListener('input', function() {
      setInterpolationImage(this.value, interp_images);
    });
  }
  
  setInterpolationImage(0, interp_images);
});

function setInterpolationImage(i, images) {
  const image = images[i];
  image.ondragstart = () => false;
  image.oncontextmenu = () => false;
  const wrapper = document.getElementById('interpolation-image-wrapper');
  if (wrapper) {
    wrapper.innerHTML = '';
    wrapper.appendChild(image);
  }
}