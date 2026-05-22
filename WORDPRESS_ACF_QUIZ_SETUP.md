# WordPress ACF Quiz Field Setup Guide

This guide walks you through adding a **Quiz Questions** repeater field to your Lesson post type in WordPress using Advanced Custom Fields (ACF).

## Overview

Quizzes are added directly to Lesson posts via an ACF Repeater field. This allows you to create multiple questions per lesson with flexible answer options and explanations.

---

## Step 1: Navigate to ACF Field Groups

1. Log in to your **WordPress Admin Dashboard**
2. In the left sidebar, click **ACF** → **Field Groups**
3. Find and click on your **"Lesson Fields"** field group (or create a new one if it doesn't exist)

---

## Step 2: Add the Quiz Questions Repeater

### 2A. Add Main Repeater Field

1. Click the **"+ Add Field"** button at the bottom of the field group
2. Fill in the following details:

| Setting | Value |
|---------|-------|
| **Field Label** | Quiz Questions |
| **Field Name** | quiz_questions |
| **Field Type** | Repeater |

3. In the **Repeater Settings** section, set:
   - **Minimum rows**: 0
   - **Maximum rows**: (leave blank for unlimited)
   - **Button Label**: Add Question

4. Click **Add Field** (this creates the repeater container)

---

### 2B. Add Sub-fields to the Repeater

Once the repeater is created, you'll see "Click here to add a sub field" or a "+ Add Sub Field" button. Click it to add each of the following sub-fields:

#### Sub-field 1: Question Text

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Question |
| **Field Name** | question |
| **Field Type** | Text |
| **Required** | Yes (✓ checked) |

3. Click **Add Field**

---

#### Sub-field 2: Question Type

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Question Type |
| **Field Name** | question_type |
| **Field Type** | Select |
| **Required** | Yes (✓ checked) |

3. Under **Choices**, enter (one per line):
   ```
   multiple_choice : Multiple Choice
   true_false : True/False
   essay : Essay
   ```

4. Set **Default Value**: `multiple_choice`
5. Click **Add Field**

---

#### Sub-field 3: Options (Repeater for Multiple Choice)

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Options |
| **Field Name** | options |
| **Field Type** | Repeater |
| **Conditional Logic** | Set to show only when Question Type = multiple_choice |

3. In **Repeater Settings**:
   - **Minimum rows**: 2
   - **Maximum rows**: 10
   - **Button Label**: Add Option

4. Click **Add Field**

---

#### Sub-field 3A: Option Text (inside Options repeater)

1. Click **+ Add Sub Field** (within the Options repeater)
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Option Text |
| **Field Name** | option_text |
| **Field Type** | Text |
| **Required** | Yes (✓ checked) |

3. Click **Add Field**

---

#### Sub-field 3B: Is Correct (inside Options repeater)

1. Click **+ Add Sub Field** (within the Options repeater)
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Is Correct |
| **Field Name** | is_correct |
| **Field Type** | True/False |
| **Display**: | Checkbox |

3. Click **Add Field**

---

#### Sub-field 4: Correct Answer (for True/False)

1. Click **+ Add Sub Field** (back at quiz_questions level)
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Correct Answer |
| **Field Name** | correct_answer |
| **Field Type** | Select |
| **Conditional Logic** | Set to show only when Question Type = true_false |

3. Under **Choices**, enter:
   ```
   true : True
   false : False
   ```

4. Click **Add Field**

---

#### Sub-field 5: Explanation

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Explanation |
| **Field Name** | explanation |
| **Field Type** | Text Area |

3. Set **Instructions** to: "Feedback shown to users after they answer this question"
4. Click **Add Field**

---

#### Sub-field 6: Order Number

1. Click **+ Add Sub Field**
2. Configure:

| Setting | Value |
|---------|-------|
| **Field Label** | Order Number |
| **Field Name** | order_number |
| **Field Type** | Number |

3. Set **Default Value**: `1`
4. Click **Add Field**

---

## Step 3: Configure REST API Access

After adding all fields, scroll to the bottom of the field group:

1. Look for **"Display Settings"** or **"REST API"** section
2. Check the box: **✓ Show in REST API**
3. If available, also check: **✓ Show in REST API** for each sub-field

---

## Step 4: Save the Field Group

1. Click the **"Publish"** or **"Update"** button at the top right
2. You should see a green confirmation message

---

## Step 5: Test in WordPress Admin

1. Navigate to **Posts** → **Lessons**
2. Edit any lesson (or create a new one)
3. Scroll down to find the **"Quiz Questions"** section
4. Click **"Add Question"** and fill in test data:
   - **Question**: "What is the first step in medical billing?"
   - **Question Type**: Multiple Choice
   - **Options**: 
     - "Charge capture" (correct)
     - "Claims submission"
     - "Payment posting"
   - **Explanation**: "Charge capture is the foundation of the medical billing cycle..."

5. Click **Publish** or **Update**

---

## Step 6: Verify REST API Response

Once you've added quiz data to a lesson, test the API endpoint:

1. Open your browser and navigate to:
   ```
   http://headless.local/wp-json/wp/v2/lesson/{lesson_id}
   ```
   (Replace `{lesson_id}` with an actual lesson post ID)

2. Look for the `acf.quiz_questions` field in the JSON response. It should look like:

```json
{
  "acf": {
    "video_url": "https://youtube.com/...",
    "transcript": "...",
    "quiz_questions": [
      {
        "question": "What is the first step in medical billing?",
        "question_type": "multiple_choice",
        "options": [
          {
            "option_text": "Charge capture",
            "is_correct": true
          },
          {
            "option_text": "Claims submission",
            "is_correct": false
          }
        ],
        "explanation": "Charge capture is the foundation...",
        "order_number": 1
      }
    ]
  }
}
```

---

## Troubleshooting

### "I can't find ACF in the sidebar"
- Make sure the ACF Pro plugin (or free version) is installed and activated
- Go to **Plugins** and search for "Advanced Custom Fields"

### "The REST API isn't showing quiz_questions"
1. Go to **ACF** → **Field Groups** → Your field group
2. Scroll to **Display Settings**
3. Check **✓ Show in REST API**
4. Click **Publish**

### "Conditional Logic isn't working"
- In ACF, conditional logic requires the base field (question_type) to already exist
- Make sure you add Question Type field **before** adding conditional fields
- Refresh the page after adding conditional logic

### "I can't find the Options repeater"
- Make sure you clicked into the Quiz Questions repeater **before** adding the Options repeater
- The Options repeater should be nested **inside** Quiz Questions (indented in the field list)

---

## Next Steps

Once the ACF fields are set up and data is added to WordPress:

1. **Update TypeScript Interfaces** - Modify `src/services/courseService.ts` to include quiz types
2. **Create Quiz Component** - Build a React component to display and handle quiz interactions
3. **Update Lesson Interface** - Add quiz data to the Lesson interface in the service layer

See the main project documentation for frontend integration steps.

---

## Field Structure Summary

```
Lesson (Post Type)
├── Title (WordPress built-in)
├── Content (WordPress built-in)
├── Video URL
├── Transcript
├── Resources (Repeater)
└── Quiz Questions (Repeater) ← NEW
    ├── Question (Text)
    ├── Question Type (Select)
    ├── Options (Repeater) [shown if: question_type = multiple_choice]
    │   ├── Option Text (Text)
    │   └── Is Correct (True/False)
    ├── Correct Answer (Select) [shown if: question_type = true_false]
    ├── Explanation (Textarea)
    └── Order Number (Number)
```

---

## Quick Reference: Field Configuration

| Field | Type | Required | Conditional | Notes |
|-------|------|----------|-------------|-------|
| quiz_questions | Repeater | - | - | Parent container |
| question | Text | Yes | - | Question text |
| question_type | Select | Yes | - | multiple_choice, true_false, essay |
| options | Repeater | - | question_type = multiple_choice | Only for multiple choice |
| option_text | Text | Yes | - | Individual answer choice |
| is_correct | True/False | - | - | Mark as correct answer |
| correct_answer | Select | - | question_type = true_false | True or False |
| explanation | Textarea | - | - | Feedback after answer |
| order_number | Number | - | - | Question sequence (1, 2, 3...) |

