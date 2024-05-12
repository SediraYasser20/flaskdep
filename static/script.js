// JavaScript for handling form submission
document.getElementById('predictionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get form data
    var formData = new FormData(this);
    
    // Display loading animation
    document.getElementById('predictionResult').innerHTML = '<div class="spinner-border text-success" role="status"><span class="sr-only">Loading...</span></div>';

    // Submit form data via AJAX
    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Display prediction result with smooth animation above the form
        var resultElement = document.getElementById('predictionResult');
        resultElement.innerHTML = '<div class="alert alert-success" role="alert">The predicted PL is: ' + data.pl_prediction +' bar</div>';
        // Show the result container
        resultElement.style.display = 'block';
        
        // JavaScript for handling phase 2 button click
        document.getElementById('phase2Button').addEventListener('click', function() {
            // Redirect to phase2.html with predicted PL value
            window.location.href = '/phase2?depth=' + formData.get('depth') + '&c=' + formData.get('c') + '&phi=' + formData.get('phi') + '&gamma=' + formData.get('gamma') + '&pl_prediction=' + data.pl_prediction;
        });
    })
    .catch(error => {
        // Display error message
        console.error('Error:', error);
        document.getElementById('predictionResult').innerHTML = '<div class="alert alert-danger" role="alert">An error occurred. Please try again later.</div>';
    });
});
