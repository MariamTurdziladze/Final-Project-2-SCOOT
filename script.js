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
        bg.style.width= "100%";


    }
    x.classList.toggle("change");
  }

  document.getElementById('bg').addEventListener('click', function() {
    var sidenav = document.getElementById("mySidenav");
    var bg = document.getElementById("bg");
    var toggleBtn = document.getElementById("toggleBtn");
    
    sidenav.style.width = "0";
    bg.style.width = "0";
    
    toggleBtn.classList.remove("change");
});