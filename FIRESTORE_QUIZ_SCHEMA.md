# Firestore Quiz Schema - Hybrid Approach

This document defines the Firestore collection structure for tracking user quiz attempts, scores, and progress.

## Collection Structure

```
/users
  /{userId}
    /quizAttempts
      /{attemptId}
        - quizId: number (WordPress Quiz post ID)
        - lessonId: number (WordPress Lesson post ID)
        - courseId: number (WordPress Course post ID)
        - score: number (0-100)
        - percentageCorrect: number (0-100)
        - passed: boolean
        - answers: { [questionId]: string } (user's answers)
        - totalQuestions: number
        - correctAnswers: number
        - timestamp: Timestamp
        - completedAt: Timestamp
        - timeSpent: number (seconds)
```

---

## Detailed Field Descriptions

### Root Collection: `/users`

This already exists in your Firebase setup. Each user document is identified by their UID from Firebase Authentication.

---

### Sub-collection: `/users/{userId}/quizAttempts`

Stores all quiz attempts by a user.

#### Document Fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `quizId` | Number | WordPress Quiz post ID | `10` |
| `lessonId` | Number | WordPress Lesson post ID the quiz belongs to | `5` |
| `courseId` | Number | WordPress Course post ID for context | `1` |
| `score` | Number | Final score (0-100) | `85` |
| `percentageCorrect` | Number | Percentage of correct answers | `85` |
| `passed` | Boolean | Whether score >= pass_percentage | `true` |
| `answers` | Object/Map | User's answers: `{ questionId: answer }` | `{ "0": "A", "1": "true", "2": "My answer text" }` |
| `totalQuestions` | Number | Total questions in quiz | `10` |
| `correctAnswers` | Number | Number of correct responses | `8` |
| `timestamp` | Timestamp | When attempt started | `2024-01-15T10:30:00Z` |
| `completedAt` | Timestamp | When attempt was submitted | `2024-01-15T10:45:00Z` |
| `timeSpent` | Number | Time spent on quiz in seconds | `900` |

---

## TypeScript Interface

Add to your `src/services/` files:

```typescript
// Quiz-related interfaces
export interface QuizAttempt {
  id: string; // Firestore document ID
  quizId: number;
  lessonId: number;
  courseId: number;
  score: number;
  percentageCorrect: number;
  passed: boolean;
  answers: Record<string, string>; // questionId -> answer
  totalQuestions: number;
  correctAnswers: number;
  timestamp: Date;
  completedAt: Date;
  timeSpent: number; // seconds
}

export interface QuizAttemptInput {
  quizId: number;
  lessonId: number;
  courseId: number;
  answers: Record<string, string>;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
}
```

---

## Example Document

```json
{
  "id": "attempt_001",
  "quizId": 10,
  "lessonId": 5,
  "courseId": 1,
  "score": 85,
  "percentageCorrect": 85,
  "passed": true,
  "answers": {
    "0": "A",
    "1": "false",
    "2": "Charge capture is the foundation..."
  },
  "totalQuestions": 10,
  "correctAnswers": 8,
  "timestamp": "2024-01-15T10:30:00Z",
  "completedAt": "2024-01-15T10:45:00Z",
  "timeSpent": 900
}
```

---

## Firestore Security Rules

Add these rules to your Firestore to protect user quiz data:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own quiz attempts
    match /users/{userId}/quizAttempts/{attemptId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

---

## Usage Patterns

### 1. Save Quiz Attempt

```typescript
const userId = auth.currentUser?.uid;
const attemptData: QuizAttemptInput = {
  quizId: 10,
  lessonId: 5,
  courseId: 1,
  answers: { "0": "A", "1": "true", "2": "My answer" },
  totalQuestions: 3,
  correctAnswers: 2,
  score: 67,
  passed: false,
  timeSpent: 450,
};

const docRef = await addDoc(
  collection(db, 'users', userId, 'quizAttempts'),
  {
    ...attemptData,
    timestamp: serverTimestamp(),
    completedAt: serverTimestamp(),
  }
);
```

### 2. Retrieve Quiz Attempts for a Lesson

```typescript
const lessonId = 5;
const userId = auth.currentUser?.uid;

const q = query(
  collection(db, 'users', userId, 'quizAttempts'),
  where('lessonId', '==', lessonId)
);

const attempts = await getDocs(q);
```

### 3. Get Latest Quiz Attempt

```typescript
const q = query(
  collection(db, 'users', userId, 'quizAttempts'),
  where('quizId', '==', quizId),
  orderBy('completedAt', 'desc'),
  limit(1)
);

const latest = await getDocs(q);
```

### 4. Check if User Passed Quiz

```typescript
const attempts = await getDocs(
  query(
    collection(db, 'users', userId, 'quizAttempts'),
    where('quizId', '==', quizId),
    where('passed', '==', true)
  )
);

const hasPassed = attempts.size > 0;
```

---

## Optional: Quiz Progress Rollup

To optimize course progress queries, you can add summary data at the user level:

```
/users/{userId}
  ├── enrollments: { courseId: { ... } }
  ├── quizProgress: {
  │   courseId_1: {
  │     completedQuizzes: [10, 11, 12],
  │     passedQuizzes: [10, 11],
  │     totalScore: 245,
  │     averageScore: 81.67
  │   }
  │ }
  └── quizAttempts (sub-collection)
```

This allows you to quickly fetch a user's overall quiz progress without querying all attempts.

---

## Migration Notes

If you later want to migrate quiz data from another system:

1. Export quiz attempt data as JSON
2. Transform to match this schema
3. Use Firestore bulk import or a script to populate the collection

Example migration script (Node.js):
```javascript
const quizAttempts = await importJSON('old_quiz_data.json');

for (const attempt of quizAttempts) {
  await addDoc(collection(db, 'users', attempt.userId, 'quizAttempts'), {
    quizId: attempt.quiz_id,
    lessonId: attempt.lesson_id,
    courseId: attempt.course_id,
    score: attempt.score,
    percentageCorrect: attempt.percentage,
    passed: attempt.passed,
    answers: attempt.user_answers,
    totalQuestions: attempt.total_q,
    correctAnswers: attempt.correct_q,
    timestamp: new Date(attempt.started_at),
    completedAt: new Date(attempt.completed_at),
    timeSpent: attempt.time_seconds,
  });
}
```

