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
    var bgTop = document.getElementById('bg-top');
    var bg = document.getElementById("bg");

    if (sidenav.style.width === "68%") {
        sidenav.style.width = "0";
        bg.style.width = "0";
        bgTop.style.width = "0";
    } else {
        sidenav.style.width = "68%";
        bg.style.width = "100%";
        bgTop.style.width = "100%";
    }
    x.classList.toggle("change");
}
document.getElementById('bg-top').addEventListener('click', function () {
  var sidenav = document.getElementById("mySidenav");
  var bg = document.getElementById("bg");
  var bgTop = document.getElementById('bg-top');
  var toggleBtn = document.getElementById("toggleBtn");

  sidenav.style.width = "0";
  bg.style.width = "0";
  bgTop.style.width = "0";
  toggleBtn.classList.remove("change");
});

document.getElementById('bg').addEventListener('click', function () {
    var sidenav = document.getElementById("mySidenav");
    var bg = document.getElementById("bg");
    var bgTop = document.getElementById('bg-top');
    var toggleBtn = document.getElementById("toggleBtn");

    sidenav.style.width = "0";
    bg.style.width = "0";
    bgTop.style.width = "0";
    toggleBtn.classList.remove("change");
});

// Currency Converter Modal
const converterModal = document.getElementById("converter-modal");
const converterOpenBtn = document.getElementById("converter-open-btn");

// Show the modal
converterOpenBtn.addEventListener("click", () => {
  converterModal.style.display = "flex";
});

// Hide the modal when clicking outside the content
converterModal.addEventListener("click", (e) => {
  if (e.target === converterModal) {
    converterModal.style.display = "none";
  }
});

const key = "125546c6c88a46d7723aa164"; // API key for ExchangeRate-API

const state = {
  openedDrawer: null,
  currencies: [],
  filteredCurrencies: [],
  base: "USD",
  target: "EUR",
  rates: {},
  baseValue: 1,
};

//* selectors
const ui = {
  controls: document.getElementById("controls"),
  drawer: document.getElementById("drawer"),
  dismissBtn: document.getElementById("dismiss-btn"),
  currencyList: document.getElementById("currency-list"),
  searchInput: document.getElementById("search"),
  baseBtn: document.getElementById("base"),
  targetBtn: document.getElementById("target"),
  exchangeRate: document.getElementById("exchange-rate"),
  baseInput: document.getElementById("base-input"),
  targetInput: document.getElementById("target-input"),
  swapBtn: document.getElementById("swap-btn"),
};

//* event listeners
const setupEventListeners = () => {
  document.addEventListener("DOMContentLoaded", initApp);
  ui.controls.addEventListener("click", showDrawer);
  ui.dismissBtn.addEventListener("click", hideDrawer);
  ui.searchInput.addEventListener("input", filterCurrency);
  ui.currencyList.addEventListener("click", selectPair);
  ui.baseInput.addEventListener("change", convertInput);
  ui.swapBtn.addEventListener("click", switchPair);
};

//* event handlers
const initApp = () => {
  fetchCurrencies();
  fetchExchangeRate();
};

const showDrawer = (e) => {
  if (e.target.hasAttribute("data-drawer")) {
    state.openedDrawer = e.target.id;
    ui.drawer.classList.add("show");
  }
};

const hideDrawer = () => {
  clearSearchInput();
  state.openedDrawer = null;
  ui.drawer.classList.remove("show");
};

const filterCurrency = () => {
  const keyword = ui.searchInput.value.trim().toLowerCase();

  state.filteredCurrencies = getAvailableCurrencies().filter(
    ({ code, name }) => {
      return (
        code.toLowerCase().includes(keyword) ||
        name.toLowerCase().includes(keyword)
      );
    }
  );

  displayCurrencies();
};

const selectPair = (e) => {
  if (e.target.hasAttribute("data-code")) {
    const { openedDrawer } = state;

    // update the base or target in the state
    state[openedDrawer] = e.target.dataset.code;

    // load the exchange rates then update the btns
    loadExchangeRate();

    // close the drawer after selection
    hideDrawer();
  }
};

const convertInput = () => {
  state.baseValue = parseFloat(ui.baseInput.value) || 1;
  loadExchangeRate();
};

const switchPair = () => {
  const { base, target } = state;
  state.base = target;
  state.target = base;
  state.baseValue = parseFloat(ui.targetInput.value) || 1;
  loadExchangeRate();
};

//* render functions
const displayCurrencies = () => {
  ui.currencyList.innerHTML = state.filteredCurrencies
    .map(({ code, name }) => {
      return `
      <li data-code="${code}">
        <img src="${getImageURL(code)}" alt="${name}" />
        <div>
          <h4>${code}</h4>
          <p>${name}</p>
        </div>
      </li>
    `;
    })
    .join("");
};

const displayConversion = () => {
  updateButtons();
  updateInputs();
  updateExchangeRate();
};

const showLoading = () => {
  ui.controls.classList.add("skeleton");
  ui.exchangeRate.classList.add("skeleton");
};

const hideLoading = () => {
  ui.controls.classList.remove("skeleton");
  ui.exchangeRate.classList.remove("skeleton");
};

//* helper functions
const updateButtons = () => {
  [ui.baseBtn, ui.targetBtn].forEach((btn) => {
    const code = state[btn.id];

    btn.textContent = code;
    btn.style.setProperty("--image", `url(${getImageURL(code)})`);
  });
};

const updateInputs = () => {
  const { base, baseValue, target, rates } = state;

  const result = baseValue * rates[base][target];

  ui.targetInput.value = result.toFixed(2);
  ui.baseInput.value = baseValue;
};

const updateExchangeRate = () => {
  const { base, target, rates } = state;

  const rate = rates[base][target].toFixed(2);

  ui.exchangeRate.textContent = `1 ${base} = ${rate} ${target}`;
};

const getAvailableCurrencies = () => {
  return state.currencies.filter(({ code }) => {
    return state.base !== code && state.target !== code;
  });
};

const clearSearchInput = () => {
  ui.searchInput.value = "";
  ui.searchInput.dispatchEvent(new Event("input"));
};

const getImageURL = (code) => {
  return `https://wise.com/public-resources/assets/flags/rectangle/${code.toLowerCase()}.png`;
};

const loadExchangeRate = () => {
  const { base, rates } = state;
  if (typeof rates[base] !== "undefined") {
    // if the base rates are already in the state, then show it
    displayConversion();
  } else {
    // else, fetch the updated exchange rates
    fetchExchangeRate();
  }
};

//* api functions
const fetchCurrencies = () => {
  fetch(`https://v6.exchangerate-api.com/v6/${key}/codes`)
    .then((response) => response.json())
    .then((data) => {
      state.currencies = data.supported_codes.map(([code, name]) => ({
        code,
        name,
      }));
      state.filteredCurrencies = getAvailableCurrencies();
      displayCurrencies();
    })
    .catch(console.error);
};

const fetchExchangeRate = () => {
  const { base } = state;

  showLoading();

  fetch(`https://v6.exchangerate-api.com/v6/${key}/latest/${base}`)
    .then((response) => response.json())
    .then((data) => {
      state.rates[base] = data.conversion_rates;
      displayConversion();
    })
    .catch(console.error)
    .finally(hideLoading);
};

//* initialization
setupEventListeners();

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

        if (!firstNamePattern.test(firstNameInput.value.trim())) {
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

        if (!lastNamePattern.test(lastNameInput.value.trim())) {
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

        if (!emailPattern.test(emailInput.value.trim())) {
            emailError.textContent = "Please enter a valid email";
            emailInput.style.border = "1px solid red";
            isValid = false;
        } else {
            emailError.textContent = "";
            emailInput.style.border = "";
        }

        const telInput = document.getElementById('tel');
        const telPattern = /^(\+?995[-\s]?)?5\d{8}$/;
        const telError = document.getElementById('tel-error');
        
        const trimmedValue = telInput.value.trim();
        
        if (!telPattern.test(trimmedValue)) {
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

            let applications = JSON.parse(localStorage.getItem('applications')) || [];

            let newApplication = {
                firstName: firstNameInput.value,
                lastName: lastNameInput.value,
                email: emailInput.value,
                tel: telInput.value,
                resume: resumeInput.files[0]?.name || ""
            };

            applications.push(newApplication);
            localStorage.setItem('applications', JSON.stringify(applications));
            
            form.reset();
            modal.style.display = "none";
        }
    });
});


// currency

fetch("https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/ka/json")
  .then(response => response.json())
  .then(data => {
    const currencyContainer = document.querySelector(".currency");
    currencyContainer.innerHTML = "";

    data.forEach(info => {
        const dateElement = document.createElement("div");
        dateElement.classList.add("currency-date");
        dateElement.innerText = info.date.slice(0, 10);

        const currencies = info.currencies.filter(currency => currency.code === 'USD' || currency.code === 'EUR');
        
        const currencyText = document.createElement("div");
        currencyText.classList.add("currency-text");
        currencyText.innerHTML = currencies.map(currency => `${currency.code} - ${currency.rateFormated}`).join(" | ");

        currencyContainer.appendChild(dateElement);
        currencyContainer.appendChild(currencyText);
    });
  }) 
  .catch(error => console.log(error));
