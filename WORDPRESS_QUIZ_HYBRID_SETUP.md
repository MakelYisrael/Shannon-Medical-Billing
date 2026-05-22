# WordPress Quiz Post Type Setup - Hybrid Approach

This guide sets up a **Quiz custom post type** in WordPress that stores quiz definitions (questions, answers, explanations), while user scores are tracked in Firebase Firestore.

## Architecture Overview

```
WordPress (Quiz Content)
├── Quiz Post Type
│   ├── Title (Quiz Name)
│   ├── Description
│   └── ACF Fields:
│       ├── Associated Lesson (Relationship)
│       ├── Pass Percentage (Number)
│       ├── Questions (Repeater)
│       │   ├── Question Text
│       │   ├── Question Type (multiple_choice, true_false, essay)
│       │   ├── Options (Repeater) [for multiple_choice]
│       │   ├── Correct Answer (Text) [for all types]
│       │   ├── Explanation
│       │   └── Order Number

Firebase Firestore (User Scores)
└── /users/{userId}/quizAttempts
    ├── quizId (reference to WordPress Quiz post ID)
    ├── lessonId
    ├── score (number 0-100)
    ├── answers (JSON: { questionId: userAnswer })
    ├── passed (boolean)
    ├── timestamp
    └── details (explanation of results)
```

---

## Step 1: Create the Quiz Custom Post Type

### Option A: Using Custom Post Type UI Plugin (Easiest)

1. Install **"Custom Post Type UI"** plugin from WordPress plugin directory
2. Go to **CPT UI** → **Add/Edit Post Types**
3. Click **Add New**
4. Fill in:

| Field | Value |
|-------|-------|
| Post Type Name | quiz |
| Singular Label | Quiz |
| Plural Label | Quizzes |
| Has Archive | ✓ Checked |
| Public | ✓ Checked |
| Show in REST API | ✓ Checked |
| Rest API Base Slug | quiz |

5. Under **Supports**, check: ✓ Title, ✓ Editor, ✓ Excerpt
6. Click **Add Post Type**

### Option B: Manual Code (functions.php)

Add to your theme's `functions.php`:

```php
add_action('init', function() {
    register_post_type('quiz', [
        'labels' => [
            'name' => 'Quizzes',
            'singular_name' => 'Quiz',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'quiz',
        'supports' => ['title', 'editor', 'excerpt'],
        'menu_icon' => 'dashicons-search',
    ]);
});
```

---

## Step 2: Create Quiz ACF Field Group

1. Go to **ACF** → **Field Groups** → **Add New**
2. Name: `Quiz Fields`
3. Under **Location**, set: **Post Type is equal to Quiz**
4. Add the following fields (in order):

---

### Field 1: Associated Lesson

1. Click **+ Add Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Associated Lesson |
| **Field Name** | associated_lesson |
| **Field Type** | Relationship |
| **Post Type Filter** | lesson |
| **Required** | Yes (✓) |

3. Click **Add Field**

---

### Field 2: Pass Percentage

1. Click **+ Add Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Pass Percentage |
| **Field Name** | pass_percentage |
| **Field Type** | Number |
| **Default Value** | 70 |
| **Min** | 0 |
| **Max** | 100 |

3. Click **Add Field**

---

### Field 3: Question Bank (Repeater)

1. Click **+ Add Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Questions |
| **Field Name** | questions |
| **Field Type** | Repeater |
| **Min rows** | 1 |
| **Max rows** | (leave blank) |
| **Button Label** | Add Question |

3. Click **Add Field**

---

### Field 3A: Question Text (inside Repeater)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Question Text |
| **Field Name** | question_text |
| **Field Type** | Text Area |
| **Required** | Yes (✓) |

3. Click **Add Field**

---

### Field 3B: Question Type (inside Repeater)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Question Type |
| **Field Name** | question_type |
| **Field Type** | Select |
| **Required** | Yes (✓) |

3. Under **Choices**:
```
multiple_choice : Multiple Choice (A, B, C, D)
true_false : True / False
essay : Essay / Short Answer
```

4. **Default Value**: `multiple_choice`
5. Click **Add Field**

---

### Field 3C: Options (Repeater, inside Questions)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Options |
| **Field Name** | options |
| **Field Type** | Repeater |
| **Min rows** | 0 |
| **Max rows** | 6 |

3. Under **Conditional Logic**:
   - Show this field if **Question Type** is equal to **multiple_choice**

4. Click **Add Field**

---

### Field 3C-i: Option Text (inside Options)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Option Text |
| **Field Name** | option_text |
| **Field Type** | Text |
| **Required** | Yes (✓) |

3. Click **Add Field**

---

### Field 3C-ii: Option Key (inside Options)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Option Key |
| **Field Name** | option_key |
| **Field Type** | Text |
| **Instructions** | Single letter (A, B, C, D, etc.) or unique identifier |
| **Required** | Yes (✓) |

3. Click **Add Field**

---

### Field 3D: Correct Answer (inside Questions)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Correct Answer |
| **Field Name** | correct_answer |
| **Field Type** | Text |
| **Instructions** | For multiple choice: letter (A, B, C). For true/false: "true" or "false". For essay: leave empty (auto-pass). |
| **Required** | Yes (✓) |

3. Click **Add Field**

---

### Field 3E: Explanation (inside Questions)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Explanation |
| **Field Name** | explanation |
| **Field Type** | Text Area |
| **Instructions** | Shown to user after they answer |

3. Click **Add Field**

---

### Field 3F: Question Order (inside Questions)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Order |
| **Field Name** | question_order |
| **Field Type** | Number |
| **Default Value** | 1 |

3. Click **Add Field**

---

## Step 3: Enable REST API

Scroll to the bottom of the field group and check:

- ✓ **Show in REST API**

Then click **Publish**.

---

## Step 4: Create Sample Quiz in WordPress

1. Go to **Posts** → **Quizzes**
2. Click **Add New Quiz**
3. Fill in:
   - **Title**: "Welcome to Medical Billing - Quiz"
   - **Associated Lesson**: (select a lesson post)
   - **Pass Percentage**: 70
   - Click **Add Question** and add sample questions:

### Sample Question 1 (Multiple Choice)

```
Question Text: "What is the first step in the medical billing cycle?"
Question Type: Multiple Choice
Options:
  - A: Charge Capture ✓ (correct)
  - B: Claims Submission
  - C: Payment Posting
  - D: Denial Management
Correct Answer: A
Explanation: "Charge capture is where the billing process begins..."
```

### Sample Question 2 (True/False)

```
Question Text: "ICD-10 codes are used for procedures."
Question Type: True/False
Correct Answer: false
Explanation: "ICD-10 codes are for diagnoses; CPT codes are for procedures."
```

4. Click **Publish**

---

## Step 5: Verify REST API Response

Test the API endpoint:

```
GET http://headless.local/wp-json/wp/v2/quiz/{quiz_id}
```

You should see:

```json
{
  "id": 10,
  "title": { "rendered": "Welcome to Medical Billing - Quiz" },
  "acf": {
    "associated_lesson": [5],
    "pass_percentage": 70,
    "questions": [
      {
        "question_text": "What is the first step?",
        "question_type": "multiple_choice",
        "options": [
          {
            "option_text": "Charge Capture",
            "option_key": "A"
          },
          {
            "option_text": "Claims Submission",
            "option_key": "B"
          }
        ],
        "correct_answer": "A",
        "explanation": "Charge capture is...",
        "question_order": 1
      }
    ]
  }
}
```

---

## Step 6: Link Quiz to Lesson (Reverse Relationship)

Optionally, add a Relationship field on the Lesson post type to show which quizzes belong to it:

1. Go to **ACF** → **Lesson Fields** field group
2. Add a new field:

| Setting | Value |
|---------|-------|
| **Field Label** | Associated Quizzes |
| **Field Name** | associated_quizzes |
| **Field Type** | Relationship |
| **Post Type Filter** | quiz |

3. Save and publish

Now when editing a Lesson, you can see which Quizzes are linked to it (reverse lookup).

---

## Troubleshooting

### Quizzes not showing in REST API
1. Check post is **Published** (not Draft)
2. Go to **Quiz** post type settings → ensure **Show in REST API** is checked
3. Restart your WordPress server

### Conditional logic not working
1. Ensure **Question Type** field exists **before** conditional fields
2. Refresh page after adding conditional logic
3. Check the conditional logic rule is set correctly

### Options repeater not showing for multiple choice
1. Verify **Question Type** field value is exactly `multiple_choice` (case-sensitive)
2. Check conditional logic: "Question Type" is equal to "multiple_choice"

---

## Field Structure Summary

```
Quiz (Post Type)
├── Title (WordPress built-in)
├── Content/Description
└── ACF Fields:
    ├── Associated Lesson (Relationship → Lesson post)
    ├── Pass Percentage (Number) - default 70
    └── Questions (Repeater)
        ├── Question Text (Textarea)
        ├── Question Type (Select: multiple_choice, true_false, essay)
        ├── Options (Repeater) [if: question_type = multiple_choice]
        │   ├── Option Text (Text)
        │   └── Option Key (Text: A, B, C, etc.)
        ├── Correct Answer (Text)
        ├── Explanation (Textarea)
        └── Question Order (Number)
```

---

## Next Steps

1. **Set up Firestore schema** for quiz attempts (see FIRESTORE_QUIZ_SCHEMA.md)
2. **Update courseService.ts** to fetch quizzes from WordPress
3. **Create quizService.ts** to handle submissions and Firestore storage
4. **Build Quiz React component** for the UI
5. **Integrate quizzes into CourseHub** modal

