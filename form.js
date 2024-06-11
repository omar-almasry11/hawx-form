
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.infestation-level_outer-wrapper').forEach(wrapper => {
        wrapper.classList.add('hide-infestation-sliders');
        wrapper.style.pointerEvents = 'none'; // Ensure pointer events are disabled initially
    });

    // Assuming checkboxes are setup similarly
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', toggleSliderVisibility);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const zipCodeInput = document.getElementById('zip-code');
    const zipCodeButton = document.getElementById('zip-code-button');
    const zipCodeMessage = document.getElementById('zip-code-message');
    const zipCodeIcon = document.getElementById('zip-code-icon');
    const formStep2Wrapper = document.getElementById('form-step-2-wrapper');
    const zipScrollDownLottie = document.getElementById('zip-scroll-down-lottie');
    const serviceTimeField = document.getElementById('service-time');
    const phoneInput = document.getElementById('pest-form-phone');
    const emailInput = document.getElementById('pest-form-email');
    const phoneValidationStatus = document.getElementById('field-validation-status-phone');
    const emailValidationStatus = document.getElementById('field-validation-status-email');
     // Preset ZIP codes range
    const availableZIPs = [];
for (let i = 32700; i <= 34500; i++) {
    availableZIPs.push(i.toString());
}
     const checkboxes = document.querySelectorAll('input[type="checkbox"]');
     
     
function toggleSliderVisibility() {
    // Get the pest name from the id of the checkbox, assume id is lowercase
    const pestName = this.id;
    // Select the corresponding slider wrapper using the pest name
    const sliderWrapper = document.querySelector(`.infestation-level_outer-wrapper.${pestName}`);
    if (sliderWrapper) {
        // Toggle 'hide-infestation-sliders' class based on checkbox state
        if (this.checked) {
            sliderWrapper.classList.remove('hide-infestation-sliders');
            sliderWrapper.style.pointerEvents = 'auto'; // Re-enable pointer events when visible
        } else {
            sliderWrapper.classList.add('hide-infestation-sliders');
            sliderWrapper.style.pointerEvents = 'none'; // Disable pointer events when hidden
        }
    }
}

    // Attach event listeners to each checkbox
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', toggleSliderVisibility);
    });

    function validatePhone() {
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        phoneValidationStatus.style.display = phoneRegex.test(phoneInput.value) ? 'none' : 'block';
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        emailValidationStatus.style.display = emailRegex.test(emailInput.value) ? 'none' : 'block';
    }

    phoneInput.addEventListener('blur', validatePhone);
    emailInput.addEventListener('blur', validateEmail);

    var picker = new Pikaday({
        field: serviceTimeField,
        format: 'MM-DD-YYYY', 
        minDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Two days ahead
        onSelect: function() {
            document.getElementById('time-message').style.display = 'block';
        }
    });

    formStep2Wrapper.style.display = 'none';
    zipScrollDownLottie.style.display = 'none';

    function checkZIPAvailability() {
        const userZIP = parseInt(zipCodeInput.value, 10);
        const isValidZIP = /^[0-9]{5}$/.test(zipCodeInput.value);
        if (!isValidZIP) {
            zipCodeMessage.textContent = "That is not a valid ZIP code. Please enter a valid ZIP code and try again.";
            formStep2Wrapper.style.display = 'none';
            zipScrollDownLottie.style.display = 'none';
            return;
        }

        if (userZIP >= 32700 && userZIP <= 34500) {
            zipCodeMessage.textContent = "Great news, we operate in your area!";
            formStep2Wrapper.style.display = 'block';
            zipScrollDownLottie.style.display = 'block';
        } else {
            zipCodeMessage.textContent = "Sorry, we currently don't cover this area.";
            formStep2Wrapper.style.display = 'none';
            zipScrollDownLottie.style.display = 'none';
        }
    }

    function autoCompleteZIP() {
        const userInput = zipCodeInput.value;
        const closestZIP = availableZIPs.find(zip => zip.startsWith(userInput));
        if (closestZIP) {
            zipCodeInput.value = closestZIP;
            zipCodeMessage.textContent = "ZIP code completed to: " + closestZIP;
            checkZIPAvailability(); // Optionally check ZIP availability after auto-completing
        } else {
            zipCodeMessage.textContent = "No matching ZIP code found.";
        }
    }

    zipCodeIcon.addEventListener('click', function(event) {
        event.preventDefault();
        autoCompleteZIP();
    });

    zipCodeButton.addEventListener('click', function(event) {
        event.preventDefault();
        checkZIPAvailability();
    });

    zipCodeInput.addEventListener('input', function() {
        formStep2Wrapper.style.display = 'none';
        zipCodeMessage.textContent = "";
        zipScrollDownLottie.style.display = 'none';
    });
});

function initAutocomplete() {
    var addressInput = document.getElementById('street-address');
    var autocomplete = new google.maps.places.Autocomplete(addressInput);
    autocomplete.setFields(['address_components', 'geometry', 'name']);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
        } else {
            console.log(place);
        }
    });
}
