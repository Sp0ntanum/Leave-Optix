# Manager Module - Testing Checklist

## Pre-requisites
- [ ] Backend is running on http://localhost:8000
- [ ] Frontend is running on http://localhost:3000
- [ ] User with manager/admin role exists in database

## 1. Authentication Tests
- [ ] Login with manager credentials
- [ ] JWT token is stored in localStorage
- [ ] Token is added to API requests (check Network tab)
- [ ] Logout clears token and redirects to login

## 2. Manager Dashboard Tests
- [ ] Navigate to `/manager/dashboard`
- [ ] Page loads without errors
- [ ] Loader shows while fetching data
- [ ] Pending approvals count displays
- [ ] Risk indicator badge shows with correct color
- [ ] Active projects list displays
- [ ] Team workload bar chart renders
- [ ] Chart shows data or fallback mock data
- [ ] Responsive: Check on mobile view (DevTools)

## 3. Approvals Page Tests
- [ ] Navigate to `/manager/approvals`
- [ ] Page loads without errors
- [ ] Loader shows while fetching
- [ ] Table displays pending approvals
- [ ] All columns show correct data
- [ ] Status badges have correct colors
- [ ] Click "Approve" button
- [ ] Confirmation modal appears
- [ ] Modal shows correct message
- [ ] Click "Confirm" in modal
- [ ] Button disables during request
- [ ] Success toast appears
- [ ] Table refreshes with updated data
- [ ] Click "Reject" button
- [ ] Same flow works for rejection
- [ ] Error toast shows if API fails

## 4. Workload Visualization Tests
- [ ] Navigate to `/manager/workload`
- [ ] Page loads without errors
- [ ] Loader shows while fetching
- [ ] Task distribution bar chart renders
- [ ] Description text shows below chart
- [ ] Team capacity pie chart renders
- [ ] Pie chart shows percentages
- [ ] Legend displays correctly
- [ ] Leave trends line chart renders
- [ ] All charts are responsive
- [ ] Charts show data or fallback mock data

## 5. UI Component Tests
- [ ] Modal: Opens and closes correctly
- [ ] Modal: Backdrop click closes modal
- [ ] Modal: Confirm button works
- [ ] Modal: Cancel button works
- [ ] StatusBadge: Green for Approved/Low
- [ ] StatusBadge: Yellow for Pending/Medium
- [ ] StatusBadge: Red for Rejected/High
- [ ] Loader: Spinner animates smoothly

## 6. API Integration Tests
- [ ] Check Network tab for API calls
- [ ] Verify Authorization header has Bearer token
- [ ] Check response data structure
- [ ] Verify error handling (disconnect backend)
- [ ] Toast shows error message
- [ ] 401 response redirects to login

## 7. Responsive Design Tests
- [ ] Desktop (1920x1080): 3-column grid
- [ ] Tablet (768px): 2-column grid
- [ ] Mobile (375px): Single column
- [ ] Charts resize properly
- [ ] Table scrolls horizontally on mobile
- [ ] Buttons are touch-friendly
- [ ] No horizontal scroll on any screen

## 8. Navigation Tests
- [ ] Sidebar shows manager routes
- [ ] Manager routes only visible to manager/admin
- [ ] Active route is highlighted
- [ ] All links navigate correctly
- [ ] Browser back/forward works

## 9. Error Handling Tests
- [ ] Stop backend server
- [ ] Try to fetch dashboard
- [ ] Error toast appears
- [ ] Page doesn't crash
- [ ] Restart backend
- [ ] Retry works correctly

## 10. Performance Tests
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] No console warnings
- [ ] Charts render smoothly
- [ ] No layout shift during load
- [ ] Transitions are smooth

## Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## Code Quality Checks
- [ ] No TypeScript errors: `npm run build`
- [ ] No linting errors: `npm run lint`
- [ ] All imports resolve correctly
- [ ] No unused variables
- [ ] Proper error handling in all async functions

## Demo Preparation
- [ ] Create test data in backend
- [ ] At least 3-5 pending approvals
- [ ] Multiple team members with tasks
- [ ] Active projects with different risk levels
- [ ] Practice demo flow
- [ ] Prepare answers for viva questions

## Common Issues & Solutions

### Issue: "Cannot find module '@/lib/api'"
**Solution:** Check tsconfig.json has path alias configured

### Issue: Charts not rendering
**Solution:** Verify recharts is installed: `npm install recharts`

### Issue: 401 Unauthorized
**Solution:** Check token in localStorage, re-login if needed

### Issue: CORS errors
**Solution:** Backend must allow frontend origin in CORS settings

### Issue: Modal not showing
**Solution:** Check z-index, ensure isOpen prop is true

### Issue: Toast not appearing
**Solution:** Verify ToastContainer is in App.tsx

## Success Criteria
✅ All pages load without errors
✅ All API calls work correctly
✅ All charts render with data
✅ Approve/reject actions work
✅ Responsive on all screen sizes
✅ No console errors or warnings
✅ Clean, professional UI
✅ Fast and smooth user experience
