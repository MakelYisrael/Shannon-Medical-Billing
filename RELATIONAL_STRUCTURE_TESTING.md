# Testing & Verification Guide

## Overview

This guide walks you through testing the new relational course structure to ensure your WordPress setup and frontend integration are working correctly.

## Prerequisites

Before testing, ensure you have:

1. ✅ Created ACF field groups (see WORDPRESS_ACF_FIELD_GROUPS.md)
2. ✅ Created sample Course, Module, and Lesson posts
3. ✅ Updated courseService.ts to the relational version
4. ✅ WordPress REST API is accessible

## Phase 1: WordPress REST API Testing

### Test 1.1: Verify API Endpoints Are Accessible

Open your browser console and test each endpoint:

```javascript
// Test Course endpoint
fetch('http://headless.local/wp-json/wp/v2/course')
  .then(r => r.json())
  .then(d => console.log('Courses:', d))

// Test Module endpoint
fetch('http://headless.local/wp-json/wp/v2/module')
  .then(r => r.json())
  .then(d => console.log('Modules:', d))

// Test Lesson endpoint
fetch('http://headless.local/wp-json/wp/v2/lesson')
  .then(r => r.json())
  .then(d => console.log('Lessons:', d))
```

**Expected Result**: Each returns a JSON array of posts

### Test 1.2: Verify ACF Fields Are Exposed

Test fetching a course with ACF data:

```javascript
fetch('http://headless.local/wp-json/wp/v2/course?_fields=id,title,acf')
  .then(r => r.json())
  .then(d => {
    console.log(d[0]); // Should show ACF fields
    // Should see: acf.difficulty, acf.duration, acf.modules (array of IDs)
  })
```

**Expected Result**: The response includes `acf` object with your custom fields

### Test 1.3: Verify Module-Lesson Relationships

```javascript
// Get a module with its lesson IDs
fetch('http://headless.local/wp-json/wp/v2/module/2')
  .then(r => r.json())
  .then(module => {
    console.log('Module lessons IDs:', module.acf.lessons);
    // Then fetch individual lessons
    return Promise.all(
      module.acf.lessons.map(id => 
        fetch(`http://headless.local/wp-json/wp/v2/lesson/${id}`)
          .then(r => r.json())
      )
    );
  })
  .then(lessons => console.log('Lessons:', lessons))
```

**Expected Result**: Module has an array of lesson IDs; each lesson can be fetched individually

## Phase 2: Frontend Integration Testing

### Test 2.1: Check Browser Console Logs

Navigate to `/courses` in your app and check the browser console (F12) for logs like:

```
[fetchCoursesFromWordPress] Attempting to fetch from: http://headless.local/wp-json/wp/v2/course
[fetchCoursesFromWordPress] Raw response: [...]
[transformWordPressCourse] Using relational structure for course: Medical Billing Foundations
[transformWordPressCourse] Transformed to 1 courses
```

If you see relational logs, it's working! If you see "Using legacy nested structure", WordPress is returning the old format.

### Test 2.2: Verify Course Data Structure

Open browser DevTools (F12) → Network tab → Reload → find the course API call → Preview the response structure.

**For Relational Structure**, expect:
```json
{
  "id": 1,
  "title": {"rendered": "Medical Billing Foundations"},
  "acf": {
    "modules": [2, 3, 4],  // Array of module IDs
    "difficulty": "beginner",
    "duration": "6-8 weeks"
  }
}
```

**For Legacy Structure**, expect:
```json
{
  "id": 1,
  "title": {"rendered": "Medical Billing Foundations"},
  "acf": {
    "lessons": [
      {"title": "Lesson 1", ...},
      {"title": "Lesson 2", ...}
    ]
  }
}
```

### Test 2.3: Test Courses Page Loading

1. Navigate to `/courses`
2. Verify courses load and display correctly
3. Check for errors in console

**Expected Behavior**:
- Courses appear with correct titles, levels, durations
- Course cards are clickable
- No red error messages

### Test 2.4: Test Course Details Page (CourseHub)

1. Click on any course to open its details page
2. Verify all modules and lessons display
3. Check course progress bar
4. Verify video player loads correctly

**Expected Behavior**:
- Course title and metadata display
- All modules list correctly
- All lessons under each module appear
- Progress tracking works
- Video plays without errors

### Test 2.5: Test Lesson Navigation

1. Open a course
2. Click "Continue Watching" on the first lesson
3. Verify the lesson video and transcript load
4. Verify lesson progress is tracked

**Expected Behavior**:
- Lesson content displays correctly
- Video plays
- Transcript appears (if provided)
- Clicking lessons updates progress

## Phase 3: Debugging

### Issue: Courses not loading

**Check**:
```javascript
// In browser console
fetch('http://headless.local/wp-json/wp/v2/course')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(d => console.log('Response:', d))
  .catch(e => console.error('Error:', e))
```

**Common Causes**:
- WordPress API not running
- URL is wrong
- CORS issues
- Custom post type not registered

### Issue: Modules/lessons not loading

**Check**:
```javascript
// Get first course's modules
fetch('http://headless.local/wp-json/wp/v2/course')
  .then(r => r.json())
  .then(courses => {
    console.log('Course modules:', courses[0].acf.modules);
    // Try fetching first module
    return fetch(`http://headless.local/wp-json/wp/v2/module/${courses[0].acf.modules[0]}`);
  })
  .then(r => r.json())
  .then(m => console.log('Module:', m))
```

**Common Causes**:
- Module post type not registered
- Module posts not published
- ACF field not properly configured
- Module IDs don't exist

### Issue: Lessons showing as empty

**Check**:
```javascript
// Verify a lesson exists
fetch('http://headless.local/wp-json/wp/v2/lesson/5')
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(l => console.log('Lesson:', l))
```

**Common Causes**:
- Lesson post type not registered
- Lesson posts not published
- Lesson IDs in modules don't match actual lesson IDs

## Phase 4: Performance Testing

### Monitor Network Requests

1. Open DevTools → Network tab
2. Load `/courses` page
3. Count the number of API calls

**For Relational Structure**:
- Should make 1 API call for courses list
- Plus additional calls when viewing course details
- Each module/lesson fetched on demand (lazy loading)

**For Legacy Structure**:
- Makes 1 API call for courses
- All lesson data included in that call

### Monitor Console Performance

Check console for timing logs:

```javascript
// Add to courseService.ts if needed
console.time('Fetch Courses');
// ... fetch code
console.timeEnd('Fetch Courses');
```

**Expected Behavior**: Course loading takes < 2 seconds

## Rollback Instructions

If you encounter issues and need to revert to the legacy structure:

1. Revert `courseService.ts` to use only the legacy `transformWordPressCourse` logic
2. No need to change WordPress ACF structure
3. The code includes fallback courses, so the app will still work

## Success Criteria

✅ **All tests pass when**:

- [ ] Courses load on `/courses` page
- [ ] Course details display with all modules
- [ ] All lessons appear under their modules
- [ ] Lesson video/transcript load correctly
- [ ] Progress tracking works
- [ ] No console errors (except unrelated warnings)
- [ ] Page loads in < 3 seconds
- [ ] Can click between lessons without issues
- [ ] Responsive design works on mobile

## Next Steps

Once testing is complete:

1. Create your full course content in WordPress
2. Populate all Courses, Modules, and Lessons
3. Set relationships correctly
4. Test with real content
5. Deploy to production

## Additional Resources

- [WORDPRESS_ACF_FIELD_GROUPS.md](./WORDPRESS_ACF_FIELD_GROUPS.md) - Field setup
- [WORDPRESS_API_INTEGRATION.md](./WORDPRESS_API_INTEGRATION.md) - API integration details
- https://www.builder.io/c/docs/projects - Platform documentation
