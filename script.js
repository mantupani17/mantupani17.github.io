// Loads data.json and renders every section of the page from it.
// To update your content, edit data.json — you shouldn't need to touch this file
// unless you're changing the structure of a section.

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  loadAndRender();
});

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const cta = document.querySelector('.nav-cta');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav-open');
    if (cta) cta.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('nav-open');
      if (cta) cta.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

async function loadAndRender() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json responded with ' + res.status);
    const data = await res.json();

    renderNavAndFooter(data.profile);
    renderHero(data.profile, data.hero);
    renderAbout(data.about);
    renderSkills(data.skills);
    renderProjects(data.projects);
    renderExperience(data.experience);
    renderContact(data.contact);
  } catch (err) {
    console.error('Could not load portfolio data:', err);
    showLoadError();
  }
}

function showLoadError() {
  const hero = document.getElementById('hero-eyebrow');
  if (hero) {
    hero.textContent = 'Could not load data.json — if you opened this file directly, run a local server instead (see README).';
  }
}

/* ---------- renderers ---------- */

function renderNavAndFooter(profile) {
  const mark = document.getElementById('nav-mark');
  if (mark) {
    mark.innerHTML = `${profile.initials}<span class="mark-dot">/</span>01`;
  }
  const footerName = document.getElementById('footer-name');
  if (footerName) footerName.textContent = `© 2026 ${profile.name}`;

  const resumeLink = document.getElementById('resume-link');
  if (resumeLink && profile.resumeUrl) resumeLink.setAttribute('href', profile.resumeUrl);

  document.title = `${profile.name} — ${profile.title}`;
}

function renderHero(profile, hero) {
  const eyebrow = document.getElementById('hero-eyebrow');
  if (eyebrow) {
    eyebrow.innerHTML = `DRAWING NO. ${profile.initials}—2026 · SCALE 1:1 · STATUS <span class="status-dot"></span> ${profile.status}`;
  }

  const headline = document.getElementById('hero-headline');
  if (headline) {
    headline.innerHTML = `${hero.headline}<br/><span class="hero-sub">${hero.subheadline}</span>`;
  }

  const desc = document.getElementById('hero-desc');
  if (desc) desc.textContent = hero.description;

  const titleBlock = document.getElementById('title-block');
  if (titleBlock) {
    const fields = [
      ['NAME', profile.name],
      ['DISCIPLINE', profile.discipline],
      ['BASED IN', profile.location],
      ['REV', profile.rev],
      ['STACK', profile.stackShort],
      ['CONTACT', profile.email],
    ];
    titleBlock.innerHTML = fields.map(([label, value]) => `
      <div class="tb-cell">
        <span class="tb-label">${label}</span>
        <span class="tb-value">${value}</span>
      </div>
    `).join('');
  }
}

function renderAbout(about) {
  const textEl = document.getElementById('about-text');
  if (textEl) {
    textEl.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  const factsEl = document.getElementById('about-facts');
  if (factsEl) {
    factsEl.innerHTML = about.facts.map(f => `
      <div class="fact">
        <span class="fact-num">${f.num}</span>
        <span class="fact-label">${f.label}</span>
      </div>
    `).join('');
  }
}

function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  if (!grid) return;
  grid.innerHTML = skills.map(col => `
    <div class="skill-col">
      <h3 class="mono skill-head">${col.category.toUpperCase()}</h3>
      <ul class="skill-list">
        ${col.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  const toggleWrap = document.getElementById('projects-toggle');
  if (!grid) return;

  const sorted = [...projects].sort((a, b) => (b.score || 0) - (a.score || 0));
  const pageSize = 2;
  let visibleCount = pageSize;

  grid.innerHTML = sorted.map((p, i) => `
    <article class="project-card" data-index="${i}" hidden>
      <div class="project-card-head mono">
        <span>${p.code}</span>
        <span class="project-year">${p.year}</span>
      </div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tags mono">
        ${p.tags.map(t => `<span>${t}</span>`).join('')}
      </div>
      <div class="project-links">
        ${p.status
          ? `<span class="project-status">${p.status}</span>`
          : (p.links || []).map(l => `<a href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`).join('')}
      </div>
    </article>
  `).join('');

  const cards = Array.from(grid.querySelectorAll('.project-card'));

  function applyVisibility() {
    cards.forEach((card, i) => {
      card.hidden = i >= visibleCount;
    });
  }

  function updateToggle() {
    if (!toggleWrap) return;
    const remaining = sorted.length - visibleCount;

    if (remaining <= 0 && visibleCount <= pageSize) {
      // fewer projects than one page — no button needed at all
      toggleWrap.innerHTML = '';
      return;
    }

    if (remaining <= 0) {
      toggleWrap.innerHTML = `<button type="button" class="btn btn-ghost" id="projects-toggle-btn">Show fewer projects ↑</button>`;
    } else {
      const nextBatch = Math.min(pageSize, remaining);
      toggleWrap.innerHTML = `<button type="button" class="btn btn-ghost" id="projects-toggle-btn">Show ${nextBatch} more project${nextBatch === 1 ? '' : 's'} ↓</button>`;
    }

    document.getElementById('projects-toggle-btn').addEventListener('click', () => {
      const remainingNow = sorted.length - visibleCount;
      if (remainingNow <= 0) {
        // collapse back to first page
        visibleCount = pageSize;
        applyVisibility();
        updateToggle();
        document.getElementById('projects').scrollIntoView({ block: 'nearest' });
      } else {
        visibleCount = Math.min(visibleCount + pageSize, sorted.length);
        applyVisibility();
        updateToggle();
      }
    });
  }

  applyVisibility();
  updateToggle();
}

function renderExperience(experience) {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;
  timeline.innerHTML = experience.map(job => `
    <div class="timeline-item">
      <div class="timeline-date mono">${job.dateRange}</div>
      <div class="timeline-body">
        <h3>${job.role} · ${job.company}</h3>
        <p>${job.description}</p>
      </div>
    </div>
  `).join('');
}

function renderContact(contact) {
  const lead = document.getElementById('contact-lead');
  if (lead) lead.textContent = contact.leadText;

  const links = document.getElementById('contact-links');
  if (links) {
    links.innerHTML = contact.links.map(l =>
      `<a href="${l.href}" target="_blank" rel="noopener">${l.label}</a>`
    ).join('');
  }
}