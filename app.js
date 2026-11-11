const JOBS_URL = "./data.json";

const jobsContainer = document.querySelector(".jobs_grid");
const filterBtnsContainer = document.querySelector(".filter_btn_container");
const filterTagsContainer = document.querySelector(".filter_tags_container");
const clearBtn = document.getElementById("clearBtn");
const errMsg = document.getElementById("errMsg");

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

async function init() {
    const jobs = await fetchJobs();
    allJobs = createNewJobsList(jobs);
    displayJobList(allJobs);
}

init();