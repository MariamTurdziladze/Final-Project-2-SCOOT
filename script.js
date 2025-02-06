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