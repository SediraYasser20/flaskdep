document.addEventListener('DOMContentLoaded', function() {
    // Function to get query parameters from URL
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get pl_prediction and depth from URL
    var pl_prediction = parseFloat(getQueryParam('pl_prediction'));
    var depth = parseFloat(getQueryParam('depth'));

    // Function to calculate Q0, p0, pl, ple, and DI
    function calculateResults(formData) {
        var B = parseFloat(formData.get('B'));
        var D = parseFloat(formData.get('D'));
        var Kp = parseFloat(formData.get('Kp'));
        var q0 = D * pl_prediction;
        var p0 = q0 / 2;
        var pl = p0 - pl_prediction;
        var ple = pl * (D + (2/3) * B);
        
        // Calculation of DI
        var DI = 0;
        var increment = 0.01; // Depth increment
        for (var d = 0; d <= D; d += increment) {
            DI += (pl * (D + (2/3) * B) * d) * increment;
        }

        // Calculation of ql and qadm
        var ql = q0 + Kp * ple;
        var qadm = ql / 3;

        return { q0: q0, p0: p0, pl: pl, ple: ple, DI: DI, ql: ql, qadm: qadm };
    }

    // Function to display results and response based on DI/B value
    function displayResults(results) {
        var DI_B = results.DI / parseFloat(document.getElementById('B').value);
        var response = '';

        if (DI_B < 1.5) {
            response = "Fondations superficielles : les méthodes de calcul développées ci-dessous s'appliquent pleinement.";
        } else if (DI_B > 5) {
            response = "Il s'agit de fondations profondes dont la base est située au-delà de la profondeur critique ; elles doivent être traitées par des méthodes spécifiques à ce type de fondation.";
        } else {
            response = "Il s'agit de fondations semi-profondes ou sous-critiques. Les méthodes de calcul des fondations superficielles ou profondes s'appliquent, avec des adaptations.";
        }

        document.getElementById('results').innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">Q0: ${results.q0.toFixed(2)}</div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">P0: ${results.p0.toFixed(2)}</div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">PL: ${results.pl.toFixed(2)}</div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">PLe: ${results.ple.toFixed(2)}</div>
                </div>
                <div class="col-md-12">
                    <div class="alert alert-success" role="alert">DI: ${results.DI.toFixed(2)}</div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">QL: ${results.ql.toFixed(2)}</div>
                </div>
                <div class="col-md-6">
                    <div class="alert alert-success" role="alert">QADM: ${results.qadm.toFixed(2)}</div>
                </div>
                <div class="col-md-12">
                    <div class="alert alert-info" role="alert">${response}</div>
                </div>
            </div>
        `;
    }

    // Event listener for form submission
    document.getElementById('calculationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        var formData = new FormData(this);

        // Calculate results
        var results = calculateResults(formData);

        // Display results and response
        displayResults(results);
    });
});
