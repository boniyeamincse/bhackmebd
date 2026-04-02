# B-HackMe Lab Curriculum and Delivery Workflow

This file defines a standard format for every lab so the learning flow is consistent and gamified.

## 1. Standard Rules for Every Lab

- Each lab includes exactly 20 command tasks.
- Each lab includes exactly 5 exercises (hands-on practical problems).
- Each lab includes exactly 5 MCQ questions tied to that lab topic.
- Each lab awards total points between 50 and 100.
- Learner flow is always: Read topic -> Practice command examples -> Complete 5 exercises -> Complete 5 MCQs -> Receive points and update account.

## 2. Learner Workflow (Must Be Same in All Labs)

1. Topic Read Page
   - Learner reads short theory for the topic.
   - Include key concepts, command syntax, and safety notes.
2. Command Example Page
   - Show guided examples for all required commands.
   - Learner can run commands in terminal sandbox.
3. Exercise Page (5 Exercises)
   - Open only after topic read and command examples are completed.
   - Practical mini-challenges from easy to medium.
4. MCQ Page (5 Questions)
   - Open only after all 5 exercises are submitted.
   - Questions must test understanding of the same topic.
5. Completion and Reward
   - System calculates score.
   - Points are added to learner account.
   - Progress, streak, and badges are updated.

## 3. Scoring Model (50 to 100 Points Per Lab)

Use this default model for consistent progression:

- Base completion points: 50
- Exercise performance bonus: up to 30
- MCQ performance bonus: up to 20
- Maximum total: 100

Formula:

- Lab Points = 50 + Exercise Bonus + MCQ Bonus
- Exercise Bonus = correct exercise ratio x 30
- MCQ Bonus = correct MCQ ratio x 20

Difficulty recommendation:

- Beginner labs target 50-70 average points.
- Intermediate labs target 60-85 average points.
- Advanced labs target 70-100 average points.

## 4. Lab Blueprint Template (Use for Every New Lab)

### Lab [ID]: [Lab Name]

- Level: Beginner | Intermediate | Advanced
- Topic: [Main topic]
- Total commands: 20
- Total exercises: 5
- Total MCQ: 5
- Point range: 50-100

#### A. Topic Read Content Checklist

- [ ] Learning objectives written (3 to 5 objectives)
- [ ] Core concepts explained simply
- [ ] Command safety and warnings added
- [ ] Real-world use case included

#### B. Command Set (20)

- [ ] C01 [command]
- [ ] C02 [command]
- [ ] C03 [command]
- [ ] C04 [command]
- [ ] C05 [command]
- [ ] C06 [command]
- [ ] C07 [command]
- [ ] C08 [command]
- [ ] C09 [command]
- [ ] C10 [command]
- [ ] C11 [command]
- [ ] C12 [command]
- [ ] C13 [command]
- [ ] C14 [command]
- [ ] C15 [command]
- [ ] C16 [command]
- [ ] C17 [command]
- [ ] C18 [command]
- [ ] C19 [command]
- [ ] C20 [command]

#### C. Exercises (5)

- [ ] E1 Easy scenario
- [ ] E2 Easy/Medium scenario
- [ ] E3 Medium scenario
- [ ] E4 Medium/Hard scenario
- [ ] E5 Hard scenario

#### D. MCQ (5)

- [ ] Q1 Concept check
- [ ] Q2 Command syntax check
- [ ] Q3 Output interpretation
- [ ] Q4 Troubleshooting logic
- [ ] Q5 Best practice/security check

#### E. Completion Gates

- [ ] Gate 1: Topic read completed before exercises unlock
- [ ] Gate 2: All 5 exercises submitted before MCQ unlock
- [ ] Gate 3: MCQ submitted before reward unlock

#### F. Reward and Tracking

- [ ] Points calculated (50-100)
- [ ] Points added to account wallet/profile
- [ ] XP and streak updated
- [ ] Badge rule checked

## 5. Curriculum Plan by Level and Lab

Use this map with the same blueprint above.

### Beginner (Labs 1-5)

1. Linux Fundamentals
2. Command Line Basics
3. File System Exploration
4. Permissions and Ownership
5. Package Management Basics

### Intermediate (Labs 6-10)

6. Text Processing and Search
7. Process and Service Management
8. Disk and Storage Management
9. Shell Scripting Basics
10. User and Group Management

### Advanced (Labs 11-15)

11. Linux Administration Deep Dive
12. Monitoring and Performance Tuning
13. Security Hardening
14. Troubleshooting and Incident Response
15. Networking and Diagnostics

## 6. Content Team Task Workflow

For each lab, complete tasks in this order:

1. Define topic objectives and outcomes.
2. Select and validate exactly 20 commands.
3. Write guided command examples.
4. Design 5 exercises mapped to command skills.
5. Design 5 MCQs mapped to the same topic.
6. Configure unlock gates (read -> exercises -> MCQ).
7. Configure scoring (50-100) and reward integration.
8. QA test full lab from start to reward.
9. Publish lab.

## 7. QA Acceptance Checklist (Per Lab)

- [ ] Exactly 20 commands exist and run in sandbox.
- [ ] Exactly 5 exercises are visible and submittable.
- [ ] Exactly 5 MCQs are visible and gradable.
- [ ] Flow order is enforced correctly.
- [ ] Points are always between 50 and 100.
- [ ] Points are added to learner account after completion.
- [ ] Progress UI updates after refresh and re-login.

This plan gives a clear, repeatable learning journey and better lesson quality for every B-HackMe lab.
