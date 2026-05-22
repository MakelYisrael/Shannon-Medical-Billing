# WordPress REST API Integration

This guide explains how the WordPress REST API has been integrated into your medical billing course platform.

## Overview

The application now dynamically fetches course data from your WordPress headless site REST API instead of using hardcoded course data.

## Configuration

**API Endpoint**: `http://headless.local/wp-json/wp/v2/course`

This can be modified in the following files:
- `src/pages/CoursesPage.tsx` (line 8)
- `src/pages/CourseHub.tsx` (line 19)

## Field Mapping

The WordPress REST API now supports **two architecture approaches**:

### NEW (Recommended): Relational Structure

| WordPress Post Type | Application Field | ACF Fields |
|---|---|---|
| **Course** | Course | `difficulty`, `duration`, `instructor`, `thumbnail`, `description`, `modules` (relationship) |
| **Module** | Module | `course` (relationship), `order_number`, `lessons` (relationship) |
| **Lesson** | Lesson | `module` (relationship), `order_number`, `duration`, `video_url`, `transcript`, `resources` |

**Benefits**:
- Reusable lessons across modules
- Better performance (lazy loading)
- Cleaner content management
- Proper REST API structure

**Setup Guide**: See [WORDPRESS_ACF_FIELD_GROUPS.md](./WORDPRESS_ACF_FIELD_GROUPS.md)

### LEGACY: Nested Repeater Structure (Still Supported)

| WordPress Field | Application Field | Usage |
|---|---|---|
| `title.rendered` | `title` | Course title displayed in headers and cards |
| `acf.description` | `description` | Course description shown in listings and hub page |
| `acf.thumbnail` | `thumbnail` | Course preview image (optional) |
| `acf.difficulty` | `level` | Course difficulty level (beginner/intermediate/advanced) |
| `acf.duration` | `duration` | Estimated course duration (e.g., "6-8 weeks") |
| `acf.lessons` | `modules[].lessons` | Lessons within the course (array of lesson objects) |

**Note**: The application automatically detects which structure is used and transforms data accordingly.

## Implementation Details

### Service Layer (`src/services/courseService.ts`)

The course service provides smart transformation that detects and handles both relational and legacy structures.

#### Main Functions

**`fetchCoursesFromWordPress(apiUrl: string)`**
- Fetches all courses from the WordPress API
- Detects whether courses use relational or legacy structure
- For relational structure: Fetches related modules and lessons via additional API calls
- Transforms WordPress data to application format
- Returns array of `CourseData` objects

**`fetchCourseById(apiBaseUrl: string, courseId: string | number)`**
- Fetches a single course by ID/slug
- Automatically handles both architectures
- Returns a single `CourseData` object or null

#### Helper Functions

**`fetchWordPressModule(apiBaseUrl: string, moduleId: number)`**
- Internal: Fetches a single module post
- Used when processing relational structure

**`fetchWordPressLesson(apiBaseUrl: string, lessonId: number)`**
- Internal: Fetches a single lesson post
- Used when processing relational structure

#### Auto-Detection Logic

The `transformWordPressCourse` function automatically detects which structure is being used:

```typescript
// Check if course has relational modules field (new structure)
if (wpCourse.acf?.modules && Array.isArray(wpCourse.acf.modules) && wpCourse.acf.modules.length > 0) {
  // Use relational structure - fetch modules and lessons
} else {
  // Fall back to legacy nested repeater structure
}
```

This means **you can use either architecture without changing frontend code**.

### Custom Hook (`src/hooks/useCourses.ts`)

The `useCourses` hook handles:
- Loading state management
- Error handling and recovery
- Automatic data fetching on mount

**Usage:**
```typescript
const { courses, loading, error } = useCourses(WORDPRESS_API_URL);
```

### Pages Using Dynamic Data

1. **CoursesPage** (`src/pages/CoursesPage.tsx`)
   - Fetches all courses
   - Groups courses by difficulty level
   - Displays loading/error states
   - Shows course count dynamically

2. **CourseHub** (`src/pages/CourseHub.tsx`)
   - Fetches single course by ID from URL parameter
   - Displays course modules and lessons
   - Tracks student progress
   - Shows loading/error states

## Color Themes by Difficulty Level

Courses are automatically styled based on their difficulty level:

- **Beginner**: Blue theme (`from-blue-50 to-indigo-50`, `bg-blue-600`)
- **Intermediate**: Purple theme (`from-purple-50 to-violet-50`, `bg-purple-600`)
- **Advanced**: Amber/Orange theme (`from-amber-50 to-orange-50`, `bg-amber-600`)

## Error Handling

Both pages display user-friendly error messages if:
- The WordPress API is unreachable
- A course doesn't exist
- Network errors occur

Users can retry loading by clicking the "Retry" button.

## Lesson Structure

The service transforms the `acf.lessons` field into a lesson array with:
- `id`: Unique lesson identifier
- `title`: Lesson name
- `duration`: Estimated time to complete
- `completed`: Completion status (defaults to false)

If `acf.lessons` is empty, a default "Getting Started" lesson is created.

## Testing the Integration

1. Verify your WordPress REST API is accessible at the configured URL
2. Navigate to `/courses` to see the courses listing
3. Click on a course card to view course details at `/course/{id}/hub`
4. Check browser console for any API errors

## Next Steps

To fully implement course delivery, you may want to:

1. **Add Video Hosting**: Integrate video players for lesson content
2. **Add Database Storage**: Store course enrollment and progress data
3. **Add Payment Processing**: Integrate Stripe or PayPal for course sales
4. **Add User Dashboard**: Create a personalized portal for enrolled students
5. **Add Certificates**: Generate completion certificates for students

## Migration from Nested Repeaters to Relational

If you currently use nested repeaters and want to migrate to the relational architecture:

### Why Migrate?

- **Better Performance**: Don't load all lessons when listing courses
- **Content Reusability**: Use same lesson in multiple modules
- **Easier Editing**: Manage lessons independently
- **REST API Best Practices**: Proper resource separation

### Migration Steps

1. **Backup Your Data**
   - Export your WordPress database
   - Export ACF field data

2. **Create New Post Types**
   - Add Module and Lesson post types (see WORDPRESS_ACF_FIELD_GROUPS.md)
   - Ensure REST API is enabled for all types

3. **Migrate Data**
   - For each Course:
     - Create Module posts from your repeater modules
     - Create Lesson posts from your repeater lessons
     - Set up Module-Lesson relationships
     - Set up Course-Module relationships

4. **Verify REST API**
   - Test that new posts appear in REST API
   - Verify ACF fields are exposed
   - Test relationships

5. **Update WordPress Configuration**
   - Add `modules` relationship field to Course
   - Remove old `lessons` repeater field (optional, can coexist)

6. **Test Frontend**
   - Follow [RELATIONAL_STRUCTURE_TESTING.md](./RELATIONAL_STRUCTURE_TESTING.md)
   - Verify courses load correctly
   - Check console logs for "Using relational structure"

7. **Switch Over**
   - Once relational structure works, can optionally remove legacy repeater fields

**Note**: The frontend will automatically detect and use relational structure if available, so there's no risk of breaking changes.

## Troubleshooting

### Courses Not Loading

**Issue**: "Unable to Load Courses" error message

**Solutions**:
1. Verify WordPress REST API is running at `http://headless.local/wp-json/wp/v2/course`
2. Check CORS settings on your WordPress server
3. Verify ACF (Advanced Custom Fields) is enabled
4. Check browser console for specific error messages

### Course Fields Missing

**Issue**: Some course information not displaying

**Solutions**:
1. Ensure ACF fields are properly configured in WordPress:
   - `description` (Text)
   - `thumbnail` (Image)
   - `difficulty` (Select: beginner/intermediate/advanced)
   - `duration` (Text)
   - `lessons` (Repeater)
2. Publish course posts with all required fields filled
3. Verify custom post type `course` is registered

### CORS Errors

**Issue**: API requests blocked due to CORS

**Solutions**:
1. Enable CORS in WordPress (via plugin or code)
2. Update API URL if using different domain
3. Check WordPress security headers
