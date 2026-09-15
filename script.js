"use strict";

/*
 * EdVyro Task 02
 * Responsive Internship Board
 *
 * Technologies:
 * HTML, CSS, JavaScript, JSON
 */

// ------------------------------------
// Application State
// ------------------------------------

let internships = [];
let filteredInternships = [];
let selectedInternship = null;


// ------------------------------------
// DOM Elements
// ------------------------------------

const filterForm = document.getElementById("filterForm");

const searchInput = document.getElementById("searchInput");
const domainFilter = document.getElementById("domainFilter");
const modeFilter = document.getElementById("modeFilter");

const clearFilters = document.getElementById("clearFilters");
const emptyClearButton = document.getElementById("emptyClearButton");

const internshipList = document.getElementById("internshipList");
const resultsCount = document.getElementById("resultsCount");

const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const emptyState = document.getElementById("emptyState");

const retryButton = document.getElementById("retryButton");

// Details dialog
const detailsDialog = document.getElementById("detailsDialog");
const detailsTitle = document.getElementById("detailsTitle");
const detailsContent = document.getElementById("detailsContent");

const closeDetailsButton =
    document.getElementById("closeDetailsButton");

const detailsCancelButton =
    document.getElementById("detailsCancelButton");

const detailsApplyButton =
    document.getElementById("detailsApplyButton");

// Application dialog
const applicationDialog =
    document.getElementById("applicationDialog");

const applicationTitle =
    document.getElementById("applicationTitle");

const applicationForm =
    document.getElementById("applicationForm");

const applicationInternshipId =
    document.getElementById("applicationInternshipId");

const applicantName =
    document.getElementById("applicantName");

const applicantEmail =
    document.getElementById("applicantEmail");

const portfolioUrl =
    document.getElementById("portfolioUrl");

const closeApplicationButton =
    document.getElementById("closeApplicationButton");

const cancelApplicationButton =
    document.getElementById("cancelApplicationButton");

const applicationMessage =
    document.getElementById("applicationMessage");


// Error elements
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const portfolioError = document.getElementById("portfolioError");


// ------------------------------------
// Load Internship Data
// ------------------------------------

async function loadInternships() {

    showLoadingState();

    try {

        const response = await fetch(
            "internship-records-sample.json"
        );

        if (!response.ok) {
            throw new Error("Unable to load internship data.");
        }

        const data = await response.json();

        if (
            !data ||
            !Array.isArray(data.internships)
        ) {
            throw new Error("Invalid internship data.");
        }

        internships = data.internships;

        populateFilters();

        applyFilters();

    } catch (error) {

        console.error("Internship loading error:", error);

        showErrorState();
    }
}


// ------------------------------------
// Populate Filter Options
// ------------------------------------

function populateFilters() {

    const domains = [
        ...new Set(
            internships.map(
                internship => internship.domain
            )
        )
    ].sort();

    const modes = [
        ...new Set(
            internships.map(
                internship => internship.mode
            )
        )
    ].sort();


    domainFilter.innerHTML =
        '<option value="">All domains</option>';

    modeFilter.innerHTML =
        '<option value="">All work modes</option>';


    domains.forEach(domain => {

        const option =
            document.createElement("option");

        option.value = domain;
        option.textContent = domain;

        domainFilter.appendChild(option);
    });


    modes.forEach(mode => {

        const option =
            document.createElement("option");

        option.value = mode;
        option.textContent = mode;

        modeFilter.appendChild(option);
    });
}


// ------------------------------------
// Search and Filter
// ------------------------------------

function applyFilters() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedDomain =
        domainFilter.value;

    const selectedMode =
        modeFilter.value;


    filteredInternships =
        internships.filter(internship => {

            const searchableText = [

                internship.title,

                internship.domain,

                internship.mode,

                internship.location,

                ...internship.skills

            ]
                .join(" ")
                .toLowerCase();


            const matchesSearch =
                !searchTerm ||
                searchableText.includes(searchTerm);


            const matchesDomain =
                !selectedDomain ||
                internship.domain === selectedDomain;


            const matchesMode =
                !selectedMode ||
                internship.mode === selectedMode;


            return (
                matchesSearch &&
                matchesDomain &&
                matchesMode
            );
        });


    renderInternships();
}


// ------------------------------------
// Render Internship Cards
// ------------------------------------

function renderInternships() {

    hideAllStates();

    internshipList.innerHTML = "";


    if (filteredInternships.length === 0) {

        resultsCount.textContent =
            "0 internships found";

        emptyState.hidden = false;

        return;
    }


    resultsCount.textContent =
        `${filteredInternships.length} ${
            filteredInternships.length === 1
                ? "internship"
                : "internships"
        } found`;


    filteredInternships.forEach(
        internship => {

            const card =
                createInternshipCard(internship);

            internshipList.appendChild(card);
        }
    );
}


// ------------------------------------
// Create Internship Card
// ------------------------------------

function createInternshipCard(internship) {

    const card =
        document.createElement("article");

    card.className = "internship-card";


    const skillsHTML =
        internship.skills
            .map(
                skill =>
                    `<span class="skill-tag">${escapeHTML(
                        skill
                    )}</span>`
            )
            .join("");


    card.innerHTML = `

        <div class="card-top">

            <p class="card-id">
                ${escapeHTML(internship.id)}
            </p>

            <span class="mode-badge">
                ${escapeHTML(internship.mode)}
            </span>

        </div>


        <h3>
            ${escapeHTML(internship.title)}
        </h3>


        <p class="domain">
            ${escapeHTML(internship.domain)}
        </p>


        <div class="card-details">

            <div class="card-detail">
                <strong>Location:</strong>
                <span>
                    ${escapeHTML(internship.location)}
                </span>
            </div>

            <div class="card-detail">
                <strong>Openings:</strong>
                <span>
                    ${internship.openings}
                </span>
            </div>

        </div>


        <div class="skills">
            ${skillsHTML}
        </div>


        <div class="card-actions">

            <button
                type="button"
                class="secondary-button details-button"
                data-id="${escapeHTML(internship.id)}"
            >
                View Details
            </button>

            <button
                type="button"
                class="primary-button apply-button"
                data-id="${escapeHTML(internship.id)}"
            >
                Apply
            </button>

        </div>
    `;


    return card;
}


// ------------------------------------
// Event Delegation for Cards
// ------------------------------------

internshipList.addEventListener(
    "click",
    event => {

        const detailsButton =
            event.target.closest(".details-button");

        const applyButton =
            event.target.closest(".apply-button");


        if (detailsButton) {

            const id =
                detailsButton.dataset.id;

            openDetails(id);
        }


        if (applyButton) {

            const id =
                applyButton.dataset.id;

            openApplication(id);
        }
    }
);


// ------------------------------------
// Open Details
// ------------------------------------

function openDetails(id) {

    const internship =
        internships.find(
            item => item.id === id
        );


    if (!internship) {
        return;
    }


    selectedInternship = internship;


    detailsTitle.textContent =
        internship.title;


    detailsContent.innerHTML = `

        <div class="details-list">

            <div class="details-item">
                <strong>Internship ID</strong>
                <span>
                    ${escapeHTML(internship.id)}
                </span>
            </div>

            <div class="details-item">
                <strong>Domain</strong>
                <span>
                    ${escapeHTML(internship.domain)}
                </span>
            </div>

            <div class="details-item">
                <strong>Work Mode</strong>
                <span>
                    ${escapeHTML(internship.mode)}
                </span>
            </div>

            <div class="details-item">
                <strong>Location</strong>
                <span>
                    ${escapeHTML(internship.location)}
                </span>
            </div>

            <div class="details-item">
                <strong>Openings</strong>
                <span>
                    ${internship.openings}
                </span>
            </div>

            <div class="details-item">
                <strong>Required Skills</strong>
                <span>
                    ${internship.skills
                        .map(skill =>
                            escapeHTML(skill)
                        )
                        .join(", ")
                    }
                </span>
            </div>

        </div>
    `;


    detailsDialog.showModal();
}


// ------------------------------------
// Close Details
// ------------------------------------

closeDetailsButton.addEventListener(
    "click",
    () => detailsDialog.close()
);

detailsCancelButton.addEventListener(
    "click",
    () => detailsDialog.close()
);


// ------------------------------------
// Apply from Details
// ------------------------------------

detailsApplyButton.addEventListener(
    "click",
    () => {

        if (!selectedInternship) {
            return;
        }

        detailsDialog.close();

        openApplication(
            selectedInternship.id
        );
    }
);


// ------------------------------------
// Open Application
// ------------------------------------

function openApplication(id) {

    const internship =
        internships.find(
            item => item.id === id
        );


    if (!internship) {
        return;
    }


    selectedInternship = internship;


    applicationTitle.textContent =
        `Apply for ${internship.title}`;


    applicationInternshipId.value =
        internship.id;


    resetApplicationForm();


    applicationDialog.showModal();
}


// ------------------------------------
// Close Application
// ------------------------------------

closeApplicationButton.addEventListener(
    "click",
    () => applicationDialog.close()
);

cancelApplicationButton.addEventListener(
    "click",
    () => applicationDialog.close()
);


// ------------------------------------
// Application Validation
// ------------------------------------

applicationForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        clearValidationErrors();


        const name =
            applicantName.value.trim();

        const email =
            applicantEmail.value.trim();

        const portfolio =
            portfolioUrl.value.trim();


        let isValid = true;


        if (name.length < 2) {

            showFieldError(
                nameError,
                applicantName
            );

            isValid = false;
        }


        if (!isValidEmail(email)) {

            showFieldError(
                emailError,
                applicantEmail
            );

            isValid = false;
        }


        if (
            portfolio &&
            !isValidUrl(portfolio)
        ) {

            showFieldError(
                portfolioError,
                portfolioUrl
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        saveApplication({
            internshipId:
                applicationInternshipId.value,

            name,

            email,

            portfolio
        });
    }
);


// ------------------------------------
// Save Application
// ------------------------------------

function saveApplication(application) {

    const storageKey =
        "edvyroTask02Applications";


    const existingApplications =
        JSON.parse(
            localStorage.getItem(storageKey) || "[]"
        );


    const duplicate =
        existingApplications.some(
            item =>
                item.internshipId ===
                    application.internshipId &&

                item.email.toLowerCase() ===
                    application.email.toLowerCase()
        );


    if (duplicate) {

        applicationMessage.textContent =
            "An application with this email already exists for this internship.";

        applicationMessage.hidden = false;

        applicationMessage.style.background =
            "#fef3f2";

        applicationMessage.style.color =
            "#b42318";

        return;
    }


    existingApplications.push({
        ...application,

        submittedAt:
            new Date().toISOString()
    });


    localStorage.setItem(
        storageKey,
        JSON.stringify(existingApplications)
    );


    applicationMessage.textContent =
        "Application submitted successfully for this demo.";

    applicationMessage.hidden = false;

    applicationMessage.style.background =
        "#ecfdf3";

    applicationMessage.style.color =
        "#067647";


    applicationForm
        .querySelectorAll(
            "input, button"
        )
        .forEach(element => {

            if (
                element.type !== "hidden"
            ) {
                element.disabled = true;
            }
        });
}


// ------------------------------------
// Form Helpers
// ------------------------------------

function resetApplicationForm() {

    applicationForm.reset();

    applicationInternshipId.value =
        selectedInternship
            ? selectedInternship.id
            : "";


    clearValidationErrors();

    applicationMessage.hidden = true;

    applicationMessage.textContent = "";

    applicationForm
        .querySelectorAll(
            "input, button"
        )
        .forEach(element => {

            element.disabled = false;
        });
}


function clearValidationErrors() {

    nameError.hidden = true;
    emailError.hidden = true;
    portfolioError.hidden = true;

    applicantName.removeAttribute(
        "aria-invalid"
    );

    applicantEmail.removeAttribute(
        "aria-invalid"
    );

    portfolioUrl.removeAttribute(
        "aria-invalid"
    );
}


function showFieldError(
    errorElement,
    inputElement
) {

    errorElement.hidden = false;

    inputElement.setAttribute(
        "aria-invalid",
        "true"
    );

    inputElement.focus();
}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function isValidUrl(value) {

    try {

        const url =
            new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;
    }
}


// ------------------------------------
// Clear Filters
// ------------------------------------

function resetFilters() {

    searchInput.value = "";

    domainFilter.value = "";

    modeFilter.value = "";

    applyFilters();

    searchInput.focus();
}


clearFilters.addEventListener(
    "click",
    resetFilters
);

emptyClearButton.addEventListener(
    "click",
    resetFilters
);


// ------------------------------------
// Search / Filter Events
// ------------------------------------

filterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        applyFilters();
    }
);


searchInput.addEventListener(
    "input",
    applyFilters
);


domainFilter.addEventListener(
    "change",
    applyFilters
);


modeFilter.addEventListener(
    "change",
    applyFilters
);


// ------------------------------------
// Retry
// ------------------------------------

retryButton.addEventListener(
    "click",
    loadInternships
);


// ------------------------------------
// State Helpers
// ------------------------------------

function hideAllStates() {

    loadingState.hidden = true;

    errorState.hidden = true;

    emptyState.hidden = true;
}


function showLoadingState() {

    hideAllStates();

    internshipList.innerHTML = "";

    resultsCount.textContent =
        "Loading internships...";

    loadingState.hidden = false;
}


function showErrorState() {

    hideAllStates();

    internshipList.innerHTML = "";

    resultsCount.textContent =
        "Unable to load internships.";

    errorState.hidden = false;
}


// ------------------------------------
// HTML Safety
// ------------------------------------

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ------------------------------------
// Close Dialog by Clicking Backdrop
// ------------------------------------

detailsDialog.addEventListener(
    "click",
    event => {

        if (
            event.target === detailsDialog
        ) {
            detailsDialog.close();
        }
    }
);


applicationDialog.addEventListener(
    "click",
    event => {

        if (
            event.target === applicationDialog
        ) {
            applicationDialog.close();
        }
    }
);


// ------------------------------------
// Start Application
// ------------------------------------

loadInternships();