const URL = "./data.json";

const jobsContainer = document.querySelector(".jobs_grid");
const filterBtnsContainer = document.querySelector(".filter_btn_container");
const filterTagsContainer = document.querySelector(".filter_tags_container");
const clearBtn = document.getElementById("clearBtn");

let filterBtnArr = [];

async function fetchJobs() {
    try {
        const resp = await fetch(URL);
        if(!resp.ok) {
           throw new Error(`HTTP error! status: ${resp.status}`);
        }
        const data = await resp.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function displayJobList(list) {
    let jobsCards = list.map(function(job) {
        const {id, company, new: newJob , featured, position, role, level, postedAt, contract, location, logo} = job;
        const {languages} = job;
        const  {tools} = job;


        const classList = featured ? "job_offer_card tagged" : "job_offer_card"; 
   
        return `
            <article class="${classList}" data-id=${id}>
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
                <button type="button" class="skill_btn" data-id="${role}">${role}</button>
                <button type="button" class="skill_btn" data-id="${level}">${level}</button>
                ${tools.map(function(tool) {
                    return ` <button type="button" class="skill_btn" data-id="${tool}">${tool}</button>`
                }).join("")}
                ${languages.map(function(language) {
                    return ` <button type="button" class="skill_btn" data-id="${language}">${language}</button>`
                }).join("")}
                </div>
            </article>
    `
    }).join("");
    jobsContainer.innerHTML = jobsCards;
}

async function init() {
    const jobs = await fetchJobs();
    displayJobList(jobs);
}

init();