# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ai-guide-chatbot.spec.ts >> MediGuide AI Conversational Health & Hospital Guide >> Patient interacts with MediGuide AI for emergency triage, doctor matching, and OPD queue guidance
- Location: e2e/ai-guide-chatbot.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Hello! I am MediGuide AI')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByText('Hello! I am MediGuide AI') with timeout 5000ms
  - waiting for getByText('Hello! I am MediGuide AI')

```

```yaml
- complementary:
  - link "MediBook Home":
    - /url: /
  - text: MediBook
  - navigation:
    - button "Dashboard"
    - button "Appointments"
    - button "Consultations"
    - button "Medical Records"
    - button "Find Doctors"
    - button "MediGuide AI Assistant"
    - button "Book Appointment"
  - button "Notifications"
  - button "Settings"
  - button "Logout"
- textbox "Search for events, doctors, appointments..."
- text: (this dashboard is for example)
- combobox "Select Language":
  - option "EN" [selected]
  - option "HI (हिन्दी)"
- button "Toggle theme"
- button "Direct Consultations"
- button "Notifications"
- text: R
- paragraph: Rahul Sharma
- paragraph: Verified Patient
- img
- text: Sep 17, 2026, 9:05 PM
- heading "Good Day, Rahul Sharma!" [level=1]
- paragraph: Have a nice Thursday! You have 2 upcoming consultations today.
- text: "UHID: MB-98412 • All Vital Records Synced OPD Queue Active"
- img
- text: 94% Health Score
- img
- img
- text: AI Clinical Pre-Triage Instant OPD Matching
- heading "Feeling unwell? Identify the right specialist before booking" [level=3]
- paragraph: Answer 3 quick questions about your symptoms. Our clinical engine determines urgency, recommends the ideal department (Cardiology, Neuro, Oncology, etc.), and pre-fills your appointment.
- button "Ask AI Guide"
- button "Emergency SOS"
- button "Start Symptom Pre-Triage"
- heading "Live Hospital OPD Queue Tracker" [level=3]
- text: Live Sync Active
- paragraph: AIIMS Super Specialty Hospital, New Delhi • OPD Chamber 304
- button "Mute Hospital Chime"
- button "Directions"
- button "Digital E-Pass"
- text: "Now Serving Token #A-06 Patient: Ramesh Verma Your Token Token #A-08 Waiting in Sub-Lobby Patients Ahead 2 patients Fast moving queue Est. Wait Time ~20 mins Approx. 10:30 AM ✓ Kiosk Scan Done 9:15 AM ✓ Nurse Triage BP: 120/80 3 OPD Lobby Current Step 4 Doctor Desk Chamber 304 In-Clinic OPD"
- button
- text: "0"
- paragraph: completed hospital visits
- text: "-6% avg"
- img
- text: Prescriptions & Meds
- button
- text: "0"
- paragraph: active daily doses
- text: +21% avg
- img
- text: Diagnostics & Labs
- button
- text: "0"
- paragraph: reports verified & synced
- text: +15% avg
- img
- text: ABHA / Hospital EHR Synced
- heading "Clinical Health Vitals" [level=2]
- paragraph: Live synced biometric telemetry with doctor chamber
- text: Clinical Vitals (Doctor Recorded Only) Doctor Only Blood Pressure 120/80 mmHg Doctor Verified (OPD Exam) Optimal Heart Rate 72 bpm Today, 9:30 AM Normal Blood Glucose 94 mg/dL Yesterday Optimal SpO2 Oxygen 99 % Today, 9:30 AM Normal Body Mass Index 68 kg 22.5 BMI Last week Normal Body Temperature 98.4 °F Today, 9:30 AM Patient Daily Medication Log
- heading "Medications & Daily Adherence" [level=2]
- paragraph: Prescribed dosages linked directly from doctor consultations
- text: 67% Completed Today
- button "Log Medication Dose"
- heading "Atorvastatin (20 mg)" [level=4]
- text: Morning • 08:00 AM
- paragraph: 1 tablet after breakfast for cholesterol control
- text: Taken at 08:15 AM
- button "5 days left • Refill"
- button "Taken"
- heading "Vitamin D3 (60,000 IU)" [level=4]
- text: Afternoon • 01:30 PM
- paragraph: 1 softgel post-lunch for bone & immune health
- text: Taken at 01:45 PM
- button "Taken"
- heading "Telmisartan (40 mg)" [level=4]
- text: Night • 09:00 PM
- paragraph: 1 tablet at bedtime for blood pressure maintenance
- text: Due today
- button "Details"
- button "Take Now"
- heading "My Plans Done" [level=2]
- text: Today
- paragraph: Routine checkups, diagnostic goals, and medical plan progress
- button "Add plan"
- button "Today"
- text: Consultations 64%
- button "+"
- text: 2 of 3 completed Click + to advance Analysis & Diagnostics 50%
- button "+"
- text: 1 of 2 tests done Click + to advance Follow-up Meetings 33%
- button "+"
- text: 1 of 3 reviewed Click + to advance
- heading "My Consultations & Visits" [level=2]
- paragraph: Manage your verified hospital OPD bookings and specialist visits
- button "+ Book Specialist"
- text: A
- heading "Dr. Aarav Mehta" [level=4]
- text: Upcoming
- paragraph: Neuro-Oncology • AIIMS Super Specialty Hospital, New Delhi
- text: "Today 10:00 AM OPD Chamber 304 Token #A-08 Consultation Fee ₹2,000"
- button "Digital E-Pass"
- button "Cancel & Refund"
- text: V
- heading "Dr. Vikramaditya Rathore" [level=4]
- text: Completed
- paragraph: Surgical Oncology • Tata Memorial Centre, Mumbai
- text: "Sep 9, 2026 02:30 PM OPD Room 112 Token #B-14 Consultation Fee ₹2,500"
- button "Write Review"
- text: R
- heading "Dr. Rohan Banerjee" [level=4]
- text: Upcoming
- paragraph: Pediatric Care • Medanta – The Medicity, Gurugram
- text: "Sep 14, 2026 09:30 AM Pediatric Wing Room 205 Token #C-05 Consultation Fee ₹1,500"
- button "Digital E-Pass"
- button "Cancel & Refund"
- text: R
- heading "Dr. Rajesh Iyer" [level=4]
- text: Completed
- paragraph: Cardiology • Fortis Escorts Heart Institute, New Delhi
- text: "Sep 9, 2026 11:00 AM Cardiology Suite 201 Token #D-02 Consultation Fee ₹2,200"
- button "Write Review"
- text: My Calendar September 2026
- button "Previous Week"
- button "Next Week"
- button "S 13"
- button "M 14"
- button "T 15"
- button "W 16"
- button "T 17"
- button "F 18"
- button "S 19"
- text: Schedule • Today, Sep 17 1 visit 10:00 AM Upcoming
- paragraph: Consultation with Dr. Aarav Mehta
- text: "Neuro-Oncology OPD Chamber 304 Token #A-08"
- button "E-Pass"
- button "Cancel"
- button "Book Appointment"
- text: Medical Profile ABHA Synced
- button "Settings"
- text: R
- heading "Rahul Sharma" [level=3]
- paragraph: Verified Patient
- paragraph: "UHID: MB-98412 • Mumbai"
- text: "Date Birth 17.07.86 Blood A(II) Rh+ BP (Doctor) 120/80 Drug Allergies: Penicillin, Sulfa Caregiver Contact: Priya Sharma (Wife) Insurance Coverage: Star Health (Active)"
- button "Edit Profile"
- button "Share Health ID"
- heading "MediGuide AI" [level=3]
- text: Doctor Verified
- paragraph: Live Clinical Assistant & OPD Guide
- button "Reset conversation"
- button "Minimize chat"
- text: Hello! I am **MediGuide AI**, your 24/7 clinical navigator and hospital assistant. How can I assist you today? You can describe any symptoms, ask about your doctor, check the Live OPD Queue status, or request emergency fast-track admission. Just now
- button "🔍 Run Clinical Pre-Triage"
- button "📡 Track Chamber 304 Live Queue"
- strong: Fast-Track Priority Queue Jump
- text: Immediate token insertion with zero upfront fee
- button "🚨 Book Emergency Priority Token"
- button "Which specialist should I see?"
- button "How does the Live OPD Queue work?"
- button "I have chest pain & breathlessness"
- button "Where is my digital OPD pass?"
- textbox "Ask MediGuide (symptoms, doctors, queue, OPD pass)..."
- button [disabled]
- button "WhatsApp & SMS Alerts Sim"
- region "Notifications alt+T"
- alert: Good Day, Rahul Sharma!
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('MediGuide AI Conversational Health & Hospital Guide', () => {
  4   |   test('Patient interacts with MediGuide AI for emergency triage, doctor matching, and OPD queue guidance', async ({ page }) => {
  5   |     // 1. Clear session and log in as patient
  6   |     await page.context().clearCookies();
  7   |     await page.goto('/login');
  8   |     await page.waitForLoadState('networkidle');
  9   |     await page.fill('input[type="email"]', 'patient@example.com');
  10  |     await page.fill('input[type="password"]', 'Patient123!');
  11  |     await Promise.all([
  12  |       page.waitForURL(/.*dashboard/, { timeout: 30000 }),
  13  |       page.click('button[type="submit"]'),
  14  |     ]);
  15  | 
  16  |     // 2. Verify MediGuide floating launcher button is visible on dashboard
  17  |     const openChatBtn = page.getByTestId('open-ai-chat-btn');
  18  |     await expect(openChatBtn).toBeVisible({ timeout: 10000 });
  19  |     await expect(openChatBtn).toContainText('MediGuide AI');
  20  | 
  21  |     // 3. Open MediGuide Chat Window
  22  |     await openChatBtn.click({ force: true });
  23  |     const chatWindow = page.getByTestId('ai-chat-window');
  24  |     await expect(chatWindow).toBeVisible({ timeout: 8000 });
  25  |     await expect(page.getByText('Live Clinical Assistant & OPD Guide')).toBeVisible();
  26  | 
  27  |     // Verify initial welcoming message and quick suggestion chips
> 28  |     await expect(page.getByText('Hello! I am MediGuide AI')).toBeVisible();
      |                                                              ^ Error: expect(locator).toBeVisible() failed
  29  |     await expect(page.getByTestId('suggested-reply-0')).toBeVisible();
  30  | 
  31  |     // Capture initial chat state screenshot
  32  |     await page.screenshot({
  33  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_initial.png',
  34  |     });
  35  | 
  36  |     // 4. Test Emergency Red-Flag Intent
  37  |     const chatInput = page.getByTestId('ai-chat-input');
  38  |     const sendBtn = page.getByTestId('ai-chat-send-btn');
  39  |     await chatInput.fill('I have severe chest pain and cannot breathe');
  40  |     await sendBtn.click();
  41  | 
  42  |     // Verify emergency clinical alert response
  43  |     await expect(page.getByText('EMERGENCY CLINICAL TRIAGE RED FLAG')).toBeVisible({ timeout: 12000 });
  44  |     await expect(page.getByText(/CRITICAL CLINICAL ALERT/i)).toBeVisible();
  45  |     
  46  |     // Verify emergency action card
  47  |     const emergencyActionBtn = page.getByTestId('chat-action-emergency-btn');
  48  |     await expect(emergencyActionBtn).toBeVisible();
  49  | 
  50  |     // Capture emergency response screenshot
  51  |     await page.screenshot({
  52  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_emergency_response.png',
  53  |     });
  54  | 
  55  |     // Click emergency action button to verify it launches Emergency Fast-Track Admission Modal
  56  |     await emergencyActionBtn.click();
  57  |     await expect(page.getByText('Emergency Priority Admission')).toBeVisible({ timeout: 8000 });
  58  |     await expect(page.getByText('EMERGENCY FAST-TRACK')).toBeVisible();
  59  | 
  60  |     // Close emergency modal
  61  |     const emergencyCloseBtn = page.getByRole('button').filter({ hasText: 'Cancel' });
  62  |     await emergencyCloseBtn.click();
  63  | 
  64  |     // 5. Re-open chat if needed and test Specialist Doctor Matching
  65  |     if (await openChatBtn.isVisible()) {
  66  |       await openChatBtn.click({ force: true });
  67  |     }
  68  |     await expect(chatWindow).toBeVisible({ timeout: 5000 });
  69  | 
  70  |     await chatInput.fill('I have frequent chronic migraine and brain headache');
  71  |     await sendBtn.click();
  72  | 
  73  |     // Verify specialist recommendation
  74  |     await expect(page.getByText(/Specialist Recommendation: Neurology/i)).toBeVisible({ timeout: 12000 });
  75  |     const bookDocActionBtn = page.getByTestId('chat-action-book-doctor-btn');
  76  |     await expect(bookDocActionBtn).toBeVisible();
  77  | 
  78  |     // Capture doctor matching screenshot
  79  |     await page.screenshot({
  80  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_specialist_match.png',
  81  |     });
  82  | 
  83  |     // Click book consultation action to verify it launches Doctor Booking Modal
  84  |     await bookDocActionBtn.click();
  85  |     await expect(page.getByText(/Book Appointment/i)).toBeVisible({ timeout: 8000 });
  86  | 
  87  |     // Close booking modal
  88  |     const closeBookingBtn = page.getByRole('button', { name: 'Close modal' });
  89  |     if (await closeBookingBtn.isVisible()) {
  90  |       await closeBookingBtn.click();
  91  |     } else {
  92  |       await page.keyboard.press('Escape');
  93  |     }
  94  | 
  95  |     // 6. Test OPD Live Queue Status Guidance
  96  |     if (await openChatBtn.isVisible()) {
  97  |       await openChatBtn.click({ force: true });
  98  |     }
  99  |     await expect(chatWindow).toBeVisible({ timeout: 5000 });
  100 | 
  101 |     await chatInput.fill('How does the live OPD queue work?');
  102 |     await sendBtn.click();
  103 | 
  104 |     // Verify OPD live queue status response
  105 |     await expect(page.getByText(/Hospital Live OPD Queue Status/i)).toBeVisible({ timeout: 12000 });
  106 |     await expect(page.getByText(/Server-Sent Events/i)).toBeVisible();
  107 | 
  108 |     // Capture live queue guidance screenshot
  109 |     await page.screenshot({
  110 |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_ai_guide_queue_guidance.png',
  111 |     });
  112 | 
  113 |     // 7. Verify Sidebar and Banner AI Guide triggers work
  114 |     const closeChatBtn = page.getByTestId('close-ai-chat-btn');
  115 |     await closeChatBtn.click();
  116 |     await expect(chatWindow).not.toBeVisible();
  117 | 
  118 |     // Click sidebar AI button
  119 |     const sidebarAiBtn = page.getByTestId('sidebar-ai-chat-btn');
  120 |     await expect(sidebarAiBtn).toBeVisible();
  121 |     await sidebarAiBtn.click();
  122 |     await expect(chatWindow).toBeVisible();
  123 |   });
  124 | });
  125 | 
```