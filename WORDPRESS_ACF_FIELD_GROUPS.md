# WordPress ACF Field Groups Setup Guide

## Overview

This guide provides the recommended setup for WordPress ACF (Advanced Custom Fields) field groups using a **relational architecture** instead of nested repeaters. This approach provides better performance, flexibility, and content reusability.

## Architecture Diagram

```
Course (Custom Post Type)
├── Title (WordPress built-in)
├── Description (WordPress built-in)
├── ACF Fields:
│   ├── difficulty (Select)
│   ├── duration (Text)
│   ├── instructor (Text)
│   ├── thumbnail (Image)
│   └── modules (Relationship) → Links to Module posts
│
Module (Custom Post Type)
├── Title (WordPress built-in)
├── Description (WordPress built-in)
├── ACF Fields:
│   ├── course (Relationship) → Links to parent Course
│   ├── order_number (Number)
│   └── lessons (Relationship) → Links to Lesson posts
│
Lesson (Custom Post Type)
├── Title (WordPress built-in)
├── Content (WordPress Editor / Text)
├── ACF Fields:
│   ├── module (Relationship) → Links to parent Module
│   ├── duration (Text) → e.g., "15 min"
│   ├── order_number (Number)
│   ├── video_url (URL)
│   ├── transcript (Textarea)
│   └── resources (Repeater) → Files/links
```

## Step-by-Step Setup

### 1. Create Custom Post Types

In your theme's `functions.php` or via plugin (e.g., Custom Post Type UI):

```php
// Register Course Post Type
register_post_type('course', [
    'labels' => ['name' => 'Courses', 'singular_name' => 'Course'],
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'excerpt'],
    'menu_icon' => 'dashicons-book-alt',
]);

// Register Module Post Type
register_post_type('module', [
    'labels' => ['name' => 'Modules', 'singular_name' => 'Module'],
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor', 'excerpt'],
    'menu_icon' => 'dashicons-layout',
]);

// Register Lesson Post Type
register_post_type('lesson', [
    'labels' => ['name' => 'Lessons', 'singular_name' => 'Lesson'],
    'public' => true,
    'show_in_rest' => true,
    'supports' => ['title', 'editor'],
    'menu_icon' => 'dashicons-media-document',
]);
```

### 2. Course Field Group

**Field Group Name:** `Course Fields`  
**Post Types:** Course

| Field Name | Field Type | Key | Notes |
|---|---|---|---|
| Difficulty | Select | `difficulty` | Options: Beginner, Intermediate, Advanced |
| Duration | Text | `duration` | e.g., "6-8 weeks" |
| Instructor | Text | `instructor` | e.g., "Shannon Marie" |
| Thumbnail | Image | `thumbnail` | Course preview image |
| Description | Textarea | `description` | Course overview (if not using editor) |
| Modules | Relationship | `modules` | Links to Module posts (bidirectional) |

**Display Settings:**
- Show featured image: Yes
- REST API: Enabled

### 3. Module Field Group

**Field Group Name:** `Module Fields`  
**Post Types:** Module

| Field Name | Field Type | Key | Notes |
|---|---|---|---|
| Course | Relationship | `course` | Links to parent Course (reverse of Course→Modules) |
| Order Number | Number | `order_number` | Sequence position in course (1, 2, 3...) |
| Lessons | Relationship | `lessons` | Links to Lesson posts (bidirectional) |

**Display Settings:**
- REST API: Enabled

### 4. Lesson Field Group

**Field Group Name:** `Lesson Fields`  
**Post Types:** Lesson

| Field Name | Field Type | Key | Notes |
|---|---|---|---|
| Module | Relationship | `module` | Links to parent Module (reverse of Module→Lessons) |
| Order Number | Number | `order_number` | Sequence position in module (1, 2, 3...) |
| Duration | Text | `duration` | e.g., "15 min" |
| Video URL | URL | `video_url` | YouTube or Vimeo URL |
| Transcript | Textarea | `transcript` | Text transcript of video |
| Resources | Repeater | `resources` | Additional materials |
| ├─ Resource Title | Text | `resource_title` | e.g., "PDF Guide" |
| └─ Resource URL | URL | `resource_url` | Download or external link |

**Display Settings:**
- REST API: Enabled

## REST API Response Examples

### Fetching a Course with All Relationships

```
GET /wp-json/wp/v2/course?slug=medical-billing-foundations&_embed
```

**Response:**
```json
[
  {
    "id": 1,
    "title": { "rendered": "Medical Billing Foundations" },
    "content": { "rendered": "..." },
    "acf": {
      "difficulty": "beginner",
      "duration": "6-8 weeks",
      "instructor": "Shannon Marie",
      "thumbnail": "...",
      "description": "Master the complete billing cycle...",
      "modules": [2, 3, 4]  // IDs of related Module posts
    }
  }
]
```

### Fetching a Module with Lessons

```
GET /wp-json/wp/v2/module/2?_embed
```

**Response:**
```json
{
  "id": 2,
  "title": { "rendered": "Module 1: Introduction to Medical Billing" },
  "content": { "rendered": "..." },
  "acf": {
    "course": [1],  // Parent course ID
    "order_number": 1,
    "lessons": [5, 6, 7, 8, 9]  // IDs of related Lesson posts
  }
}
```

### Fetching a Lesson

```
GET /wp-json/wp/v2/lesson/5
```

**Response:**
```json
{
  "id": 5,
  "title": { "rendered": "Welcome to Medical Billing" },
  "content": { "rendered": "..." },
  "acf": {
    "module": [2],  // Parent module ID
    "order_number": 1,
    "duration": "12 min",
    "video_url": "https://www.youtube.com/watch?v=p4eYjBVZIc8",
    "transcript": "Welcome to Medical Billing Foundations!...",
    "resources": [
      {
        "resource_title": "Getting Started PDF",
        "resource_url": "https://example.com/pdf"
      }
    ]
  }
}
```

## Migration from Nested Repeaters

If you currently use nested repeaters:

### Old Structure (Nested Repeaters)
```json
{
  "acf": {
    "modules": [
      {
        "title": "Module 1",
        "lessons": [
          {"title": "Lesson 1", "video_url": "..."},
          {"title": "Lesson 2", "video_url": "..."}
        ]
      }
    ]
  }
}
```

### New Structure (Relationships)
```
Course post 1
  ├─ Module post 2
  │  ├─ Lesson post 5
  │  ├─ Lesson post 6
  │  └─ Lesson post 7
  └─ Module post 3
     ├─ Lesson post 8
     └─ Lesson post 9
```

**Migration Steps:**

1. **Export existing course data** (JSON/CSV) from repeaters
2. **Create Module posts** from module data in repeaters
3. **Create Lesson posts** from lesson data in repeaters
4. **Link relationships** in WordPress admin
5. **Update frontend code** (see WORDPRESS_API_INTEGRATION.md updates)
6. **Archive/delete old course repeater data** (backup first!)

## Advanced Features

### Bidirectional Relationships

WordPress REST API doesn't automatically handle bidirectional relationships. You may need:

**Option 1: Manual Setup in ACF**
- Create `modules` field on Course
- Create `course` field on Module
- Link both manually (or use ACF Relationship settings)

**Option 2: WordPress Code (functions.php)**
```php
// Auto-link when creating relationships
add_action('acf/save_post', function($post_id) {
    if (get_post_type($post_id) === 'module') {
        $course_ids = get_field('course', $post_id);
        if ($course_ids) {
            foreach ($course_ids as $course_id) {
                $modules = get_field('modules', $course_id);
                if (!in_array($post_id, $modules)) {
                    $modules[] = $post_id;
                    update_field('modules', $modules, $course_id);
                }
            }
        }
    }
});
```

### Ordering with order_number Field

Keep modules and lessons in correct sequence:

**WordPress Admin Tip:**
- When displaying Relationship fields, set "Instructions" to "Order by order_number (ascending)"
- Or use ACF Flexible Content instead for built-in ordering

**Frontend Query (REST API):**
```
GET /wp-json/wp/v2/module?parent=2&orderby=acf.order_number&order=asc
```

## Benefits Summary

✅ **Flexibility**: Reuse lessons across modules  
✅ **Performance**: Load only what you need (lazy loading)  
✅ **Maintainability**: Edit content in dedicated post UI  
✅ **Scalability**: Handle large courses easily  
✅ **Caching**: Better caching strategies per post type  
✅ **SEO**: Each post gets its own URL/metadata  
✅ **REST API**: Cleaner, more discoverable endpoints  

## Next Steps

1. Create the post types in your WordPress installation
2. Create the ACF field groups following the specifications above
3. Create sample Course, Module, and Lesson posts
4. Test the REST API endpoints to verify the structure
5. Update your frontend code (see WORDPRESS_API_INTEGRATION.md)
