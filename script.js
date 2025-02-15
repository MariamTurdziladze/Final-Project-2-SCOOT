document.addEventListener("DOMContentLoaded", function () {
    let currentPage = window.location.pathname.split("/").pop();

    let pageMap = {
        "about.html": ["about-link", "footer-about-link"],
        "careers.html": ["careers-link", "footer-careers-link"],
        "location.html": ["location-link", "footer-location-link"]
    };

    let activeLinkIds = pageMap[currentPage];

    document.querySelectorAll(".nav-link, .footer-link").forEach(link => {
        link.classList.remove("active-link", "active-footer-link");
    });

    if (activeLinkIds) {
        activeLinkIds.forEach(linkId => {
            document.getElementById(linkId).classList.add(linkId.includes("footer") ? "active-footer-link" : "active-link");
        });
    }
});


// ACCORDION
document.body.addEventListener(`click`, (ev) => {
    const isExpandableTitle = !!ev.target.closest(".accordion");  // mxolod titles magivrad mtliani boxia
    const expandable = ev.target.closest(".accordion");

    if (!isExpandableTitle) {
        return
    }
    expandable.classList.toggle("accordion-open")
})


// burger menu
function toggleNav(x) {
    var sidenav = document.getElementById("mySidenav");
    var bg = document.getElementById("bg");
    if (sidenav.style.width === "68%") {
        sidenav.style.width = "0";
        bg.style.width = "0";

    } else {
        sidenav.style.width = "68%";
        bg.style.width = "100%";


    }
    x.classList.toggle("change");
}

document.getElementById('bg').addEventListener('click', function () {
    var sidenav = document.getElementById("mySidenav");
    var bg = document.getElementById("bg");
    var toggleBtn = document.getElementById("toggleBtn");

    sidenav.style.width = "0";
    bg.style.width = "0";

    toggleBtn.classList.remove("change");
});

// apply form

document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("modal");
    const closeBtn = document.getElementById("close-btn");
    const form = document.getElementById("signup-form");
    const applyButtons = document.querySelectorAll(".apply-btn");
    const resumeInput = document.getElementById("resume");

    modal.style.display = "none";

    applyButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.style.display = "flex";
            loadFormData();
        });
    });

    closeBtn.addEventListener('click', function () {
        modal.style.display = "none";
    });

    resumeInput.addEventListener('change', function () {
        const resumeError = document.getElementById('resume-error');
        const file = resumeInput.files[0];
        const allowedExtensions = ["pdf", "doc", "docx"];

        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (!allowedExtensions.includes(fileExtension)) {
                resumeError.textContent = "Only PDF, DOC, or DOCX files are allowed.";
                resumeInput.value = "";
            } else {
                resumeError.textContent = "";
                localStorage.setItem('resume', file.name);
            }
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let isValid = true;

        const firstNameInput = document.getElementById('firstName');
        const firstNamePattern = /^[A-Za-z]{2,30}(-[A-Za-z]{2,30})?$/;
        const firstNameError = document.getElementById('firstName-error');

        if (!firstNamePattern.test(firstNameInput.value)) {
            firstNameError.textContent = "First Name should contain 2-30 characters";
            firstNameInput.style.border = "1px solid red";
            isValid = false;
        } else {
            firstNameError.textContent = "";
            firstNameInput.style.border = "";
        }

        const lastNameInput = document.getElementById('lastName');
        const lastNamePattern = /^[A-Za-z]{2,30}(-[A-Za-z]{2,30})?$/;
        const lastNameError = document.getElementById('lastName-error');

        if (!lastNamePattern.test(lastNameInput.value)) {
            lastNameError.textContent = "Last Name should contain 2-30 characters";
            lastNameInput.style.border = "1px solid red";
            isValid = false;
        } else {
            lastNameError.textContent = "";
            lastNameInput.style.border = "";
        }

        const emailInput = document.getElementById('email');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailError = document.getElementById('email-error');

        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = "Please enter a valid email";
            emailInput.style.border = "1px solid red";
            isValid = false;
        } else {
            emailError.textContent = "";
            emailInput.style.border = "";
        }

        const telInput = document.getElementById('tel');
        const telPattern = /^\+995 5\d{2} \d{2} \d{2} \d{2}$/;
        const telError = document.getElementById('tel-error');

        if (!telPattern.test(telInput.value)) {
            telError.textContent = "Please enter a valid phone number";
            telInput.style.border = "1px solid red";
            isValid = false;
        } else {
            telError.textContent = "";
            telInput.style.border = "";
        }

        const resumeError = document.getElementById('resume-error');
        if (!resumeInput.files.length) {
            resumeError.textContent = "Please upload your resume";
            isValid = false;
        } else {
            resumeError.textContent = "";
        }

        if (isValid) {
            alert("You've applied successfully!");

            localStorage.setItem('firstName', document.getElementById('firstName').value);
            localStorage.setItem('lastName', document.getElementById('lastName').value);
            localStorage.setItem('email', document.getElementById('email').value);
            localStorage.setItem('tel', document.getElementById('tel').value);

            form.reset();

            modal.style.display = "none";
        }
    });
});
