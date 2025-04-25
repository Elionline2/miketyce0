// Data Management
let projects = [];
let skills = [];
let views = {
    total: 0,
    home: 0,
    projects: 0,
    news: 0
};

// API Configuration
const API_URL = 'http://localhost:3000/api';

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    document.getElementById('loader').style.display = 'none';

    // Load saved data from localStorage
    loadSavedData();
    fetchViewCounts();

    // Navigation functionality
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Form handling
    const projectForm = document.getElementById('projectForm');
    const skillsForm = document.getElementById('skillsForm');

    // Project form submission
    projectForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const projectData = {
            id: Date.now(),
            title: formData.get('projectTitle'),
            link: formData.get('projectLink'),
            description: formData.get('projectDescription'),
            image: formData.get('projectImage')
        };
        
        projects.push(projectData);
        saveData();
        showNotification('Project saved successfully!', 'success');
        this.reset();
        updateProjectList();
    });

    // Skills form submission
    skillsForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        const skillData = {
            id: Date.now(),
            name: formData.get('skillName'),
            percentage: formData.get('skillPercentage'),
            category: formData.get('skillCategory')
        };
        
        skills.push(skillData);
        saveData();
        showNotification('Skill saved successfully!', 'success');
        this.reset();
        updateSkillsList();
    });

    // Initialize lists
    updateProjectList();
    updateSkillsList();
});

// Data Management Functions
function saveData() {
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('skills', JSON.stringify(skills));
    localStorage.setItem('views', JSON.stringify(views));
}

function loadSavedData() {
    const savedProjects = localStorage.getItem('projects');
    const savedSkills = localStorage.getItem('skills');
    const savedViews = localStorage.getItem('views');

    if (savedProjects) projects = JSON.parse(savedProjects);
    if (savedSkills) skills = JSON.parse(savedSkills);
    if (savedViews) views = JSON.parse(savedViews);
}

// List Update Functions
function updateProjectList() {
    const projectList = document.querySelector('.project-list');
    if (!projectList) return;

    projectList.innerHTML = projects.map(project => `
        <div class="project-item">
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.link ? `<a href="${project.link}" target="_blank">View Project</a>` : ''}
            </div>
            <div class="project-actions">
                <button class="btn secondary-btn" onclick="editProject(${project.id})">
                    <i class="fas fa-edit"></i>
                    Edit
                </button>
                <button class="btn secondary-btn" onclick="deleteProject(${project.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateSkillsList() {
    const skillsList = document.querySelector('.skills-list');
    if (!skillsList) return;

    const technicalSkills = skills.filter(skill => skill.category === 'technical');
    const softSkills = skills.filter(skill => skill.category === 'soft');

    skillsList.innerHTML = `
        <div class="skills-category">
            <h3>Technical Skills</h3>
            ${technicalSkills.map(skill => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span>${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
                        </div>
                        <span class="skill-percentage">${skill.percentage}%</span>
                    </div>
                    <div class="skill-actions">
                        <button class="btn secondary-btn" onclick="editSkill(${skill.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn secondary-btn" onclick="deleteSkill(${skill.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="skills-category">
            <h3>Soft Skills</h3>
            ${softSkills.map(skill => `
                <div class="skill-item">
                    <div class="skill-info">
                        <span>${skill.name}</span>
                        <div class="skill-bar">
                            <div class="skill-progress" style="width: ${skill.percentage}%"></div>
                        </div>
                        <span class="skill-percentage">${skill.percentage}%</span>
                    </div>
                    <div class="skill-actions">
                        <button class="btn secondary-btn" onclick="editSkill(${skill.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn secondary-btn" onclick="deleteSkill(${skill.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Edit and Delete Functions
function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;

    const form = document.getElementById('projectForm');
    form.querySelector('#projectTitle').value = project.title;
    form.querySelector('#projectLink').value = project.link;
    form.querySelector('#projectDescription').value = project.description;
    
    // Remove the project from the array
    projects = projects.filter(p => p.id !== id);
    saveData();
    updateProjectList();
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(p => p.id !== id);
        saveData();
        updateProjectList();
        showNotification('Project deleted successfully!', 'success');
    }
}

function editSkill(id) {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;

    const form = document.getElementById('skillsForm');
    form.querySelector('#skillName').value = skill.name;
    form.querySelector('#skillPercentage').value = skill.percentage;
    form.querySelector('#skillCategory').value = skill.category;
    
    // Remove the skill from the array
    skills = skills.filter(s => s.id !== id);
    saveData();
    updateSkillsList();
}

function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this skill?')) {
        skills = skills.filter(s => s.id !== id);
        saveData();
        updateSkillsList();
        showNotification('Skill deleted successfully!', 'success');
    }
}

// View tracking functions
async function fetchViewCounts() {
    try {
        const response = await fetch(`${API_URL}/views`);
        if (response.ok) {
            const data = await response.json();
            views = data;
            updateViewCounters();
        }
    } catch (error) {
        console.log('API server not available, using local view counts');
        // Use local storage data if API is not available
        const savedViews = localStorage.getItem('views');
        if (savedViews) {
            views = JSON.parse(savedViews);
            updateViewCounters();
        }
    }
}

// Update view counters
function updateViewCounters() {
    document.getElementById('totalViews').textContent = views.total;
    document.getElementById('homeViews').textContent = views.home;
    document.getElementById('projectsViews').textContent = views.projects;
    document.getElementById('newsViews').textContent = views.news;
}

// Set up periodic view count updates
setInterval(fetchViewCounts, 30000); // Update every 30 seconds

console.log('CMS.js loaded successfully'); 