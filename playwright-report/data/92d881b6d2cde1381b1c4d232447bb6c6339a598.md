# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: patient-vitals-lock.spec.ts >> Patient Dashboard Blood Pressure Restriction & Doctor-Only Control >> Verify Blood Pressure is locked to Doctor Only in Patient Dashboard, while other vitals can be logged
- Location: e2e/patient-vitals-lock.spec.ts:4:7

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByTestId('log-vitals-btn')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - complementary [ref=e6]:
        - generic [ref=e7]:
          - link "MediBook Home" [ref=e9] [cursor=pointer]:
            - /url: /
          - generic [ref=e13]: MediBook
        - navigation [ref=e14]:
          - button "Dashboard" [ref=e15] [cursor=pointer]
          - button "Appointments" [ref=e23] [cursor=pointer]
          - button "Consultations" [ref=e27] [cursor=pointer]
          - button "Medical Records" [ref=e30] [cursor=pointer]
          - button "Find Doctors" [ref=e33] [cursor=pointer]
          - button "Book Appointment" [ref=e38] [cursor=pointer]
        - generic [ref=e41]:
          - button "Notifications" [ref=e42] [cursor=pointer]
          - button "Settings" [ref=e47] [cursor=pointer]
          - button "Logout" [ref=e51] [cursor=pointer]
      - generic [ref=e55]:
        - generic [ref=e56]:
          - generic [ref=e57]:
            - textbox "Search for events, doctors, appointments..." [ref=e62]
            - generic [ref=e63]: (this dashboard is for example)
          - generic [ref=e64]:
            - generic "Select Language / भाषा चुनें" [ref=e65]:
              - combobox "Select Language" [ref=e66] [cursor=pointer]:
                - option "EN" [selected]
                - option "HI (हिन्दी)"
            - button "Toggle theme" [ref=e67]
            - button "Direct Consultations" [ref=e75] [cursor=pointer]
            - button "Notifications" [ref=e78] [cursor=pointer]
            - generic "Patient Profile & Settings" [ref=e83] [cursor=pointer]:
              - img "Rahul Sharma" [ref=e85]
              - generic [ref=e87]:
                - paragraph [ref=e88]: Rahul Sharma
                - paragraph [ref=e89]: Verified Patient
        - generic [ref=e90]:
          - generic [ref=e91]:
            - generic [ref=e94]:
              - generic [ref=e95]: Sep 13, 2026, 2:18 PM
              - generic [ref=e99]:
                - heading "Good Day, Rahul Sharma!" [level=1] [ref=e100]
                - paragraph [ref=e101]:
                  - text: Have a nice Sunday! You have
                  - generic [ref=e102]: 7 upcoming consultations
                  - text: today.
              - generic [ref=e103]:
                - generic [ref=e104]: "UHID: MB-98412 • All Vital Records Synced"
                - generic [ref=e111]: OPD Queue Active
                - generic [ref=e112]: 94% Health Score
            - generic [ref=e142]:
              - generic [ref=e148]:
                - generic [ref=e149]:
                  - generic [ref=e150]: AI Clinical Pre-Triage
                  - generic [ref=e154]: Instant OPD Matching
                - heading "Feeling unwell? Identify the right specialist before booking" [level=3] [ref=e155]
                - paragraph [ref=e156]: Answer 3 quick questions about your symptoms. Our clinical engine determines urgency, recommends the ideal department (Cardiology, Neuro, Oncology, etc.), and pre-fills your appointment.
              - button "Start Symptom Pre-Triage" [ref=e158] [cursor=pointer]
            - generic [ref=e166]:
              - generic [ref=e167]:
                - generic [ref=e172]:
                  - generic [ref=e173]:
                    - heading "Live Hospital OPD Queue Tracker" [level=3] [ref=e174]
                    - generic [ref=e175]: Live Sync Active
                  - paragraph [ref=e177]: Tata Memorial Centre, Mumbai • OPD Chamber 304
                - generic [ref=e178]:
                  - button "Mute Hospital Chime" [ref=e179] [cursor=pointer]
                  - button "Directions" [ref=e184] [cursor=pointer]
                  - button "Digital E-Pass" [ref=e188] [cursor=pointer]
              - generic [ref=e196]:
                - generic [ref=e197]:
                  - generic [ref=e198]: Now Serving
                  - generic [ref=e199]: "Token #A-06"
                  - generic [ref=e200]: "Patient: Ramesh Verma"
                - generic [ref=e201]:
                  - generic [ref=e202]: Your Token
                  - generic [ref=e203]: "Token #A-08"
                  - generic [ref=e204]: Waiting in Sub-Lobby
                - generic [ref=e205]:
                  - generic [ref=e206]: Patients Ahead
                  - generic [ref=e207]:
                    - generic [ref=e208]: "2"
                    - generic [ref=e209]: patients
                  - generic [ref=e210]: Fast moving queue
                - generic [ref=e211]:
                  - generic [ref=e212]: Est. Wait Time
                  - generic [ref=e213]: ~20 mins
                  - generic [ref=e214]: Approx. 10:30 AM
              - generic [ref=e216]:
                - generic [ref=e217]:
                  - generic [ref=e218]: ✓
                  - generic [ref=e219]: Kiosk Scan
                  - generic [ref=e220]: Done 9:15 AM
                - generic [ref=e221]:
                  - generic [ref=e222]: ✓
                  - generic [ref=e223]: Nurse Triage
                  - generic [ref=e224]: "BP: 120/80"
                - generic [ref=e225]:
                  - generic [ref=e226]: "3"
                  - generic [ref=e227]: OPD Lobby
                  - generic [ref=e228]: Current Step
                - generic [ref=e229]:
                  - generic [ref=e230]: "4"
                  - generic [ref=e231]: Doctor Desk
                  - generic [ref=e232]: Chamber 304
            - generic [ref=e233]:
              - generic [ref=e234]:
                - generic [ref=e235]:
                  - generic [ref=e236]: In-Clinic OPD
                  - button [ref=e243]
                - generic [ref=e248]:
                  - generic [ref=e249]:
                    - generic [ref=e250]: "1"
                    - paragraph [ref=e251]: completed hospital visits
                  - generic [ref=e252]: "-6% avg"
              - generic [ref=e261]:
                - generic [ref=e262]:
                  - generic [ref=e263]: Prescriptions & Meds
                  - button [ref=e269]
                - generic [ref=e274]:
                  - generic [ref=e275]:
                    - generic [ref=e276]: "7"
                    - paragraph [ref=e277]: active daily doses
                  - generic [ref=e278]: +21% avg
              - generic [ref=e287]:
                - generic [ref=e288]:
                  - generic [ref=e289]: Diagnostics & Labs
                  - button [ref=e294]
                - generic [ref=e299]:
                  - generic [ref=e300]:
                    - generic [ref=e301]: "19"
                    - paragraph [ref=e302]: reports verified & synced
                  - generic [ref=e303]: +15% avg
            - generic [ref=e312]:
              - generic [ref=e313]:
                - generic [ref=e314]:
                  - generic [ref=e315]: ABHA / Hospital EHR Synced
                  - heading "Clinical Health Vitals" [level=2] [ref=e320]
                  - paragraph [ref=e321]: Live synced biometric telemetry with doctor chamber
                - generic "Clinical health vitals are recorded exclusively by your attending physician" [ref=e323]: Clinical Vitals (Doctor Recorded Only)
              - generic [ref=e328]:
                - generic "Blood pressure can only be recorded by certified doctors" [ref=e329] [cursor=pointer]:
                  - generic "Blood pressure can only be recorded by certified doctors" [ref=e335]: Doctor Only
                  - generic [ref=e340]:
                    - generic [ref=e341]: Blood Pressure
                    - generic [ref=e346]:
                      - generic [ref=e347]: 126/82
                      - generic [ref=e348]: mmHg
                    - generic [ref=e349]: By Dr. Vikramaditya Rathore
                - generic "Clinical vital recorded by doctor. Click for details." [ref=e350] [cursor=pointer]:
                  - generic [ref=e351]: Optimal
                  - generic [ref=e360]:
                    - generic [ref=e361]: Heart Rate
                    - generic [ref=e366]:
                      - generic [ref=e367]: "72"
                      - generic [ref=e368]: bpm
                    - generic [ref=e369]: By Dr. Vikramaditya Rathore
                - generic "Clinical vital recorded by doctor. Click for details." [ref=e370] [cursor=pointer]:
                  - generic [ref=e371]: Normal
                  - generic [ref=e380]:
                    - generic [ref=e381]: Blood Glucose
                    - generic [ref=e386]:
                      - generic [ref=e387]: "94"
                      - generic [ref=e388]: mg/dL
                    - generic [ref=e389]: By Dr. Vikramaditya Rathore
                - generic "Clinical vital recorded by doctor. Click for details." [ref=e390] [cursor=pointer]:
                  - generic [ref=e391]: Optimal
                  - generic [ref=e402]:
                    - generic [ref=e403]: SpO2 Oxygen
                    - generic [ref=e408]:
                      - generic [ref=e409]: "99"
                      - generic [ref=e410]: "%"
                    - generic [ref=e411]: Today, 9:30 AM
                - generic "Clinical vital recorded by doctor. Click for details." [ref=e412] [cursor=pointer]:
                  - generic [ref=e413]: Normal
                  - generic [ref=e424]:
                    - generic [ref=e425]: Body Mass Index
                    - generic [ref=e430]:
                      - generic [ref=e431]: 68 kg
                      - generic [ref=e432]: 22.5 BMI
                    - generic [ref=e433]: By Dr. Vikramaditya Rathore
                - generic "Clinical vital recorded by doctor. Click for details." [ref=e434] [cursor=pointer]:
                  - generic [ref=e435]: Normal
                  - generic [ref=e444]:
                    - generic [ref=e445]: Body Temperature
                    - generic [ref=e450]:
                      - generic [ref=e451]: "98.4"
                      - generic [ref=e452]: °F
                    - generic [ref=e453]: By Dr. Vikramaditya Rathore
            - generic [ref=e454]:
              - generic [ref=e455]:
                - generic [ref=e456]:
                  - generic [ref=e457]: Patient Daily Medication Log
                  - heading "Medications & Daily Adherence" [level=2] [ref=e464]
                  - paragraph [ref=e465]: Prescribed dosages linked directly from doctor consultations
                - generic [ref=e466]:
                  - generic [ref=e467]: 29% Completed Today
                  - button "Log Medication Dose" [ref=e472] [cursor=pointer]
              - generic [ref=e475]:
                - generic [ref=e476]:
                  - generic [ref=e482]:
                    - generic [ref=e483]:
                      - heading "Metformin HCl (500 mg)" [level=4] [ref=e484]:
                        - text: Metformin HCl
                        - generic [ref=e485]: (500 mg)
                      - generic [ref=e486]: Morning • 08:00 AM
                    - paragraph [ref=e487]: 1 tablet with dinner for blood sugar maintenance
                    - generic [ref=e488]: Due today
                  - generic [ref=e493]:
                    - button "Details" [ref=e494] [cursor=pointer]
                    - button "Take Now" [ref=e499] [cursor=pointer]
                - generic [ref=e504]:
                  - generic [ref=e510]:
                    - generic [ref=e511]:
                      - heading "Metformin HCl (500 mg)" [level=4] [ref=e512]:
                        - text: Metformin HCl
                        - generic [ref=e513]: (500 mg)
                      - generic [ref=e514]: Morning • 08:00 AM
                    - paragraph [ref=e515]: 1 tablet with dinner for blood sugar maintenance
                    - generic [ref=e516]: Due today
                  - generic [ref=e521]:
                    - button "Details" [ref=e522] [cursor=pointer]
                    - button "Take Now" [ref=e527] [cursor=pointer]
                - generic [ref=e532]:
                  - generic [ref=e538]:
                    - generic [ref=e539]:
                      - heading "Metformin HCl (500 mg)" [level=4] [ref=e540]:
                        - text: Metformin HCl
                        - generic [ref=e541]: (500 mg)
                      - generic [ref=e542]: Morning • 08:00 AM
                    - paragraph [ref=e543]: 1 tablet with dinner for blood sugar maintenance
                    - generic [ref=e544]: Due today
                  - generic [ref=e549]:
                    - button "Details" [ref=e550] [cursor=pointer]
                    - button "Take Now" [ref=e555] [cursor=pointer]
                - generic [ref=e560]:
                  - generic [ref=e566]:
                    - generic [ref=e567]:
                      - heading "Metformin HCl (500 mg)" [level=4] [ref=e568]:
                        - text: Metformin HCl
                        - generic [ref=e569]: (500 mg)
                      - generic [ref=e570]: Morning • 08:00 AM
                    - paragraph [ref=e571]: 1 tablet with dinner for blood sugar maintenance
                    - generic [ref=e572]: Due today
                  - generic [ref=e577]:
                    - button "Details" [ref=e578] [cursor=pointer]
                    - button "Take Now" [ref=e583] [cursor=pointer]
                - generic [ref=e588]:
                  - generic [ref=e594]:
                    - generic [ref=e595]:
                      - heading "Atorvastatin (20 mg)" [level=4] [ref=e596]:
                        - text: Atorvastatin
                        - generic [ref=e597]: (20 mg)
                      - generic [ref=e598]: Morning • 08:00 AM
                    - paragraph [ref=e599]: 1 tablet after breakfast for cholesterol and cardiovascular support
                    - generic [ref=e600]: Taken at 08:15 AM
                  - button "Taken" [ref=e605] [cursor=pointer]
                - generic [ref=e609]:
                  - generic [ref=e615]:
                    - generic [ref=e616]:
                      - heading "Telmisartan (40 mg)" [level=4] [ref=e617]:
                        - text: Telmisartan
                        - generic [ref=e618]: (40 mg)
                      - generic [ref=e619]: Night • 09:00 PM
                    - paragraph [ref=e620]: 1 tablet at bedtime for blood pressure maintenance
                    - generic [ref=e621]: Due today
                  - generic [ref=e626]:
                    - button "Details" [ref=e627] [cursor=pointer]
                    - button "Take Now" [ref=e632] [cursor=pointer]
                - generic [ref=e637]:
                  - generic [ref=e643]:
                    - generic [ref=e644]:
                      - heading "Vitamin D3 (60,000 IU)" [level=4] [ref=e645]:
                        - text: Vitamin D3
                        - generic [ref=e646]: (60,000 IU)
                      - generic [ref=e647]: Afternoon • 01:30 PM
                    - paragraph [ref=e648]: 1 softgel post-lunch for bone and immune health
                    - generic [ref=e649]: Taken at 01:45 PM
                  - button "Taken" [ref=e654] [cursor=pointer]
            - generic [ref=e658]:
              - generic [ref=e659]:
                - generic [ref=e660]:
                  - generic [ref=e661]:
                    - heading "My Plans Done" [level=2] [ref=e662]
                    - generic [ref=e663]: Today
                  - paragraph [ref=e664]: Routine checkups, diagnostic goals, and medical plan progress
                - generic [ref=e665]:
                  - button "Add plan" [ref=e666] [cursor=pointer]
                  - button "Today" [ref=e670] [cursor=pointer]
              - generic [ref=e676]:
                - generic [ref=e677]:
                  - generic [ref=e678]:
                    - generic [ref=e679]: Consultations
                    - generic [ref=e680]:
                      - generic [ref=e681]: 64%
                      - button "+" [ref=e682] [cursor=pointer]
                  - generic [ref=e684]:
                    - generic [ref=e685]: 2 of 3 completed
                    - generic [ref=e686]: Click + to advance
                - generic [ref=e687]:
                  - generic [ref=e688]:
                    - generic [ref=e689]: Analysis & Diagnostics
                    - generic [ref=e690]:
                      - generic [ref=e691]: 50%
                      - button "+" [ref=e692] [cursor=pointer]
                  - generic [ref=e694]:
                    - generic [ref=e695]: 1 of 2 tests done
                    - generic [ref=e696]: Click + to advance
                - generic [ref=e697]:
                  - generic [ref=e698]:
                    - generic [ref=e699]: Follow-up Meetings
                    - generic [ref=e700]:
                      - generic [ref=e701]: 33%
                      - button "+" [ref=e702] [cursor=pointer]
                  - generic [ref=e704]:
                    - generic [ref=e705]: 1 of 3 reviewed
                    - generic [ref=e706]: Click + to advance
            - generic [ref=e707]:
              - generic [ref=e708]:
                - generic [ref=e709]:
                  - heading "My Consultations & Visits" [level=2] [ref=e710]
                  - paragraph [ref=e711]: Manage your verified hospital OPD bookings and specialist visits
                - button "+ Book Specialist" [ref=e713] [cursor=pointer]
              - generic [ref=e714]:
                - generic [ref=e715]:
                  - generic [ref=e716]:
                    - generic [ref=e717]: V
                    - generic [ref=e718]:
                      - generic [ref=e719]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e720]
                        - generic [ref=e721]: Upcoming
                      - paragraph [ref=e722]:
                        - generic [ref=e723]: SURGICAL ONCOLOGY
                        - generic [ref=e724]: •
                        - generic [ref=e725]: Tata Memorial Centre, Mumbai
                      - generic [ref=e726]:
                        - generic [ref=e727]: 2026-09-12
                        - generic [ref=e730]: 05:00 PM
                        - generic [ref=e734]: OPD Chamber 304
                        - generic [ref=e739]: "Token #A-08"
                  - generic [ref=e740]:
                    - generic [ref=e741]:
                      - generic [ref=e742]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e743]:
                      - button "Digital E-Pass" [ref=e744] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e752] [cursor=pointer]
                - generic [ref=e758]:
                  - generic [ref=e759]:
                    - generic [ref=e760]: V
                    - generic [ref=e761]:
                      - generic [ref=e762]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e763]
                        - generic [ref=e764]: Cancelled
                      - paragraph [ref=e765]:
                        - generic [ref=e766]: SURGICAL ONCOLOGY
                        - generic [ref=e767]: •
                        - generic [ref=e768]: Tata Memorial Centre, Mumbai
                      - generic [ref=e769]:
                        - generic [ref=e770]: 2026-11-27
                        - generic [ref=e773]: 11:30 AM
                        - generic [ref=e777]: OPD Chamber 304
                        - generic [ref=e782]: "Token #A-08"
                  - generic [ref=e784]:
                    - generic [ref=e785]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e786]:
                  - generic [ref=e787]:
                    - generic [ref=e788]: V
                    - generic [ref=e789]:
                      - generic [ref=e790]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e791]
                        - generic [ref=e792]: Cancelled
                      - paragraph [ref=e793]:
                        - generic [ref=e794]: SURGICAL ONCOLOGY
                        - generic [ref=e795]: •
                        - generic [ref=e796]: Tata Memorial Centre, Mumbai
                      - generic [ref=e797]:
                        - generic [ref=e798]: 2026-11-27
                        - generic [ref=e801]: 11:30 AM
                        - generic [ref=e805]: OPD Chamber 304
                        - generic [ref=e810]: "Token #A-08"
                  - generic [ref=e812]:
                    - generic [ref=e813]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e814]:
                  - generic [ref=e815]:
                    - generic [ref=e816]: V
                    - generic [ref=e817]:
                      - generic [ref=e818]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e819]
                        - generic [ref=e820]: Upcoming
                      - paragraph [ref=e821]:
                        - generic [ref=e822]: SURGICAL ONCOLOGY
                        - generic [ref=e823]: •
                        - generic [ref=e824]: Tata Memorial Centre, Mumbai
                      - generic [ref=e825]:
                        - generic [ref=e826]: 2026-09-11
                        - generic [ref=e829]: 03:30 PM
                        - generic [ref=e833]: OPD Chamber 304
                        - generic [ref=e838]: "Token #A-08"
                  - generic [ref=e839]:
                    - generic [ref=e840]:
                      - generic [ref=e841]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e842]:
                      - button "Digital E-Pass" [ref=e843] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e851] [cursor=pointer]
                - generic [ref=e857]:
                  - generic [ref=e858]:
                    - generic [ref=e859]: V
                    - generic [ref=e860]:
                      - generic [ref=e861]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e862]
                        - generic [ref=e863]: Upcoming
                      - paragraph [ref=e864]:
                        - generic [ref=e865]: SURGICAL ONCOLOGY
                        - generic [ref=e866]: •
                        - generic [ref=e867]: Tata Memorial Centre, Mumbai
                      - generic [ref=e868]:
                        - generic [ref=e869]: 2026-09-10
                        - generic [ref=e872]: 09:00 AM
                        - generic [ref=e876]: OPD Chamber 304
                        - generic [ref=e881]: "Token #A-08"
                  - generic [ref=e882]:
                    - generic [ref=e883]:
                      - generic [ref=e884]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e885]:
                      - button "Digital E-Pass" [ref=e886] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e894] [cursor=pointer]
                - generic [ref=e900]:
                  - generic [ref=e901]:
                    - generic [ref=e902]: V
                    - generic [ref=e903]:
                      - generic [ref=e904]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e905]
                        - generic [ref=e906]: Upcoming
                      - paragraph [ref=e907]:
                        - generic [ref=e908]: SURGICAL ONCOLOGY
                        - generic [ref=e909]: •
                        - generic [ref=e910]: Tata Memorial Centre, Mumbai
                      - generic [ref=e911]:
                        - generic [ref=e912]: 2026-09-09
                        - generic [ref=e915]: 06:30 PM
                        - generic [ref=e919]: OPD Chamber 304
                        - generic [ref=e924]: "Token #A-08"
                  - generic [ref=e925]:
                    - generic [ref=e926]:
                      - generic [ref=e927]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e928]:
                      - button "Digital E-Pass" [ref=e929] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e937] [cursor=pointer]
                - generic [ref=e943]:
                  - generic [ref=e944]:
                    - generic [ref=e945]: V
                    - generic [ref=e946]:
                      - generic [ref=e947]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e948]
                        - generic [ref=e949]: Upcoming
                      - paragraph [ref=e950]:
                        - generic [ref=e951]: SURGICAL ONCOLOGY
                        - generic [ref=e952]: •
                        - generic [ref=e953]: Tata Memorial Centre, Mumbai
                      - generic [ref=e954]:
                        - generic [ref=e955]: 2026-09-09
                        - generic [ref=e958]: 05:00 PM
                        - generic [ref=e962]: OPD Chamber 304
                        - generic [ref=e967]: "Token #A-08"
                  - generic [ref=e968]:
                    - generic [ref=e969]:
                      - generic [ref=e970]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e971]:
                      - button "Digital E-Pass" [ref=e972] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e980] [cursor=pointer]
                - generic [ref=e986]:
                  - generic [ref=e987]:
                    - generic [ref=e988]: V
                    - generic [ref=e989]:
                      - generic [ref=e990]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e991]
                        - generic [ref=e992]: Upcoming
                      - paragraph [ref=e993]:
                        - generic [ref=e994]: SURGICAL ONCOLOGY
                        - generic [ref=e995]: •
                        - generic [ref=e996]: Tata Memorial Centre, Mumbai
                      - generic [ref=e997]:
                        - generic [ref=e998]: 2026-09-08
                        - generic [ref=e1001]: 10:30 AM
                        - generic [ref=e1005]: OPD Chamber 304
                        - generic [ref=e1010]: "Token #A-08"
                  - generic [ref=e1011]:
                    - generic [ref=e1012]:
                      - generic [ref=e1013]: Consultation Fee
                      - text: ₹2,500
                    - generic [ref=e1014]:
                      - button "Digital E-Pass" [ref=e1015] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e1023] [cursor=pointer]
                - generic [ref=e1029]:
                  - generic [ref=e1030]:
                    - generic [ref=e1031]: V
                    - generic [ref=e1032]:
                      - generic [ref=e1033]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1034]
                        - generic [ref=e1035]: Cancelled
                      - paragraph [ref=e1036]:
                        - generic [ref=e1037]: SURGICAL ONCOLOGY
                        - generic [ref=e1038]: •
                        - generic [ref=e1039]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1040]:
                        - generic [ref=e1041]: 2026-11-15
                        - generic [ref=e1044]: 11:30 AM
                        - generic [ref=e1048]: OPD Chamber 304
                        - generic [ref=e1053]: "Token #A-08"
                  - generic [ref=e1055]:
                    - generic [ref=e1056]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1057]:
                  - generic [ref=e1058]:
                    - generic [ref=e1059]: V
                    - generic [ref=e1060]:
                      - generic [ref=e1061]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1062]
                        - generic [ref=e1063]: Cancelled
                      - paragraph [ref=e1064]:
                        - generic [ref=e1065]: SURGICAL ONCOLOGY
                        - generic [ref=e1066]: •
                        - generic [ref=e1067]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1068]:
                        - generic [ref=e1069]: 2026-11-15
                        - generic [ref=e1072]: 11:30 AM
                        - generic [ref=e1076]: OPD Chamber 304
                        - generic [ref=e1081]: "Token #A-08"
                  - generic [ref=e1083]:
                    - generic [ref=e1084]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1085]:
                  - generic [ref=e1086]:
                    - generic [ref=e1087]: V
                    - generic [ref=e1088]:
                      - generic [ref=e1089]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1090]
                        - generic [ref=e1091]: Cancelled
                      - paragraph [ref=e1092]:
                        - generic [ref=e1093]: SURGICAL ONCOLOGY
                        - generic [ref=e1094]: •
                        - generic [ref=e1095]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1096]:
                        - generic [ref=e1097]: 2026-11-21
                        - generic [ref=e1100]: 11:30 AM
                        - generic [ref=e1104]: OPD Chamber 304
                        - generic [ref=e1109]: "Token #A-08"
                  - generic [ref=e1111]:
                    - generic [ref=e1112]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1113]:
                  - generic [ref=e1114]:
                    - generic [ref=e1115]: V
                    - generic [ref=e1116]:
                      - generic [ref=e1117]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1118]
                        - generic [ref=e1119]: Cancelled
                      - paragraph [ref=e1120]:
                        - generic [ref=e1121]: SURGICAL ONCOLOGY
                        - generic [ref=e1122]: •
                        - generic [ref=e1123]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1124]:
                        - generic [ref=e1125]: 2026-11-21
                        - generic [ref=e1128]: 11:30 AM
                        - generic [ref=e1132]: OPD Chamber 304
                        - generic [ref=e1137]: "Token #A-08"
                  - generic [ref=e1139]:
                    - generic [ref=e1140]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1141]:
                  - generic [ref=e1142]:
                    - generic [ref=e1143]: V
                    - generic [ref=e1144]:
                      - generic [ref=e1145]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1146]
                        - generic [ref=e1147]: Cancelled
                      - paragraph [ref=e1148]:
                        - generic [ref=e1149]: SURGICAL ONCOLOGY
                        - generic [ref=e1150]: •
                        - generic [ref=e1151]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1152]:
                        - generic [ref=e1153]: 2026-11-26
                        - generic [ref=e1156]: 11:30 AM
                        - generic [ref=e1160]: OPD Chamber 304
                        - generic [ref=e1165]: "Token #A-08"
                  - generic [ref=e1167]:
                    - generic [ref=e1168]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1169]:
                  - generic [ref=e1170]:
                    - generic [ref=e1171]: V
                    - generic [ref=e1172]:
                      - generic [ref=e1173]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1174]
                        - generic [ref=e1175]: Cancelled
                      - paragraph [ref=e1176]:
                        - generic [ref=e1177]: SURGICAL ONCOLOGY
                        - generic [ref=e1178]: •
                        - generic [ref=e1179]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1180]:
                        - generic [ref=e1181]: 2026-11-26
                        - generic [ref=e1184]: 11:30 AM
                        - generic [ref=e1188]: OPD Chamber 304
                        - generic [ref=e1193]: "Token #A-08"
                  - generic [ref=e1195]:
                    - generic [ref=e1196]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1197]:
                  - generic [ref=e1198]:
                    - generic [ref=e1199]: V
                    - generic [ref=e1200]:
                      - generic [ref=e1201]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1202]
                        - generic [ref=e1203]: Cancelled
                      - paragraph [ref=e1204]:
                        - generic [ref=e1205]: SURGICAL ONCOLOGY
                        - generic [ref=e1206]: •
                        - generic [ref=e1207]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1208]:
                        - generic [ref=e1209]: 2026-11-15
                        - generic [ref=e1212]: 11:30 AM
                        - generic [ref=e1216]: OPD Chamber 304
                        - generic [ref=e1221]: "Token #A-08"
                  - generic [ref=e1223]:
                    - generic [ref=e1224]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1225]:
                  - generic [ref=e1226]:
                    - generic [ref=e1227]: V
                    - generic [ref=e1228]:
                      - generic [ref=e1229]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1230]
                        - generic [ref=e1231]: Cancelled
                      - paragraph [ref=e1232]:
                        - generic [ref=e1233]: SURGICAL ONCOLOGY
                        - generic [ref=e1234]: •
                        - generic [ref=e1235]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1236]:
                        - generic [ref=e1237]: 2026-11-15
                        - generic [ref=e1240]: 11:30 AM
                        - generic [ref=e1244]: OPD Chamber 304
                        - generic [ref=e1249]: "Token #A-08"
                  - generic [ref=e1251]:
                    - generic [ref=e1252]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1253]:
                  - generic [ref=e1254]:
                    - generic [ref=e1255]: V
                    - generic [ref=e1256]:
                      - generic [ref=e1257]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1258]
                        - generic [ref=e1259]: Cancelled
                      - paragraph [ref=e1260]:
                        - generic [ref=e1261]: SURGICAL ONCOLOGY
                        - generic [ref=e1262]: •
                        - generic [ref=e1263]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1264]:
                        - generic [ref=e1265]: 2026-11-27
                        - generic [ref=e1268]: 11:30 AM
                        - generic [ref=e1272]: OPD Chamber 304
                        - generic [ref=e1277]: "Token #A-08"
                  - generic [ref=e1279]:
                    - generic [ref=e1280]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1281]:
                  - generic [ref=e1282]:
                    - generic [ref=e1283]: V
                    - generic [ref=e1284]:
                      - generic [ref=e1285]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1286]
                        - generic [ref=e1287]: Cancelled
                      - paragraph [ref=e1288]:
                        - generic [ref=e1289]: SURGICAL ONCOLOGY
                        - generic [ref=e1290]: •
                        - generic [ref=e1291]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1292]:
                        - generic [ref=e1293]: 2026-11-14
                        - generic [ref=e1296]: 11:30 AM
                        - generic [ref=e1300]: OPD Chamber 304
                        - generic [ref=e1305]: "Token #A-08"
                  - generic [ref=e1307]:
                    - generic [ref=e1308]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1309]:
                  - generic [ref=e1310]:
                    - generic [ref=e1311]: V
                    - generic [ref=e1312]:
                      - generic [ref=e1313]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1314]
                        - generic [ref=e1315]: Cancelled
                      - paragraph [ref=e1316]:
                        - generic [ref=e1317]: SURGICAL ONCOLOGY
                        - generic [ref=e1318]: •
                        - generic [ref=e1319]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1320]:
                        - generic [ref=e1321]: 2026-11-14
                        - generic [ref=e1324]: 11:30 AM
                        - generic [ref=e1328]: OPD Chamber 304
                        - generic [ref=e1333]: "Token #A-08"
                  - generic [ref=e1335]:
                    - generic [ref=e1336]: Consultation Fee
                    - text: ₹2,500
                - generic [ref=e1337]:
                  - generic [ref=e1338]:
                    - generic [ref=e1339]: V
                    - generic [ref=e1340]:
                      - generic [ref=e1341]:
                        - heading "Dr. Vikramaditya Rathore" [level=4] [ref=e1342]
                        - generic [ref=e1343]: Completed
                      - paragraph [ref=e1344]:
                        - generic [ref=e1345]: SURGICAL ONCOLOGY
                        - generic [ref=e1346]: •
                        - generic [ref=e1347]: Tata Memorial Centre, Mumbai
                      - generic [ref=e1348]:
                        - generic [ref=e1349]: 2026-09-01
                        - generic [ref=e1352]: 02:30 PM
                        - generic [ref=e1356]: OPD Chamber 304
                        - generic [ref=e1361]: "Token #A-08"
                  - generic [ref=e1362]:
                    - generic [ref=e1363]:
                      - generic [ref=e1364]: Consultation Fee
                      - text: ₹2,500
                    - button "Write Review" [ref=e1366] [cursor=pointer]
                - generic [ref=e1370]:
                  - generic [ref=e1371]:
                    - generic [ref=e1372]: A
                    - generic [ref=e1373]:
                      - generic [ref=e1374]:
                        - heading "Dr. Aarav Mehta" [level=4] [ref=e1375]
                        - generic [ref=e1376]: Upcoming
                      - paragraph [ref=e1377]:
                        - generic [ref=e1378]: NEURO-ONCOLOGY
                        - generic [ref=e1379]: •
                        - generic [ref=e1380]: AIIMS Super Specialty Hospital, New Delhi
                      - generic [ref=e1381]:
                        - generic [ref=e1382]: 2026-10-12
                        - generic [ref=e1385]: 10:00 AM
                        - generic [ref=e1389]: OPD Chamber 304
                        - generic [ref=e1394]: "Token #A-08"
                  - generic [ref=e1395]:
                    - generic [ref=e1396]:
                      - generic [ref=e1397]: Consultation Fee
                      - text: ₹2,000
                    - generic [ref=e1398]:
                      - button "Digital E-Pass" [ref=e1399] [cursor=pointer]
                      - button "Cancel & Refund" [ref=e1407] [cursor=pointer]
          - generic [ref=e1413]:
            - generic [ref=e1414]:
              - generic [ref=e1415]:
                - generic [ref=e1416]: My Calendar
                - generic [ref=e1419]:
                  - generic [ref=e1420]: September 2026
                  - button "Previous Week" [ref=e1421] [cursor=pointer]
                  - button "Next Week" [ref=e1424] [cursor=pointer]
              - generic [ref=e1427]:
                - button "S 13" [ref=e1428] [cursor=pointer]:
                  - generic [ref=e1429]: S
                  - generic [ref=e1430]: "13"
                - button "M 14" [ref=e1431] [cursor=pointer]:
                  - generic [ref=e1432]: M
                  - generic [ref=e1433]: "14"
                - button "T 15" [ref=e1434] [cursor=pointer]:
                  - generic [ref=e1435]: T
                  - generic [ref=e1436]: "15"
                - button "W 16" [ref=e1437] [cursor=pointer]:
                  - generic [ref=e1438]: W
                  - generic [ref=e1439]: "16"
                - button "T 17" [ref=e1440] [cursor=pointer]:
                  - generic [ref=e1441]: T
                  - generic [ref=e1442]: "17"
                - button "F 18" [ref=e1443] [cursor=pointer]:
                  - generic [ref=e1444]: F
                  - generic [ref=e1445]: "18"
                - button "S 19" [ref=e1446] [cursor=pointer]:
                  - generic [ref=e1447]: S
                  - generic [ref=e1448]: "19"
            - generic [ref=e1449]:
              - generic [ref=e1450]:
                - generic [ref=e1451]: Schedule • Today, Sep 13
                - generic [ref=e1452]: 0 visits
              - generic [ref=e1454]:
                - paragraph [ref=e1455]: No appointments for Sep 13
                - paragraph [ref=e1456]: Your schedule is open on this date.
                - button "Book for this date" [ref=e1457] [cursor=pointer]
              - button "Book Appointment" [ref=e1461] [cursor=pointer]
            - generic [ref=e1464]:
              - generic [ref=e1465]:
                - generic [ref=e1466]: Medical Profile
                - generic [ref=e1472]:
                  - generic [ref=e1473]: ABHA Synced
                  - button "Settings" [ref=e1477] [cursor=pointer]
              - generic [ref=e1480]:
                - img "Rahul Sharma" [ref=e1482]
                - generic [ref=e1484]:
                  - heading "Rahul Sharma" [level=3] [ref=e1485]
                  - paragraph [ref=e1486]: Verified Patient
                  - paragraph [ref=e1487]: "UHID: MB-98412 • Mumbai"
              - generic [ref=e1488]:
                - generic [ref=e1489]:
                  - generic [ref=e1490]: Date Birth
                  - text: 17.07.86
                - generic [ref=e1491]:
                  - generic [ref=e1492]: Blood
                  - text: A(II) Rh+
                - generic "Blood Pressure is doctor-controlled and can only be updated by your physician" [ref=e1493] [cursor=pointer]:
                  - generic [ref=e1494]: BP (Doctor)
                  - text: 120/80
              - generic [ref=e1498]:
                - generic [ref=e1499]:
                  - generic [ref=e1500]: "Drug Allergies:"
                  - generic [ref=e1503]: Penicillin, Sulfa
                - generic [ref=e1504]:
                  - generic [ref=e1505]: "Caregiver Contact:"
                  - generic "Priya Sharma (Wife)" [ref=e1508]
                - generic [ref=e1509]:
                  - generic [ref=e1510]: "Insurance Coverage:"
                  - generic [ref=e1511]: Star Health (Active)
              - generic [ref=e1512]:
                - button "Edit Profile" [ref=e1513] [cursor=pointer]
                - button "Share Health ID" [ref=e1517] [cursor=pointer]
    - button "WhatsApp & SMS Alerts Sim" [ref=e1526] [cursor=pointer]:
      - generic [ref=e1530]: WhatsApp & SMS Alerts
      - generic [ref=e1531]: Sim
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e1540] [cursor=pointer]
  - alert [ref=e1544]: Good Day, Rahul Sharma!
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Patient Dashboard Blood Pressure Restriction & Doctor-Only Control', () => {
  4   |   test('Verify Blood Pressure is locked to Doctor Only in Patient Dashboard, while other vitals can be logged', async ({ page }) => {
  5   |     // 1. Clear session and log in as patient
  6   |     await page.context().clearCookies();
  7   |     await page.goto('/login');
  8   |     await page.fill('input[type="email"]', 'patient@example.com');
  9   |     await page.fill('input[type="password"]', 'Patient123!');
  10  |     await page.click('button[type="submit"]');
  11  |     await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  12  | 
  13  |     // 2. Locate Patient Clinical Health Vitals section
  14  |     await expect(page.getByText('Clinical Health Vitals')).toBeVisible({ timeout: 10000 });
  15  | 
  16  |     // 3. Verify Blood Pressure card has "Doctor Only" badge and Lock icon
  17  |     const bpCard = page.getByTestId('vital-card-bp');
  18  |     await expect(bpCard).toBeVisible();
  19  |     await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();
  20  |     await expect(bpCard.getByText('Doctor Only')).toBeVisible();
  21  | 
  22  |     // 4. Click on the Blood Pressure tile directly -> should show info toast
  23  |     await bpCard.click();
  24  |     await expect(page.getByText(/Blood Pressure is a physician-verified clinical vital/i)).toBeVisible();
  25  | 
  26  |     // Take screenshot of Patient Vitals Card with Doctor Only badge
  27  |     await page.screenshot({
  28  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_vitals_doctor_only_badge.png',
  29  |     });
  30  | 
  31  |     // 5. Click "Log Vitals" button to open Patient Log Daily Wellness Vitals modal
> 32  |     await page.getByTestId('log-vitals-btn').click();
      |                                              ^ Error: locator.click: Test timeout of 60000ms exceeded.
  33  |     await expect(page.getByText('Log Daily Wellness Vitals')).toBeVisible({ timeout: 10000 });
  34  | 
  35  |     // 6. Verify the Doctor-Controlled Notice Callout is displayed
  36  |     await expect(page.getByText('Blood Pressure is Doctor-Controlled Only')).toBeVisible();
  37  |     await expect(page.getByText(/blood pressure must be measured and entered exclusively by your certified doctor/i)).toBeVisible();
  38  | 
  39  |     // 7. Verify Blood Pressure input is strictly DISABLED / LOCKED
  40  |     const lockedBpInput = page.getByTestId('patient-bp-input-locked');
  41  |     await expect(lockedBpInput).toBeVisible();
  42  |     await expect(lockedBpInput).toBeDisabled();
  43  |     await expect(page.getByText('Locked (Doctor Only)')).toBeVisible();
  44  | 
  45  |     // Take screenshot of Log Vitals Modal showing locked BP
  46  |     await page.screenshot({
  47  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_log_vitals_locked_bp_modal.png',
  48  |     });
  49  | 
  50  |     // 8. Update editable patient parameters (Heart Rate and Blood Sugar)
  51  |     const hrInput = page.getByTestId('patient-hr-input');
  52  |     await hrInput.clear();
  53  |     await hrInput.fill('78');
  54  | 
  55  |     const sugarInput = page.getByTestId('patient-glucose-input');
  56  |     await sugarInput.clear();
  57  |     await sugarInput.fill('96');
  58  | 
  59  |     // 9. Click "Save Daily Vitals"
  60  |     await page.getByTestId('patient-save-vitals-btn').click();
  61  | 
  62  |     // 10. Verify success toast stating Blood Pressure remains certified by doctor
  63  |     await expect(page.getByText(/Daily vitals recorded successfully! Blood pressure remains certified by your doctor/i)).toBeVisible({ timeout: 10000 });
  64  | 
  65  |     // 11. Verify updated values on dashboard: Heart Rate is 78, Glucose is 96, BP remains doctor-controlled
  66  |     await expect(page.getByTestId('vital-card-pulse').getByText('78')).toBeVisible();
  67  |     await expect(page.getByTestId('vital-card-glucose').getByText('96')).toBeVisible();
  68  |     await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();
  69  | 
  70  |     // Take screenshot after saving home vitals
  71  |     await page.screenshot({
  72  |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_vitals_after_self_log.png',
  73  |     });
  74  |   });
  75  | 
  76  |   test('Doctor can update Blood Pressure in Doctor Dashboard and syncs to Patient Dashboard', async ({ page }) => {
  77  |     // 1. Log in as Doctor
  78  |     await page.context().clearCookies();
  79  |     await page.goto('/login');
  80  |     await page.fill('input[type="email"]', 'vikramaditya@example.com');
  81  |     await page.fill('input[type="password"]', 'Doctor123!');
  82  |     await page.click('button[type="submit"]');
  83  |     await expect(page).toHaveURL(/.*doctor\/dashboard/, { timeout: 15000 });
  84  | 
  85  |     // 2. Click "Patient Care & Prescriptions" tab in doctor dashboard
  86  |     await page.getByRole('button', { name: /Patient Care & Prescriptions/i }).first().click();
  87  | 
  88  |     // 3. Open Clinical Care modal for Rahul Sharma
  89  |     const rahulCard = page.locator('div:has-text("Rahul Sharma")').first();
  90  |     await expect(rahulCard).toBeVisible({ timeout: 10000 });
  91  |     const careBtn = page.getByRole('button', { name: /Prescribe & Record Vitals/i }).first();
  92  |     await careBtn.click();
  93  | 
  94  |     // 4. Verify DoctorPatientCareModal opens
  95  |     await expect(page.getByText('Clinical Care & Prescriptions')).toBeVisible({ timeout: 10000 });
  96  | 
  97  |     // 5. Switch to "Diagnosis & Clinical Vitals" tab
  98  |     await page.getByRole('button', { name: /Diagnosis & Clinical Vitals/i }).click();
  99  | 
  100 |     // Verify Doctor Only badge is on the Doctor's BP input
  101 |     await expect(page.getByTestId('doctor-bp-input')).toBeVisible();
  102 | 
  103 |     // Update Blood Pressure to 126/82
  104 |     await page.getByTestId('doctor-bp-input').clear();
  105 |     await page.getByTestId('doctor-bp-input').fill('126/82');
  106 | 
  107 |     // Take screenshot of Doctor modifying Blood Pressure
  108 |     await page.screenshot({
  109 |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/doctor_updating_blood_pressure.png',
  110 |     });
  111 | 
  112 |     // Save to Patient Dashboard
  113 |     await page.getByRole('button', { name: /Save to Patient Dashboard/i }).click();
  114 |     await expect(page.getByText(/Clinical care plan/i)).toBeVisible({ timeout: 10000 });
  115 |     await page.waitForTimeout(1000);
  116 | 
  117 |     // 6. Clear session cookies and log back in as Patient to verify synced Doctor BP
  118 |     await page.context().clearCookies();
  119 |     await page.goto('/login');
  120 |     await page.fill('input[type="email"]', 'patient@example.com');
  121 |     await page.fill('input[type="password"]', 'Patient123!');
  122 |     await page.click('button[type="submit"]');
  123 |     await expect(page).toHaveURL(/.*dashboard/, { timeout: 15000 });
  124 | 
  125 |     // 7. Verify Patient sees the newly updated 126/82 from the Doctor
  126 |     const bpCard = page.getByTestId('vital-card-bp');
  127 |     await expect(bpCard.getByText('126/82')).toBeVisible({ timeout: 10000 });
  128 |     await expect(bpCard.getByTestId('bp-doctor-only-badge')).toBeVisible();
  129 | 
  130 |     // Take screenshot of Patient Dashboard showing Doctor-synced 126/82 BP
  131 |     await page.screenshot({
  132 |       path: '/Users/apple/.gemini/antigravity/brain/783b71d3-6110-4e29-a4eb-2f2899ecfde5/patient_dashboard_synced_doctor_bp.png',
```