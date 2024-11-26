// Set initial display of email format options
document.addEventListener("DOMContentLoaded", function () {
    //hide email format options initially
    let emailFormatRow = document.querySelector(".email-format-row");
    emailFormatRow.style.display = "none";

    //set up event listeners for dynamic behavior
    setupEventListeners();
});

// Form submission handling
document.getElementById("guestbook-form").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission

    clearErrors(); // Clear any prior validation errors
    let isValid = true;

    // Validate first name
    let fname = document.getElementById("fname").value;
    if (fname.trim() === "") {
        document.getElementById("err-fname").style.display = "inline";
        isValid = false;
    }

    // Validate last name
    let lname = document.getElementById("lname").value;
    if (lname.trim() === "") {
        document.getElementById("err-lname").style.display = "inline";
        isValid = false;
    }

    //validate email if mailing list checked
    let email = document.getElementById("email").value;
    let mlist = document.getElementById("mlist").checked;
    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (mlist && (email.trim() === "" || !emailPattern.test(email))) {
        document.getElementById("err-email").style.display = "inline";
        isValid = false;
    }

    // Validate LinkedIn
    let linkedin = document.getElementById("linkedin").value;
    let linkedinPattern = /^https:\/\/linkedin\.com\/in\//;
    if (linkedin !== "" && !linkedinPattern.test(linkedin)) {
        document.getElementById("err-linkedin").style.display = "inline";
        isValid = false;
    }

    // Validate how we met
    let mmethod = document.getElementById("mmethod").value;
    let omeet = document.getElementById("omeet").value;
    if (mmethod === "") {
        document.getElementById("err-mmethod").style.display = "inline";
        isValid = false;
    } else if (mmethod === "other" && omeet.trim() === "") {
        document.getElementById("err-omeet").style.display = "inline";
        isValid = false;
    }

    // Only proceed if form is valid
    if (isValid) {
        this.submit(); // Submit form programmatically
    }
};

// Clear all validation error messages
function clearErrors() {
    let errors = document.getElementsByClassName("err");
    for (let i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

//set up event listeners for dynamic form behavior
function setupEventListeners() {
    // Show/hide other field based on how we met selection
    document.getElementById("mmethod").addEventListener("change", function () {
        let otherMeetContainer = document.getElementById("other-meet-container");
        if (this.value === "other") {
            otherMeetContainer.style.display = "inline";
        } else {
            otherMeetContainer.style.display = "none";
        }
    });

    // Show/hide email format options based on mailing list checked condition
    document.getElementById("mlist").addEventListener("change", function () {
        let emailFormatRow = document.querySelector(".email-format-row");
        if (this.checked) {
            emailFormatRow.style.display = "flex"; // Show options if checked
        } else {
            emailFormatRow.style.display = "none"; // Hide if unchecked
        }
    });
}
