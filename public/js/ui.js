import { BrandLinks } from './constants.js';

const Categories = [
  { key: 'propertyTypes', name: 'Property Types', icon: '🏢', desc: 'Apartment, Duplex, Penthouse, ...' },
  { key: 'homeInteriorDecor', name: 'Home Interior & Decor', icon: '🛋️', desc: 'Kitchen, Sofa, Lighting, ...' },
  { key: 'mortgageFinance', name: 'Mortgage & Finance', icon: '💸', desc: 'Mortgage, Equity, Interest, ...' },
  { key: 'legalDocumentation', name: 'Legal & Documentation', icon: '⚖️', desc: 'Deed, Title, Survey, ...' },
  { key: 'constructionMaterials', name: 'Construction & Materials', icon: '🏗️', desc: 'Concrete, Rebar, Beam, ...' },
  { key: 'maintenanceUtilities', name: 'Maintenance & Utilities', icon: '🔧', desc: 'Generator, Inverter, Solar, ...' },
  { key: 'stakeholdersRoles', name: 'Stakeholders & Roles', icon: '👷', desc: 'Realtor, Surveyor, Architect, ...' },
  { key: 'locationsNigeria', name: 'Locations (Nigeria)', icon: '📍', desc: 'Lagos, Abuja, Ibadan, ...' },
  { key: 'investmentMetrics', name: 'Investment & Metrics', icon: '📈', desc: 'ROI, Yield, Cashflow, ...' },
  { key: 'smartHomeTech', name: 'Smart Home & Tech', icon: '🏠', desc: 'Sensor, Camera, Hub, ...' }
];

export const loadCategories = async (onSelect) => {
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';

  for (const c of Categories) {
    const card = document.createElement('button');
    card.className = 'card p-4 text-left hover:shadow-md transition-shadow focus-ring';
    card.setAttribute('aria-label', `${c.name} category`);
    card.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl">${c.icon}</div>
        <div class="flex-1">
          <div class="font-semibold">${c.name}</div>
          <div class="text-sm text-gray-600">${c.desc}</div>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
        <span class="px-2 py-0.5 rounded-full bg-gray-100">Easy</span>
        <span class="px-2 py-0.5 rounded-full bg-gray-100">Medium</span>
        <span class="px-2 py-0.5 rounded-full bg-gray-100">Hard</span>
      </div>
    `;
    card.addEventListener('click', () => onSelect(c.key));
    grid.appendChild(card);
  }

  // Wire sidebar CTAs
  const listings = document.getElementById('cta-listings');
  const nhf = document.getElementById('cta-nhf');
  const wa = document.getElementById('cta-whatsapp');
  if (listings) listings.href = BrandLinks.listingsLagos;
  if (nhf) nhf.href = BrandLinks.nhfInfo;
  if (wa) wa.href = BrandLinks.whatsapp;
}; 