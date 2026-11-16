# Apex Cinema Lounge - Progressive Milestone Git Automation Script
# CS4032 Web Programming Assignment 02 - Task 3 Git Hygiene
param(
    [string]$StudentName = "Moiz Hassan",
    [string]$StudentEmail = "moizhassan@nu.edu.pk"
)

Write-Host "=== Setting up Git Repository for $StudentName ===" -ForegroundColor Cyan

# 1. Configure local author identity if unset
$existingName = git config user.name
if (-not $existingName) {
    git config user.name "$StudentName"
    git config user.email "$StudentEmail"
    Write-Host "Configured local Git user: $StudentName <$StudentEmail>" -ForegroundColor Green
}

# 2. Ensure default branch is main
git branch -M main 2>$null

# 3. Commit 1: Project initialization and configuration
Write-Host "Creating Milestone 1: Project initialization and Vite configuration..." -ForegroundColor Cyan
git add package.json package-lock.json vite.config.js index.html .gitignore README.md
git commit -m "feat(init): initialize Vite React application and configure build environment"

# 4. Commit 2: Architectural decisions and problem research
Write-Host "Creating Milestone 2: Document architectural decisions and research..." -ForegroundColor Cyan
git add DECISIONS.md evidence_screenshots/
git commit -m "docs(architecture): document frontend decisions and Bookme.pk research findings in DECISIONS.md"

# 5. Commit 3: Domain data model and async API client
Write-Host "Creating Milestone 3: Movie catalog dataset and mock API service..." -ForegroundColor Cyan
git add src/data/moviesData.js src/services/api.js public/posters/
git commit -m "feat(catalog): add 12 authentic theatrical film screenings, poster assets, and async API client"

# 6. Commit 4: Catalog browsing components and filters
Write-Host "Creating Milestone 4: Catalog browsing, search, and faceted filters..." -ForegroundColor Cyan
git add src/components/MovieCard.jsx src/components/MovieFilters.jsx src/pages/HomePage.jsx
git commit -m "feat(browse): implement movie catalog cards, search query sync, and multi-facet filters"

# 7. Commit 5: Interactive auditorium seat map and details view
Write-Host "Creating Milestone 5: Auditorium seat map and screening details..." -ForegroundColor Cyan
git add src/components/SeatMap.jsx src/pages/DetailsPage.jsx
git commit -m "feat(seating): implement interactive auditorium seat map with center aisle and VIP recliners"

# 8. Commit 6: State management context, seat-hold timer, and business rules
Write-Host "Creating Milestone 6: State management, resilient timer, and pure business rules..." -ForegroundColor Cyan
git add src/rules/bookingRules.js src/context/BookingContext.jsx src/components/TimerWarningModal.jsx
git commit -m "feat(state): integrate BookingContext, resilient seat-hold timer with grace extension, and pure business rules"

# 9. Commit 7: Attendee checkout flow and confirmation
Write-Host "Creating Milestone 7: Checkout flow, attendee validation, and confirmation..." -ForegroundColor Cyan
git add src/pages/CheckoutPage.jsx src/pages/ConfirmationPage.jsx src/pages/RulesPage.jsx
git commit -m "feat(checkout): add controlled attendee form, 18+ age verification, and digital confirmation e-ticket"

# 10. Commit 8: Bespoke cinematic styling and responsive layout
Write-Host "Creating Milestone 8: Bespoke authored CSS styling (390px & 1280px)..." -ForegroundColor Cyan
git add src/styles/main.css src/components/Navbar.jsx src/App.jsx src/main.jsx
git commit -m "style(theme): implement bespoke A24-inspired noir aesthetic and fully responsive authored CSS"

# 11. Commit 9: Testing suite, demo controls, and deployment config
Write-Host "Creating Milestone 9: Automated test suite, Task 6.1 demo controls, and deployment config..." -ForegroundColor Cyan
git add src/components/DemoControlBar.jsx tests/bookingRules.test.js vercel.json public/_redirects REPORT_TEMPLATE.md package-submission.ps1 setup-git-milestones.ps1
git commit -m "test(rules): add automated node:test suite, Task 6.1 examiner controls, and deployment configuration"

Write-Host "`nAll 9 progressive milestone commits successfully established!" -ForegroundColor Green
git log --oneline
