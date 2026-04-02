**B-HackMe**

100-Task Development Checklist

Bangladesh Hack & Learn Platform --- Full Project Build Plan

10 Phases • 100 Tasks • \~55 Development Days • Version 1.0.0

**Task Overview & Phase Summary**

This checklist covers all 100 development tasks for the B-HackMe
platform, organized across 10 phases from infrastructure setup to
production launch. Use the Status column to track progress as
development proceeds.

**Priority Legend:** 🔴 Critical 🟡 High 🟢 Normal **Status Legend:** 🔲
Todo 🔄 In Progress ✅ Done

  --------------------------------------------------------------------------------
  **Phase**   **Description**                 **Tasks**    **Count**   **Est.
                                                                       Days**
  ----------- ------------------------------- ------------ ----------- -----------
  **Phase 1** Project Setup & Infrastructure  1--12        **12        \~6 days
                                                           tasks**     

  **Phase 2** Database & Backend Foundation   13--28       **16        \~8 days
                                                           tasks**     

  **Phase 3** Docker Terminal Engine          29--42       **14        \~7 days
                                                           tasks**     

  **Phase 4** Learning Content API            43--55       **13        \~7 days
                                                           tasks**     

  **Phase 5** Frontend Foundation             56--68       **13        \~7 days
                                                           tasks**     

  **Phase 6** Terminal UI & Learn Page        69--79       **11        \~6 days
                                                           tasks**     

  **Phase 7** Gamification & User Profile     80--87       **8 tasks** \~4 days

  **Phase 8** Admin Panel                     88--94       **7 tasks** \~4 days

  **Phase 9** Content Seeding                 95--98       **4 tasks** \~2 days

  **Phase     QA, Security Audit & Launch     99--100      **2 tasks** \~1 days
  10**                                                                 

  **TOTAL**   **All 10 development phases**   **1--100**   **100       **\~55
                                                           tasks**     days**
  --------------------------------------------------------------------------------

**Full 100-Task Development Checklist**

**Phase 1 --- Project Setup & Infrastructure**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **01**   Initialize Git repository and define   Phase 1     🔴 Critical    ✅ Done
           branching strategy (main/dev/feature)

  **02**   Create root docker-compose.yml with    Phase 1     🔴 Critical    ✅ Done
           all service definitions

  **03**   Write base Dockerfiles for frontend,   Phase 1     🔴 Critical    ✅ Done
           backend, and terminal containers

  **04**   Set up PostgreSQL 16 container with    Phase 1     🔴 Critical    ✅ Done
           persistent volume and init.sql

  **05**   Set up Redis 7 container with          Phase 1     🔴 Critical    ✅ Done
           appendonly persistence and memory
           limits

  **06**   Configure Nginx reverse proxy with     Phase 1     🔴 Critical    ✅ Done
           upstream routing for API, WS, and
           frontend

  **07**   Create .env.example with all required  Phase 1     🟡 High        ✅ Done
           environment variable keys documented

  **08**   Build Alpine Linux terminal base image Phase 1     🔴 Critical    ✅ Done
           with security hardening

  **09**   Configure isolated Docker bridge       Phase 1     🔴 Critical    ✅ Done
           network (terminal-net, no internet
           access)

  **10**   Set up GitHub Actions CI pipeline      Phase 1     🟡 High        ✅ Done
           (lint → test → build → push)

  **11**   Configure Certbot for automatic        Phase 1     🟡 High        ✅ Done
           SSL/TLS with Nginx on production VPS

  **12**   Write docker-compose.dev.yml with      Phase 1     🟡 High        ✅ Done
           hot-reload settings for local
           development
  ---------------------------------------------------------------------------------------

**Phase 2 --- Database & Backend Foundation**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **13**   Initialize Node.js/Express backend     Phase 2     🔴 Critical    🔲 Todo
           project with TypeScript or ESM config                             

  **14**   Set up Prisma ORM with PostgreSQL      Phase 2     🔴 Critical    🔲 Todo
           connection and initial schema file                                

  **15**   Write Prisma schema: users, chapters,  Phase 2     🔴 Critical    🔲 Todo
           lessons, tasks tables                                             

  **16**   Write Prisma schema: user_progress,    Phase 2     🔴 Critical    🔲 Todo
           user_sessions, badges tables                                      

  **17**   Run initial Prisma migration and       Phase 2     🔴 Critical    🔲 Todo
           verify schema in PostgreSQL                                       

  **18**   Set up Redis client (ioredis) with     Phase 2     🟡 High        🔲 Todo
           connection pool and error handling                                

  **19**   Configure Winston logger with daily    Phase 2     🟡 High        🔲 Todo
           file rotation and console transport                               

  **20**   Implement global error handler         Phase 2     🔴 Critical    🔲 Todo
           middleware with proper HTTP status                                
           codes                                                             

  **21**   Set up Helmet.js, CORS, rate limiting  Phase 2     🔴 Critical    🔲 Todo
           (express-rate-limit) middleware                                   

  **22**   Write Joi input validation schemas for Phase 2     🟡 High        🔲 Todo
           all major API request bodies                                      

  **23**   Implement JWT auth: access token       Phase 2     🔴 Critical    🔲 Todo
           (15m) + refresh token (7d) strategy                               

  **24**   Build POST /api/auth/register endpoint Phase 2     🔴 Critical    🔲 Todo
           with bcrypt password hashing                                      

  **25**   Build POST /api/auth/login with        Phase 2     🔴 Critical    🔲 Todo
           credential check and token issuance                               

  **26**   Build POST /api/auth/refresh and POST  Phase 2     🟡 High        🔲 Todo
           /api/auth/logout endpoints                                        

  **27**   Build GET /api/auth/me endpoint with   Phase 2     🟡 High        🔲 Todo
           auth middleware guard                                             

  **28**   Write unit tests for all auth          Phase 2     🟡 High        🔲 Todo
           endpoints using Jest + Supertest                                  
  ---------------------------------------------------------------------------------------

**Phase 3 --- Docker Terminal Engine**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **29**   Install and configure Dockerode for    Phase 3     🔴 Critical    🔲 Todo
           Docker API access from backend                                    
           container                                                         

  **30**   Build DockerService:                   Phase 3     🔴 Critical    🔲 Todo
           getOrCreateContainer(userId) function                             

  **31**   Build DockerService:                   Phase 3     🔴 Critical    🔲 Todo
           killContainer(containerId) with                                   
           cleanup logic                                                     

  **32**   Implement container pool: max 50       Phase 3     🔴 Critical    🔲 Todo
           concurrent containers with queue                                  

  **33**   Attach node-pty pseudo-terminal to     Phase 3     🔴 Critical    🔲 Todo
           running Docker container                                          

  **34**   Build 1-hour idle timeout: auto-kill   Phase 3     🔴 Critical    🔲 Todo
           containers with BullMQ delayed jobs                               

  **35**   Store active container metadata in     Phase 3     🟡 High        🔲 Todo
           Redis (userId → containerId, IP,                                  
           expiry)                                                           

  **36**   Implement POST /api/terminal/start and Phase 3     🟡 High        🔲 Todo
           GET /api/terminal/status REST                                     
           endpoints                                                         

  **37**   Implement DELETE /api/terminal/stop    Phase 3     🟡 High        🔲 Todo
           with graceful container shutdown                                  

  **38**   Initialize Socket.io server on backend Phase 3     🔴 Critical    🔲 Todo
           with JWT handshake authentication                                 

  **39**   Implement terminal:connect handler --- Phase 3     🔴 Critical    🔲 Todo
           spawn/reuse container, attach pty                                 

  **40**   Implement terminal:input handler ---   Phase 3     🔴 Critical    🔲 Todo
           write keystrokes to pty process                                   

  **41**   Implement terminal:output stream ---   Phase 3     🔴 Critical    🔲 Todo
           pipe pty output to client via                                     
           WebSocket                                                         

  **42**   Implement terminal:resize handler and  Phase 3     🟡 High        🔲 Todo
           terminal:disconnect cleanup                                       
  ---------------------------------------------------------------------------------------

**Phase 4 --- Learning Content API**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **43**   Build GET /api/chapters endpoint (list Phase 4     🔴 Critical    🔲 Todo
           all published chapters, paginated)                                

  **44**   Build GET /api/chapters/:id (single    Phase 4     🔴 Critical    🔲 Todo
           chapter with lesson list)                                         

  **45**   Build GET /api/chapters/:id/lessons    Phase 4     🔴 Critical    🔲 Todo
           (ordered lesson list for a chapter)                               

  **46**   Build GET /api/lessons/:id (lesson     Phase 4     🔴 Critical    🔲 Todo
           with full markdown content + tasks)                               

  **47**   Build task validation service: exact,  Phase 4     🔴 Critical    🔲 Todo
           contains, regex, custom modes                                     

  **48**   Build POST /api/progress/validate ---  Phase 4     🔴 Critical    🔲 Todo
           check output, award XP, update DB                                 

  **49**   Build XP service: calculate level from Phase 4     🔴 Critical    🔲 Todo
           total XP, trigger level-up events                                 

  **50**   Build badge service: check criteria    Phase 4     🟡 High        🔲 Todo
           after each task completion, unlock                                
           badges                                                            

  **51**   Build GET /api/progress endpoint (full Phase 4     🟡 High        🔲 Todo
           chapter/lesson/task progress map)                                 

  **52**   Build GET /api/progress/stats (XP,     Phase 4     🟡 High        🔲 Todo
           level, badge count, streak)                                       

  **53**   Build GET /api/leaderboard (top 50     Phase 4     🟢 Normal      🔲 Todo
           users by XP with pagination)                                      

  **54**   Implement daily login streak tracking  Phase 4     🟢 Normal      🔲 Todo
           in Redis (key: streak:{userId})                                   

  **55**   Write integration tests for progress   Phase 4     🟡 High        🔲 Todo
           and validation endpoints                                          
  ---------------------------------------------------------------------------------------

**Phase 5 --- Frontend Foundation**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **56**   Initialize Next.js 14 project with     Phase 5     🔴 Critical    🔲 Todo
           TypeScript, Tailwind CSS, and ESLint                              

  **57**   Configure Zustand global store (auth,  Phase 5     🔴 Critical    🔲 Todo
           progress, terminal state slices)                                  

  **58**   Build API client (axios/fetch wrapper) Phase 5     🔴 Critical    🔲 Todo
           with JWT auto-attach and refresh logic                            

  **59**   Build useSocket hook for Socket.io     Phase 5     🔴 Critical    🔲 Todo
           connection lifecycle management                                   

  **60**   Build Navbar component: logo, user XP  Phase 5     🟡 High        🔲 Todo
           badge, level indicator, logout                                    

  **61**   Build Sidebar component:               Phase 5     🟡 High        🔲 Todo
           chapter/lesson tree navigation with                               
           completion ticks                                                  

  **62**   Build Landing page (index.tsx): hero,  Phase 5     🟡 High        🔲 Todo
           features, CTA, screenshot mockup                                  

  **63**   Build Login page with form validation  Phase 5     🔴 Critical    🔲 Todo
           and JWT token storage                                             

  **64**   Build Register page with               Phase 5     🔴 Critical    🔲 Todo
           username/email/password validation                                

  **65**   Build Dashboard page: XP bar, level    Phase 5     🟡 High        🔲 Todo
           badge, recent chapters, stats cards                               

  **66**   Build Chapter List page: cards with    Phase 5     🟡 High        🔲 Todo
           level filter, progress ring, lock                                 
           states                                                            

  **67**   Implement protected route              Phase 5     🔴 Critical    🔲 Todo
           HOC/middleware for authenticated pages                            

  **68**   Set up React Query for server-state    Phase 5     🟡 High        🔲 Todo
           caching (chapters, lessons, progress)                             
  ---------------------------------------------------------------------------------------

**Phase 6 --- Terminal UI & Learn Page**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **69**   Integrate xterm.js TerminalEmulator    Phase 6     🔴 Critical    🔲 Todo
           component with FitAddon and                                       
           WebLinksAddon                                                     

  **70**   Apply dark terminal theme (background: Phase 6     🟡 High        🔲 Todo
           #0D1117, green foreground, JetBrains                              
           Mono font)                                                        

  **71**   Wire TerminalEmulator to useSocket:    Phase 6     🔴 Critical    🔲 Todo
           input → socket, output → xterm write                              

  **72**   Build TerminalToolbar: Reset, Clear    Phase 6     🟢 Normal      🔲 Todo
           screen, Copy output buttons                                       

  **73**   Build InstructionPanel: Markdown       Phase 6     🔴 Critical    🔲 Todo
           renderer with syntax-highlighted code                             
           blocks                                                            

  **74**   Build TaskCard: task description,      Phase 6     🔴 Critical    🔲 Todo
           \[Validate\] button, attempt counter,                             
           hint toggle                                                       

  **75**   Build split-panel layout (resizable    Phase 6     🔴 Critical    🔲 Todo
           left/right) for the main learn page                               

  **76**   Implement task validation flow:        Phase 6     🔴 Critical    🔲 Todo
           capture buffer → call API → show                                  
           result toast                                                      

  **77**   Build XP toast notification and badge  Phase 6     🟡 High        🔲 Todo
           earned modal on success events                                    

  **78**   Build lesson progress bar and chapter  Phase 6     🟡 High        🔲 Todo
           navigation (prev/next) buttons                                    

  **79**   Implement auto-scroll to next task on  Phase 6     🟢 Normal      🔲 Todo
           completion with smooth animation                                  
  ---------------------------------------------------------------------------------------

**Phase 7 --- Gamification & User Profile**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **80**   Build XPBar component: animated fill,  Phase 7     🟡 High        🔲 Todo
           level label, XP to next level display                             

  **81**   Build BadgeGallery component: grid of  Phase 7     🟡 High        🔲 Todo
           earned/locked badges with tooltips                                

  **82**   Build Leaderboard page: top 50 table   Phase 7     🟢 Normal      🔲 Todo
           with avatar, XP, level, rank badges                               

  **83**   Build User Profile page: avatar        Phase 7     🟡 High        🔲 Todo
           upload, stats, completed chapters list                            

  **84**   Implement 7-day streak calendar widget Phase 7     🟢 Normal      🔲 Todo
           on dashboard                                                      

  **85**   Seed 15 badge definitions into         Phase 7     🟡 High        🔲 Todo
           database with icons and criteria                                  
           values                                                            

  **86**   Build level-up animation overlay       Phase 7     🟢 Normal      🔲 Todo
           (full-screen confetti on level change)                            

  **87**   Implement Socket.io badge:earned event Phase 7     🟡 High        🔲 Todo
           handler → show modal in real-time                                 
  ---------------------------------------------------------------------------------------

**Phase 8 --- Admin Panel**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **88**   Build Admin Dashboard: user count,     Phase 8     🟡 High        🔲 Todo
           active containers, XP distributed,                                
           chart                                                             

  **89**   Build Chapter Manager:                 Phase 8     🔴 Critical    🔲 Todo
           create/edit/delete/reorder chapters                               
           with publish toggle                                               

  **90**   Build Lesson Editor: Markdown editor   Phase 8     🔴 Critical    🔲 Todo
           (CodeMirror/Monaco) with live preview                             

  **91**   Build Task Builder: add tasks with     Phase 8     🔴 Critical    🔲 Todo
           validation rule tester (test output                               
           live)                                                             

  **92**   Build User Manager: list users, view   Phase 8     🟡 High        🔲 Todo
           progress, ban/unban, force session                                
           kill                                                              

  **93**   Build Container Monitor: live list of  Phase 8     🟡 High        🔲 Todo
           active containers with resource gauges                            

  **94**   Implement admin-only route guards on   Phase 8     🔴 Critical    🔲 Todo
           both frontend and backend middleware                              
  ---------------------------------------------------------------------------------------

**Phase 9 --- Content Seeding**

  ---------------------------------------------------------------------------------------
  **\#**   **Task Description**                   **Phase**   **Priority**   **Status**
  -------- -------------------------------------- ----------- -------------- ------------
  **95**   Write seed script for 3 beginner       Phase 9     🔴 Critical    🔲 Todo
           chapters (15 lessons, 45 tasks) with                              
           content                                                           

  **96**   Write Bangla title translations for    Phase 9     🟡 High        🔲 Todo
           all beginner chapter and lesson titles                            

  **97**   Write 2 intermediate chapters          Phase 9     🟡 High        🔲 Todo
           (Permissions + Processes) with tasks                              
           and hints                                                         

  **98**   Write 1 Hacker chapter: nmap scanning  Phase 9     🟡 High        🔲 Todo
           lab with 5 progressive CTF-style tasks                            
  ---------------------------------------------------------------------------------------

**Phase 10 --- QA, Security Audit & Launch**

  ----------------------------------------------------------------------------------------
  **\#**    **Task Description**                   **Phase**   **Priority**   **Status**
  --------- -------------------------------------- ----------- -------------- ------------
  **99**    Full security audit: pentest container Phase 10    🔴 Critical    🔲 Todo
            escape, API fuzzing, JWT tampering,                               
            rate limits                                                       

  **100**   Production deployment: VPS setup, DNS, Phase 10    🔴 Critical    🔲 Todo
            SSL, smoke test all features                                      
            end-to-end                                                        
  ----------------------------------------------------------------------------------------

**B-HackMe --- Learn Linux. Think Like a Hacker. Built for Bangladesh.
🇧🇩**
