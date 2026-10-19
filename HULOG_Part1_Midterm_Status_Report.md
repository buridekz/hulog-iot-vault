# HULOG Part 1 Midterm Status Report

Plain-text copy of the 16 October 2026 revision. The formatted submission, with the drawn figures, is HULOG_Part1_Midterm_Status_Report.pdf. Edit the HTML file, then reprint that PDF.

HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault




      University of Makati
      College of Computing and Information Sciences
      Bachelor of Science in Information Technology




        HULOG: IoT-Enabled Dynamic QR Parcel Drop Vault

        for Residential Gates and Boarding Houses


        A Project Research Status Report Submitted to the Faculty of the

        College of Computing and Information Sciences

        University of Makati

        In Partial Fulfillment of the Requirements for the Course

        Technopreneurship & Real-Time Systems (RTS)

        Academic Year 2026-2027




      Course Professor:
      Engr. Bhai Nhuraisha I. Deplomo, PECE, MSEcE, MSCIT

        Researchers / Proponents:

        Camarador, Jhorenz S.

        Corpuz, Lance Josh M.

        Goze, AJ M.

        Luzano, Justin Mark D.

      16 October 2026





Executive Summary



    Daily courier stops have become part of household life in Philippine cities, and the fragile moment is the last one: the rider at a gate when nobody is home. Parcels are left on a fence ledge, dropped over the gate, or passed to a neighbor. Rain, heat, and theft sit on the other side of that habit. A padlock cannot be lent to a different rider every afternoon. A QR sticker on a bin can be photographed once and reused later.



    HULOG is a drop vault for a house gate or a boarding-house entrance. The owner creates a 6-digit PIN and a matching QR pass from a web page. The pass is designed to live for 15 or 30 minutes and to die after one completed door cycle. The rider types the PIN on a keypad, or opens the pass in the phone browser, and does not install an app. A 12 V door solenoid, switched by a relay, releases the latch. A magnetic reed switch and an infrared proximity sensor are there to confirm that the door opened, that a parcel is in the bay, and that the door shut again.



    As of 16 October 2026 the purchased parts are in hand, the web portal and the hardware simulator run, and the ESP32 sketch on the bench already reads the keypad, the reed switch, and the proximity sensor, drives the OLED, and pulses the relay. That sketch still accepts a fixed test PIN. Wi-Fi, the expiring pass, and the Telegram notice are specified and are not in the flashed program yet. Six completed checkouts for the lock, sensors, power, display, and wire came to PHP 1,185.00. The listed product prices inside those orders sum to PHP 1,124.00. The ESP32 board, its GPIO expansion board, and the keypad were already on hand and are outside both figures.




Chapter 1: Introduction and Problem Context



1.1 Problem Background



    The Department of Trade and Industry, in the logistics section of the E-Commerce Philippines 2022 Roadmap, treats last-mile delivery as a constraint on online trade. The roadmap names a shortage of motorcycle couriers, worsening traffic, and the extra risk riders carry when they must collect cash on delivery (Department of Trade and Industry, 2022). Those are system problems. The failure this project is built for is smaller and closer to the door.



    In a gated house, a townhouse, or a student boarding house, the recipient is often at work or in class during the hours when Shopee Xpress, J&T Express, Flash Express, Grab, and Lalamove riders are on the street. The rider is on a quota and will not wait. The usual fixes fail for mechanical reasons. A key cannot be passed safely to a rotating set of riders. A static PIN, once seen, stays valid until someone remembers to change it. A printed QR code is only an image: whoever photographs it can present it again.



    What the household needs is a box at the gate that a stranger can open once, for a short time, without an account in a courier app, and that can show the owner the door was shut on a parcel. The box also has to be buildable from parts sold in Metro Manila.




1.2 Objectives



The project will design, build, and evaluate HULOG, a household parcel vault that accepts one delivery through a short-lived PIN or QR pass while the recipient is away.


- Lock drive. Switch a 12 V door solenoid from an ESP32 through a 1-channel optocoupler relay, so the microcontroller pin never carries the lock current.

- Door and parcel check. Use the normally open lead of a magnetic reed set, and an infrared proximity module aimed at the bay, before a pass is treated as spent.

- Single-use pass. Issue a 6-digit PIN and a QR symbol with a life of 15 or 30 minutes, and invalidate that pass after one completed door cycle. This is the design target. The bench sketch does not enforce it yet.

- Two web pages. Give the owner a page that mints passes, and give the rider a browser page that needs no installed app.

- One adapter, two rails, real prices. Feed the lock from a 12 V 2 A adapter and the logic from an LM2596 set to 5 V, and report the cost from the receipts rather than from a catalog guess.




1.3 Significance of the Study



- Households and boarding-house tenants get a place to receive a prepaid parcel when they are not at the gate.

- Riders and sellers get a stop that can end without a wait, plus a door-and-sensor record that a porch photo does not provide.

- Local builders get a worked example of a gate box made from modules sold in Manila, with the peso amounts taken from completed orders.




1.4 Scope and Delimitation



    The prototype is a tabletop vault for a small or medium prepaid parcel. The controller is an ESP32 development board seated on a GPIO expansion board. The expansion board does not create new GPIO numbers. It brings the existing pins out to headers that are easier to wire, which is why the kit includes both female-to-female and female-to-male jumpers. The door carries a 4x4 membrane keypad and a 0.96-inch SSD1306 OLED (128x64, blue). The owner's page and the rider's page are a React, Vite, and TypeScript application. Telegram is the planned notice channel.



    The vault does not cool food. Cash-on-delivery is outside the cycle, because the box cannot take money. There is no GSM radio. The intended link is household Wi-Fi. The program on the bench today does not join that network yet. The wooden or acrylic enclosure is not on the receipts and is scheduled after this report.




Chapter 2: Review of Related Literature and Studies



2.1 The Last Mile, and the Philippine Constraint



    Gevaers, Van de Voorde, and Vanelslander (2014) describe the last mile of business-to-consumer delivery as one of the more expensive, least efficient, and most polluting stretches of the whole chain. Their point is about cost and wasted trips, not about a specific city. It still names the stretch this project sits on: the final handoff, where a failed meeting between rider and recipient turns into another attempt.



    The Philippine policy document that speaks directly to that stretch is the Department of Trade and Industry's E-Commerce Philippines 2022 Roadmap. Its logistics page says e-fulfillment and last-mile service are held back by a lack of motorcycle couriers, by traffic congestion, and by the risk cash-on-delivery places on the rider (Department of Trade and Industry, 2022). The roadmap does not publish a count of parcels left on gates. That local picture, in Section 1.1, is the setting the proponents are designing for. The roadmap is used here only for the constraints it actually states.




2.2 Lockers, Pickup Points, and a Box at the House



    Morganti, Seidel, Blanquart, Dablanc, and Lenz (2014) compare two European answers to home delivery: a pickup counter inside a shop, and an automated locker bank. They note that shoppers still prefer delivery to the door, and that this preference breaks parcel flow into many small urban stops. Iwan, Kijewska, and Lemke (2016) study InPost lockers in Poland and treat the locker as a way to make the courier's round more productive. In both studies the household still has to travel to a shared machine. A locker on a petrol-station forecourt does not solve a boarding house whose residents are in class, and a dense barangay often has no sidewalk wide enough for a bank of steel doors.



    Punakivi, Yrjola, and Holmstrom (2001) move the box to the house. They compare a reception box installed at the home with a carrier-owned delivery box. In their grocery simulation, unattended reception cut home-delivery transport cost by up to 60 percent against attended delivery. They also show the limit of that result. The saving depended on the resident paying for and keeping a box, and the reception box they modeled was often refrigerated. HULOG keeps the idea that the secure point is at the home, and drops the cold box. A shirt or a phone case does not need refrigeration, and Section 1.4 excludes groceries for that reason. What the 2001 study does not give is a way for a rotating set of local riders to open the door without a key and without a dedicated courier application.




2.3 A Code That Must Expire



    Focardi, Luccio, and Wahsheh (2019) show that an ordinary QR symbol has no standard proof of who created it or whether it is still the symbol the owner issued. People scan what is in front of them. For a parcel box, that finding has a direct physical form: a sticker that never changes can be copied with a camera and shown again on another day. A fixed keypad PIN has the same shape of failure. Once a rider has seen it, it remains valid until a person changes it.



    M'Raihi, Machani, Pei, and Rydell (2011), in RFC 6238, specify the time-based one-time password. The code is valid only inside a short time step, so a value someone has already seen does not stay useful. HULOG's design follows that limit and adds a stricter one. The pass should also be marked used when the door cycle finishes, so it cannot be replayed inside the time window. The bench sketch does not compute RFC 6238. It compares the keys with a fixed test PIN. Section 3.7 states that gap in the open, because a status report that hides it would describe a different machine from the one on the bench.




2.4 Why the Lock Is Not on a Timer Alone



    A solenoid that releases for a few seconds and then drives again, with no knowledge of the door, can extend the bolt while the door is still open. The next slam seats the bolt against the frame instead of into the strike. A notice sent at the moment the PIN is accepted can also report a delivery that never entered the box. The reed switch answers a yes-or-no question about the door: it left the frame, and it returned. The proximity module answers a different question: an object is in front of the sensor, in the bay. The purchased module is a reflective infrared sensor, not a separate lamp and detector across the opening. It has to be aimed at the spot where the parcel sits. The pass should be spent only after both answers have arrived, in that order. That rule is the design. The bench sketch already reads both sensors. It does not yet retire a minted pass, because it does not yet hold one.




2.5 Synthesis and Research Gap



    The literature supports three separate claims, and it does not assemble them into one device. The last mile is costly and, in the Philippines, operationally tight (Gevaers et al., 2014; Department of Trade and Industry, 2022). Shared lockers help the courier and still ask the resident to travel (Morganti et al., 2014; Iwan et al., 2016). A box at the house can remove that trip, at the resident's expense, and the studied version was aimed at cold groceries (Punakivi et al., 2001). A visible QR code is easy to copy because the symbol itself carries no proof of origin (Focardi et al., 2019), and a time-step password is the standard remedy for a code that must die (M'Raihi et al., 2011).



    The gap HULOG is built to fill is a non-refrigerated box at a Philippine gate or boarding-house door, opened by a pass the rider already has in a message, with no courier application, using the modules in Table 1. The cost claim in this report is the receipt total, not a retail price. Selling price, labor, and the enclosure belong in Chapter 4, after those costs exist.




Chapter 3: Methodology and Technical Design



3.1 Parts Actually in Hand



    Table 1 lists the parts from six completed orders, plus the controller and the keypad, which were already with the group. Sellers are MakerLab, Tool Corner, and ENG LAB.ph. The peso amounts in the Unit and Line columns are the product prices shown on those orders. They are not catalog estimates from an earlier draft.




Table 1


Purchased parts and parts already on hand




         | No.
         | Component
         | Seller
         | Qty
         | Unit (PHP)
         | Line (PHP)





         | 1
         | Active buzzer driver moduleHigh-current module, blue board
         | MakerLab
         | 1
         | 35.00
         | 35.00



         | 2
         | LM2596 buck converterDC-DC step-down module
         | MakerLab
         | 1
         | 49.00
         | 49.00



         | 3
         | Dupont jumpers, female-to-female20 cm set
         | MakerLab
         | 1
         | 59.00
         | 59.00



         | 4
         | Dupont jumpers, female-to-male20 cm set
         | MakerLab
         | 2
         | 59.00
         | 118.00



         | 5
         | Solenoid door lock12 V DC, for doors
         | MakerLab
         | 1
         | 310.00
         | 310.00



         | 6
         | Relay module1-channel, 5 V coil, optocoupler
         | MakerLab
         | 1
         | 49.00
         | 49.00



         | 7
         | DC power adapter12 V, 2 A
         | MakerLab
         | 1
         | 145.00
         | 145.00



         | 8
         | Infrared proximity moduleReflective obstacle sensor
         | MakerLab
         | 1
         | 28.00
         | 28.00



         | 9
         | DC barrel jack, female5.5 x 2.1 mm, screw terminals
         | Tool Corner
         | 3
         | 7.00
         | 21.00



         | 10
         | OLED display0.96 in, SSD1306, 128x64, blue, I2C
         | ENG LAB.ph
         | 1
         | 145.00
         | 145.00



         | 11
         | Magnetic door reed setNO and NC leads, with magnet
         | MakerLab
         | 1
         | 165.00
         | 165.00



         |
         | Listed product prices, items 1-11
         | 1,124.00



         | 12
         | ESP32 development boardSeated on a GPIO expansion board. Already on hand. No receipt in this set.
         | On hand
         | 1
         | -
         | -



         | 13
         | Membrane keypad4x4, already on hand. No receipt in this set.
         | On hand
         | 1
         | -
         | -






    The six checkout totals were PHP 583.00 (buzzer, buck, both jumper sets, and solenoid), PHP 202.00 (relay and adapter), PHP 28.00 (proximity module), PHP 53.00 (three jacks), PHP 145.00 (OLED), and PHP 174.00 (reed set). Those payments sum to PHP 1,185.00. The PHP 61.00 difference from the listed product prices is shipping and other checkout charges, mostly on the jack order, whose shelf price was PHP 7.00 each after a discount from PHP 25.00. Items 12 and 13 are omitted from both totals because this report has no receipt for them. The enclosure, hinges, and the 1N4007 flyback diode are not in the orders. The diode is specified in Figure 2 and should be fitted before the coil is pulsed repeatedly.




3.2 How a Drop Is Arranged



    Figure 1 is the arrangement, not a claim that every arrow is already live. The owner's page and the rider's page exist. The link from the vault to Telegram does not. The ESP32 drawn at the side of the box is the board on the expansion headers. The keypad and the OLED are on the outside of the door, where the rider can reach them. The reed set sits on the door gap. The proximity module looks into the bay. The solenoid sits at the strike.




[Figure drawn in the PDF]

    Figure 1. People, pass, and part placement for one drop. The Telegram link in step 2 is drawn as a plan. It is not in the flashed sketch.




3.3 Power and Lock Circuit



    One 12 V 2 A adapter feeds two rails, drawn in Figure 2. The red rail is the lock. It goes to the relay's common contact, through the normally open contact, and through the solenoid coil to ground. The blue rail is logic. An LM2596 module steps 12 V down to 5 V for the ESP32 VIN pin, the relay-module supply, and the buzzer module. The OLED and the proximity module take 3.3 V from the ESP32, so their outputs cannot rise above the pin rating. GPIO 23 goes only to the relay input. It is an active-low signal. It does not join the red wire.



    The LM2596 often ships with its output set near the input voltage. The output is measured and set to 5.0 V before the ESP32 is connected. The solenoid's coil current is not printed on the receipt. It will be measured on the bench before long pulses, against the 2 A rating of the adapter. A 1N4007 is drawn across the coil, band toward the 12 V side, so the spike from the collapsing field has a path that is not the relay contact. That diode was not in the orders.




[Figure drawn in the PDF]

    Figure 2. Dual-rail supply and lock circuit. The optocoupler keeps the ESP32 pin on the logic side of the relay. The flyback diode is specified and was not on the receipts.




3.4 Pin Map



    Table 2 is the map in the bench sketch. GPIO 0, GPIO 2, and GPIO 15 are left free because they are sampled at boot. GPIO 12 is also a boot pin, and the keypad does use it as row 2. That row must sit low while the board starts. If it is pulled high at reset, the ESP32 can fail to boot. The reed set sold to the group has both a normally open lead and a normally closed lead. The sketch uses the normally open lead with the internal pull-up, so GPIO 19 reads low when the magnet is against the switch, which is the shut door. The normally closed lead is left unconnected.




Table 2


ESP32 GPIO map used by the bench sketch




         | Device
         | ESP32 pin
         | What the wire does





         | Relay input
         | GPIO 23
         | Output, active low. Signal into the optocoupler only.



         | OLED SDA / SCL
         | GPIO 21 / GPIO 22
         | I2C. Power the display from the 3.3 V pin.



         | Reed switch, NO lead
         | GPIO 19
         | Input with pull-up. Low means the door is shut.



         | IR proximity output
         | GPIO 18
         | Input. Low means an object is in front of the sensor. Power the module from 3.3 V.



         | Buzzer module input
         | GPIO 5
         | Output. High sounds the module. Module supply is the 5 V rail.



         | Keypad rows
         | GPIO 13, 12, 14, 27
         | Row scan. GPIO 12 must not be high at boot.



         | Keypad columns
         | GPIO 26, 25, 33, 32
         | Column inputs with internal pull-ups.



         | LM2596 output
         | VIN and GND
         | 5.0 V into the board's 5 V input, after the meter check. Not into a GPIO pin.






    If the proximity module will not detect at 3.3 V on the bench, it may be powered from 5 V only with a resistor divider on its output before GPIO 18. A 5 V high straight into an ESP32 pin is outside the pin rating.




3.5 What the Bench Sketch Actually Does



    Figure 3 follows *firmware/src/main.cpp* as it stands. Solid boxes run today. The dashed box is the design target from Section 1.2 and is not in the flashed loop. A 30-second timeout returns the vault to idle if the door cycle is not finished. If the door shuts and the infrared sensor never saw a parcel, the sketch returns to idle and does not treat the cycle as a delivery. The confirmation screen says the door cycle is done. It does not say that a Telegram message was sent.




[Figure drawn in the PDF]

    Figure 3. Door cycle in the current firmware. Expiring passes and Telegram are specified beside it and are not executed by this loop.




3.6 Software Beside the Sketch



    The web application in *hulog-web/* is the owner's page, the rider's browser page, and a simulator of the vault. It is built with React 18, Vite, and TypeScript. The design target for a pass is 15 or 30 minutes. The simulator still uses a longer demonstration lifetime, so a defense demo of the page is not yet proof that the 15-minute rule is enforced. The firmware is an Arduino-framework sketch under PlatformIO. It uses the SSD1306 library for the display and the keypad library for the matrix. It does not open Wi-Fi, it does not write a pass to flash, and it does not call Telegram.





3.7 Implementation Status



Table 3 is the status on 16 October 2026. A row marked designed is a specification, not a finished test.


Table 3


What is done, what is only specified




         | Piece
         | Standing
         | Evidence





         | Receipt parts, items 1-11
         | Purchased
         | Six completed orders, PHP 1,185.00 paid.



         | ESP32, expansion board, keypad
         | On hand
         | Used by the bench sketch. Prices are not in this receipt set.



         | Repository and notes
         | In use
         | Public repository *buridekz/hulog-iot-vault*, with wiring and architecture notes.



         | Web portal and simulator
         | Built
         | *hulog-web/*. The simulator lifetime is still a demo window.



         | Bench sketch
         | Running its loop
         | Keypad, OLED, reed, IR, 3-second relay pulse, 5-minute lockout, fixed test PIN.



         | Wi-Fi, minted pass, Telegram
         | Designed
         | No network calls in the flashed sketch. Figure 3 marks this box as dashed.



         | Flyback diode
         | Specified
         | Not on the receipts. Fit a 1N4007 before repeated coil pulses.



         | Enclosure
         | Not started
         | No box or hinges on the receipts. Scheduled after this report.








3.8 Next Steps for Part 2



- Set the LM2596 to 5.0 V with a meter, then wire the expansion board, relay, reed (NO lead), proximity module, OLED, buzzer, and solenoid as in Figure 2 and Table 2.

- Fit the 1N4007 across the coil. Measure the coil current. Confirm that GPIO 12 is low at boot.

- Run the door cycle on the bench: good PIN, bad PIN three times, door shut with no parcel, door shut with the IR covered, and the 30-second timeout.

- Replace the fixed test PIN with the minted 15- or 30-minute pass, then send the Telegram notice only after the door-and-parcel check.

- Build the tabletop enclosure and write Chapter 4 from the receipt totals in Table 1, plus the ESP32, the keypad, the enclosure, and labor. Do not price the product from the electronics lines alone.




References



- Department of Trade and Industry. (2022). *E-Commerce Philippines 2022 roadmap: Logistics*. https://ecommerce.dti.gov.ph/madali/logistics.html

- Focardi, R., Luccio, F. L., & Wahsheh, H. A. M. (2019). Usable security for QR code. *Journal of Information Security and Applications, 48*, Article 102369. https://doi.org/10.1016/j.jisa.2019.102369

- Gevaers, R., Van de Voorde, E., & Vanelslander, T. (2014). Cost modelling and simulation of last-mile characteristics in an innovative B2C supply chain environment with implications on urban areas and cities. *Procedia - Social and Behavioral Sciences, 125*, 398-411. https://doi.org/10.1016/j.sbspro.2014.01.1483

- Iwan, S., Kijewska, K., & Lemke, J. (2016). Analysis of parcel lockers' efficiency as the last mile delivery solution - The results of the research in Poland. *Transportation Research Procedia, 12*, 644-655. https://doi.org/10.1016/j.trpro.2016.02.018

- M'Raihi, D., Machani, S., Pei, M., & Rydell, J. (2011). *TOTP: Time-based one-time password algorithm* (RFC 6238). Internet Engineering Task Force. https://doi.org/10.17487/RFC6238

- Morganti, E., Seidel, S., Blanquart, C., Dablanc, L., & Lenz, B. (2014). The impact of e-commerce on final deliveries: Alternative parcel delivery services in France and Germany. *Transportation Research Procedia, 4*, 178-190. https://doi.org/10.1016/j.trpro.2014.11.014

- Punakivi, M., Yrjola, H., & Holmstrom, J. (2001). Solving the last mile issue: Reception box or delivery box? *International Journal of Physical Distribution & Logistics Management, 31*(6), 427-439. https://doi.org/10.1108/09600030110399423
