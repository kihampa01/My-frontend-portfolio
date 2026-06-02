const fallbackProfile = {
  name: "Mkiva David",
  initials: "MD",
  role: "Data Scientist, Analyst, Software Developer",
  focus: "Data Science, Analytics, Software Development",
  location: "Dar es Salaam, Tanzania",
  bio:
    "I build data-driven solutions and software tools that transform business requirements into high-impact insights.",
  skills: [
    "Python",
    "SQL",
    "Machine Learning",
    "Data Visualization",
    "JavaScript",
    "Cloud Analytics",
    "Business Intelligence",
    "API Development"
  ],
  qualifications: [
    {
      title: "Data Science and Analytics Training",
      detail: "Hands-on experience building dashboards, predictive models, and analytics workflows."
    },
    {
      title: "Software Development Coursework",
      detail: "Practical projects in software engineering, databases, and web application development."
    }
  ],
  projects: [
    {
      title: "Sales Forecast Dashboard",
      description:
        "A dashboard that visualizes sales trends and business performance using historical data.",
      technologies: ["Python", "SQL", "Tableau", "JavaScript"]
    },
    {
      title: "Customer Insights Engine",
      description:
        "A data pipeline that generates customer segmentation and analytics for decision support.",
      technologies: ["Python", "Pandas", "Machine Learning", "Cloud Services"]
    },
    {
      title: "Portfolio Project Admin Portal",
      description:
        "A secure project management area for adding and updating portfolio entries.",
      technologies: ["JavaScript", "Node.js", "REST API"]
    }
  ],
  adminHash: "56681010b753e1abe52c449d0aab291b28f1808a3a91b6baeaa726883baad4b0",
  contact: {
    email: "mkivakihampa05@gmail.com",
    phone: "+255763832814",
    github: "https://github.com/kihampa01"
  }
};

const config = window.PORTFOLIO_CONFIG || {};
const apiBaseUrl = (config.apiBaseUrl || "http://localhost:3001").replace(/\/$/, "");

const setText = (id, value) => {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text) {
    element.textContent = text;
  }
  return element;
};

const renderSkills = (skills) => {
  const list = document.getElementById("skills-list");
  list.replaceChildren();

  skills.forEach((skill) => {
    list.appendChild(createElement("span", "tag", skill));
  });
};

const renderQualifications = (qualifications) => {
  const list = document.getElementById("qualifications-list");
  list.replaceChildren();

  qualifications.forEach((qualification) => {
    const item = createElement("article", "timeline-item");
    item.appendChild(createElement("h3", "", qualification.title));
    item.appendChild(createElement("p", "", qualification.detail));
    list.appendChild(item);
  });
};

const renderProjects = (projects) => {
  const list = document.getElementById("projects-list");
  list.replaceChildren();

  projects.forEach((project, index) => {
    const card = createElement("article", "project-card");
    const media = createElement("div", "project-media", `0${index + 1}`);
    const techList = createElement("div", "project-tech");

    project.technologies.forEach((technology) => {
      techList.appendChild(createElement("span", "", technology));
    });

    card.appendChild(media);
    card.appendChild(createElement("h3", "", project.title));
    card.appendChild(createElement("p", "", project.description));
    card.appendChild(techList);
    list.appendChild(card);
  });
};

const updateContactLink = (id, href, label) => {
  const link = document.getElementById(id);
  if (!link) {
    return;
  }

  link.href = href;
  link.querySelector("strong").textContent = label;
};

const renderProfile = (profile, apiOnline) => {
  if (typeof profile.name === 'string') {
    profile.name = profile.name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  document.title = `${profile.name} | Personal Portfolio`;
  setText("profile-name", profile.name);
  setText("profile-initials", profile.initials);
  setText("profile-role", profile.role);
  setText("profile-bio", profile.bio);
  setText("profile-location", profile.location);
  setText("profile-focus", profile.focus);
  setText("api-status", apiOnline ? "Connected" : "Fallback Data");

  renderSkills(profile.skills);
  renderQualifications(profile.qualifications);
  renderProjects(profile.projects);

  updateContactLink("contact-email", `mailto:${profile.contact.email}`, profile.contact.email);
  updateContactLink("contact-phone", `tel:${profile.contact.phone}`, profile.contact.phone);
  updateContactLink("contact-github", profile.contact.github, profile.contact.github.replace("https://", ""));

  const badge = document.getElementById('profile-badge');
  if (badge) {
    if (profile.photo) {
      badge.src = profile.photo;
      badge.alt = `${profile.name} photo`;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
};

function loadLocalPhoto() {
  try {
    return localStorage.getItem('mkiva_profile_photo');
  } catch (e) {
    return null;
  }
}

function saveLocalPhoto(photoDataUrl) {
  try {
    localStorage.setItem('mkiva_profile_photo', photoDataUrl);
  } catch (e) {
    console.warn('Could not save profile photo locally', e);
  }
}

function resizeImageFile(file, size = 180) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        context.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let currentProfile = null;
let isAdmin = false;

// Utility: SHA-256 hex using SubtleCrypto
async function sha256Hex(message) {
  const enc = new TextEncoder();
  const msgUint8 = enc.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadLocalProjects() {
  try {
    const raw = localStorage.getItem('mkiva_projects');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveLocalProjects(projects) {
  try {
    localStorage.setItem('mkiva_projects', JSON.stringify(projects));
  } catch (e) {
    console.warn('Could not save projects locally', e);
  }
}

function mergeLocalProjects(profile) {
  const local = loadLocalProjects();
  if (local && Array.isArray(local)) {
    // merge but avoid duplicates by title
    const titles = new Set(profile.projects.map(p => p.title));
    local.forEach(p => { if (!titles.has(p.title)) profile.projects.unshift(p); });
  }
}

function initAdminControls() {
  const loginBtn = document.getElementById('admin-login-button');
  const pwdInput = document.getElementById('admin-password');
  const msg = document.getElementById('admin-message');
  const adminArea = document.getElementById('admin-area');
  const loginPanel = document.getElementById('admin-login');
  const addBtn = document.getElementById('project-add');
  const logoutBtn = document.getElementById('admin-logout');

  // ACCEPT ANY PASSWORD: enable admin when user clicks Unlock, regardless of input
  loginBtn && loginBtn.addEventListener('click', async () => {
    isAdmin = true;
    if (msg) msg.style.display = 'none';
    if (loginPanel) loginPanel.style.display = 'none';
    if (adminArea) adminArea.style.display = 'block';
  });

  const photoUpload = document.getElementById('profile-photo-upload');
  photoUpload && photoUpload.addEventListener('change', async (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) {
      return;
    }
    try {
      const resized = await resizeImageFile(file, 220);
      currentProfile.photo = resized;
      saveLocalPhoto(resized);
      renderProfile(currentProfile, true);
    } catch (error) {
      alert('Unable to process the image. Please use a valid photo file.');
      console.error(error);
    }
  });

  addBtn && addBtn.addEventListener('click', () => {
    const title = document.getElementById('project-title').value.trim();
    const desc = document.getElementById('project-description').value.trim();
    const tech = document.getElementById('project-tech').value.split(',').map(t => t.trim()).filter(Boolean);
    if (!title) return alert('Enter a project title');
    const project = { title, description: desc, technologies: tech };
    currentProfile.projects.unshift(project);
    saveLocalProjects(currentProfile.projects);
    renderProjects(currentProfile.projects);
    document.getElementById('project-title').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-tech').value = '';
  });

  logoutBtn && logoutBtn.addEventListener('click', () => {
    isAdmin = false;
    loginPanel.style.display = 'block';
    adminArea.style.display = 'none';
    pwdInput.value = '';
  });
}

const loadProfile = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/profile`, {
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const profile = await response.json();
    currentProfile = profile;
    const localPhoto = loadLocalPhoto();
    if (localPhoto) {
      currentProfile.photo = localPhoto;
    }
    mergeLocalProjects(currentProfile);
    renderProfile(currentProfile, true);
    initAdminControls();
  } catch (error) {
    console.warn("Using fallback portfolio data:", error);
    currentProfile = JSON.parse(JSON.stringify(fallbackProfile));
    const localPhoto = loadLocalPhoto();
    if (localPhoto) {
      currentProfile.photo = localPhoto;
    }
    mergeLocalProjects(currentProfile);
    renderProfile(currentProfile, false);
    initAdminControls();
  }
};

loadProfile();
