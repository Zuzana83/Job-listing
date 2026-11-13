const JOBS_URL = "./data.json";

const jobsContainer = document.querySelector(".jobs_grid");
const filterBtnsContainer = document.querySelector(".filter_btn_container");
const filterTagsContainer = document.querySelector(".filter_tags_container");
const clearBtn = document.getElementById("clearBtn");
const errMsg = document.getElementById("errMsg");
const statusRegionEl = document.getElementById("statusRegion");

let activeTags = [];
let allJobs = [];

async function fetchJobs() {
    try {
        const resp = await fetch(JOBS_URL);
        if(!resp.ok) {
           throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        if(errMsg.children.length === 0) {
            const p = document.createElement("p");
            p.textContent = "Sorry, we could not load the job list! Please, try again later!";
            errMsg.appendChild(p);
        }
        errMsg.classList.add("show");
        return [];
    }
}

function createNewJobsList(jobs) {
    let newJobsList = jobs.map(job => {
        let jobTags = [job.level, job.role, ...job.tools, ...job.languages];
        const newJob = {...job, jobTags};
        return newJob;
    });
    return newJobsList;
}

function displayJobList(list) {
    let jobsCards = list.map(function(job) {
        const {id, company, new: newJob , featured, position, postedAt, contract, location, logo} = job;
        const jobTags = job.jobTags;

        const classList = featured ? "job_offer_card tagged" : "job_offer_card"; 
   
        return `
            <article class="${classList}" data-id="${id}">
                <div class="logo_wrapper">
                <img src="${logo}" alt="${company} logo" class="logo_img" />
                </div>
                <div class="job_description_wrapper">
                <div class="job_offer_info">
                    <p class="company">${company}</p>
                    <div class="dateline_tags">
                    ${newJob ? `<span class="new">new!</span>` : ""}
                    ${featured ? `<span class="featured">featured</span>` : ""}
                    </div>
                </div>
                <p class="job_title">${position}</p>
                <div class="job_desc">
                    <span class="job_desc_text lowercase">${postedAt}</span>
                    <span class="dot"></span>
                    <span class="job_desc_text">${contract}</span>
                    <span class="dot"></span>
                    <span class="job_desc_text">${location}</span>
                </div>
                </div>
                <div class="hard_skills_tags_list">
                ${jobTags.map(function(tag) {
                    return ` <button type="button" class="skill_btn" data-id="${tag}">${tag}</button>`
                }).join("")}
                </div>
            </article>
    `
    }).join("");
    jobsContainer.innerHTML = jobsCards;
}

function updateUI(refocus = false) {
    let filteredJobList = allJobs.filter(job => {
        return activeTags.every(tag => job.jobTags.includes(tag));
    });
    const activeFilterBtns = activeTags.map(btn => {
        return `<li class="filter_tag">
                    <span class="tag">${btn}</span>
                    <button type="button" aria-label="Remove filter ${btn}" class="closeBtn" data-id="${btn}">
                        <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path fill="#FFF" fill-rule="evenodd" d="M11.314 0l2.121 2.121-4.596 4.596 4.596 4.597-2.121 2.121-4.597-4.596-4.596 4.596L0 11.314l4.596-4.597L0 2.121 2.121 0l4.596 4.596L11.314 0z"/></svg>
                    </button>
                </li>`
    }).join("");
    filterTagsContainer.innerHTML = activeFilterBtns;
    filterBtnsContainer.classList.toggle("active", activeTags.length > 0);

    if(filteredJobList.length === 0) {
        statusRegionEl.textContent = "No jobs matched your filter."
    } else if(filteredJobList.length === 1) {
        statusRegionEl.textContent = `1 job matches your filters.`
    } else {
        statusRegionEl.textContent = `${filteredJobList.length} jobs match your filters.`
    }
    displayJobList(filteredJobList);
    if(refocus) {
        const skillBtn = jobsContainer.querySelector(".skill_btn");
        if(skillBtn) {
            skillBtn.focus();
        } else {
            const closeChip = filterTagsContainer.querySelector(".closeBtn");
            if(closeChip) closeChip.focus();
        }
    }
    
}

jobsContainer.addEventListener("click", function(e) {
    const skillBtn = e.target.closest(".skill_btn");
    if(skillBtn) {
        const btnID = skillBtn.dataset.id;
        if(!activeTags.includes(btnID)) {
            activeTags.push(btnID);
        }
        const isKeyboard = e.detail === 0;
        updateUI(isKeyboard);
    }
});

clearBtn.addEventListener("click", function() {
    activeTags = [];
    updateUI(true);
});

filterTagsContainer.addEventListener("click", function(e) {
    const closeBtn = e.target.closest(".closeBtn");

    if(closeBtn) {
        const jobTag = closeBtn.dataset.id;
        const idx = activeTags.indexOf(jobTag);
        activeTags = activeTags.filter(function(btn) {
            return btn !== jobTag;
        });
        updateUI();
        const closeBtnsArr = [...document.querySelectorAll(".closeBtn")];
        const focusedBtn = closeBtnsArr[idx];
        if(focusedBtn) {
            focusedBtn.focus();
        } else {
            const skillBtn = jobsContainer.querySelector(".skill_btn");
            skillBtn?.focus();
        }
    }
});


async function init() {
    const jobs = await fetchJobs();
    allJobs = createNewJobsList(jobs);
    displayJobList(allJobs);
}

init();
