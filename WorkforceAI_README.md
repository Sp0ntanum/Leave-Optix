# Workforce AI Feature - File Documentation

## 📦 Package Contents

This package contains all the files required for the **Workforce AI Intelligence** feature in Leave-Optix.

### **Included Files:**

#### 1. **Core Components** (4 files)
Located in: `frontend/src/components/ui/`

- **WorkforceSimulation.tsx** (288 lines)
  - Scenario testing engine with 3 pre-configured scenarios
  - Holiday Season Peak, Summer Vacation Wave, Project Crunch
  - Real-time AI simulation with coverage & productivity metrics
  - Risk analysis and recommendations

- **SkillCoverageMap.tsx** (400+ lines)
  - 6 skill categories tracking (Frontend, Backend, UI/UX, DevOps, Security, QA)
  - Real-time coverage percentages with color-coded status
  - Team member tracking per skill
  - Critical alerts for skills below 70% coverage
  - Time range filtering

- **BurnoutRiskDashboard.tsx** (392 lines)
  - 6 team members with risk scores (25-85%)
  - 4 risk factors per member (overtime, consecutive days, project load, last leave)
  - Trend indicators (Improving/Stable/Declining)
  - Color-coded risk levels (Critical/High/Moderate/Low)
  - AI recommendations and wellness action plans

- **AdaptiveLeaveAssistant.tsx** (320+ lines)
  - AI-powered leave suggestion engine
  - Analyzes optimal leave windows based on team coverage
  - Shows ranked suggestions with optimal scores
  - Team impact metrics (coverage %, productivity %, conflicts)
  - Alternative date suggestions

#### 2. **Main Page** (1 file)
Located in: `frontend/src/pages/workload/`

- **WorkforceAI.tsx** (103 lines)
  - Dedicated page for Workforce AI features
  - Professional header with AI branding
  - Quick stats section
  - Full-width sections for Skill Coverage & Burnout Risk
  - AI recommendations footer

---

## 🚀 Installation Instructions

### **Step 1: Copy Files**
Extract the zip and place files in their respective directories:
```
frontend/
├── src/
    ├── components/
    │   └── ui/
    │       ├── WorkforceSimulation.tsx
    │       ├── SkillCoverageMap.tsx
    │       ├── BurnoutRiskDashboard.tsx
    │       └── AdaptiveLeaveAssistant.tsx
    └── pages/
        └── workload/
            └── WorkforceAI.tsx
```

### **Step 2: Update Exports**
Add to `frontend/src/components/ui/index.ts`:
```typescript
export { default as WorkforceSimulation } from './WorkforceSimulation';
export { default as SkillCoverageMap } from './SkillCoverageMap';
export { default as BurnoutRiskDashboard } from './BurnoutRiskDashboard';
export { default as AdaptiveLeaveAssistant } from './AdaptiveLeaveAssistant';
```

### **Step 3: Add Route**
In `frontend/src/App.tsx`:
```typescript
// Import
import WorkforceAI from '@/pages/workload/WorkforceAI'

// Add route inside protected routes section
<Route path="/workforce-ai" element={<WorkforceAI />} />
```

### **Step 4: Add Navigation Link**
In `frontend/src/components/layout/Sidebar.tsx`:
```typescript
// Add Brain icon to imports
import { ..., Brain } from 'lucide-react'

// Add to navigation array
const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leave Requests', href: '/leave/requests', icon: FileText },
  { name: 'Team Calendar', href: '/calendar', icon: Calendar },
  { name: 'Workforce AI', href: '/workforce-ai', icon: Brain }, // NEW
]
```

---

## 🎯 Features Overview

### **1. Workforce Simulation Engine**
- Test different leave scenarios
- Predict impact on team coverage and productivity
- Get AI-powered recommendations
- Summary dashboard showing trends

### **2. Skill-Based Coverage Mapping**
- Real-time tracking of 6 skill categories
- Visual coverage bars with percentage
- Team member availability per skill
- Critical alerts for low coverage
- AI hiring recommendations

### **3. Burnout Risk Index**
- Monitor 6 team members' burnout risk
- Track 4 key risk factors
- Sort/filter by risk level
- Trend analysis (improving/stable/declining)
- Personalized AI recommendations
- Wellness action plan

### **4. Adaptive Leave Assistant**
- AI-powered optimal leave window suggestions
- Ranked suggestions with scores (0-100%)
- Team impact analysis
- Alternative date options
- One-click leave request creation

---

## 📋 Dependencies Required

All dependencies are already in your project's `package.json`:
- `react` (18.2.0)
- `react-dom` (18.2.0)
- `react-router-dom` (6.21.3)
- `lucide-react` (0.309.0)
- `react-toastify` (10.0.4)
- `tailwindcss` (3.4.1)

---

## 🎨 Design System

All components use the professional color scheme:
- **Primary**: Blue (`from-blue-600 to-blue-700`)
- **Success**: Emerald (`from-emerald-600 to-emerald-700`)
- **Warning**: Amber (`from-amber-600 to-amber-700`)
- **Neutral**: Slate (`from-slate-600 to-slate-700`)
- **Danger**: Rose/Red for critical alerts

---

## 🔧 Usage

### **Access via Navigation:**
1. Click "Workforce AI" in the sidebar
2. Access at: `http://localhost:3002/workforce-ai`

### **Access via Dashboard:**
1. Go to Dashboard → "Workforce AI" tab
2. Click "Explore Full Workforce AI" card

---

## 📊 Demo Data

All components include realistic demo data:
- **Teams**: Development, Operations, Design teams
- **Skills**: Frontend (85%), Backend (60%), UI/UX (75%), DevOps (50%), Security (66%), QA (100%)
- **Risk Scores**: Range from 25% (Low) to 85% (Critical)
- **Scenarios**: Holiday Season, Summer, Project Crunch

---

## 🤝 Support

For issues or questions:
- Check component comments for implementation details
- All components are fully typed with TypeScript
- Interactive features use toast notifications for user feedback

---

**Created**: February 20, 2026  
**Version**: 1.0.0  
**Project**: Leave-Optix - AI-Powered Leave Management System
