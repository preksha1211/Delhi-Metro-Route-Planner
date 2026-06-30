const mongoose = require("mongoose");
require("dotenv").config();

const Station = require("./models/Stations");
const Connection = require("./models/Connection");

// ═══════════════════════════════════════════════════════════════
//  STATIONS DATA
//  Format: { name, line }
//  Interchange stations appear multiple times (once per line)
// ═══════════════════════════════════════════════════════════════

const stations = [
    // ── YELLOW LINE (Samaypur Badli ↔ HUDA City Centre) ──────────
    { name: "Samaypur Badli", line: "Yellow" },
    { name: "Rohini Sector 18 19", line: "Yellow" },
    { name: "Haiderpur Badli Mor", line: "Yellow" },
    { name: "Jahangirpuri", line: "Yellow" },
    { name: "Adarsh Nagar", line: "Yellow" },
    { name: "Azadpur", line: "Yellow" },
    { name: "Model Town", line: "Yellow" },
    { name: "GTB Nagar", line: "Yellow" },
    { name: "Vishwa Vidyalaya", line: "Yellow" },
    { name: "Vidhan Sabha", line: "Yellow" },
    { name: "Civil Lines", line: "Yellow" },
    { name: "Kashmere Gate", line: "Yellow" },   // interchange Red, Yellow
    { name: "Chandni Chowk", line: "Yellow" },
    { name: "Chawri Bazar", line: "Yellow" },
    { name: "New Delhi", line: "Yellow" },        // interchange Airport
    { name: "Rajiv Chowk", line: "Yellow" },      // interchange Blue
    { name: "Patel Chowk", line: "Yellow" },
    { name: "Central Secretariat", line: "Yellow" }, // interchange Violet
    { name: "Udyog Bhawan", line: "Yellow" },
    { name: "Lok Kalyan Marg", line: "Yellow" },
    { name: "Jor Bagh", line: "Yellow" },
    { name: "INA", line: "Yellow" },              // interchange Pink
    { name: "AIIMS", line: "Yellow" },
    { name: "Green Park", line: "Yellow" },
    { name: "Hauz Khas", line: "Yellow" },        // interchange Magenta
    { name: "Malviya Nagar", line: "Yellow" },
    { name: "Saket", line: "Yellow" },
    { name: "Qutab Minar", line: "Yellow" },
    { name: "Chhattarpur", line: "Yellow" },
    { name: "Sultanpur", line: "Yellow" },
    { name: "Ghitorni", line: "Yellow" },
    { name: "Arjan Garh", line: "Yellow" },
    { name: "Guru Dronacharya", line: "Yellow" },
    { name: "Sikandarpur", line: "Yellow" },
    { name: "MG Road", line: "Yellow" },
    { name: "IFFCO Chowk", line: "Yellow" },
    { name: "HUDA City Centre", line: "Yellow" },

    // ── BLUE LINE (Dwarka Sector 21 ↔ Noida Electronic City / Vaishali) ──
    { name: "Dwarka Sector 21", line: "Blue" },   // interchange Airport
    { name: "Dwarka Sector 8", line: "Blue" },
    { name: "Dwarka Sector 9", line: "Blue" },
    { name: "Dwarka Sector 10", line: "Blue" },
    { name: "Dwarka Sector 11", line: "Blue" },
    { name: "Dwarka Sector 12", line: "Blue" },
    { name: "Dwarka Sector 13", line: "Blue" },
    { name: "Dwarka Sector 14", line: "Blue" },
    { name: "Dwarka", line: "Blue" },
    { name: "Dwarka Mor", line: "Blue" },
    { name: "Nawada", line: "Blue" },
    { name: "Uttam Nagar West", line: "Blue" },
    { name: "Uttam Nagar East", line: "Blue" },
    { name: "Janakpuri West", line: "Blue" },
    { name: "Janakpuri East", line: "Blue" },
    { name: "Tilak Nagar", line: "Blue" },
    { name: "Subhash Nagar", line: "Blue" },
    { name: "Tagore Garden", line: "Blue" },
    { name: "Rajouri Garden", line: "Blue" },     // interchange Pink
    { name: "Ramesh Nagar", line: "Blue" },
    { name: "Moti Nagar", line: "Blue" },
    { name: "Kirti Nagar", line: "Blue" },        // interchange Green
    { name: "Shadipur", line: "Blue" },
    { name: "Patel Nagar", line: "Blue" },
    { name: "Rajendra Place", line: "Blue" },
    { name: "Karol Bagh", line: "Blue" },
    { name: "Jhandewalan", line: "Blue" },
    { name: "RK Ashram Marg", line: "Blue" },
    { name: "Rajiv Chowk", line: "Blue" },        // interchange Yellow
    { name: "Barakhamba Road", line: "Blue" },
    { name: "Mandi House", line: "Blue" },        // interchange Violet
    { name: "Pragati Maidan", line: "Blue" },
    { name: "Indraprastha", line: "Blue" },
    { name: "Yamuna Bank", line: "Blue" },        // branch point
    // Branch 1: Vaishali
    { name: "Karkarduma", line: "Blue" },
    { name: "Karkarduma Court", line: "Blue" },
    { name: "Anand Vihar ISBT", line: "Blue" },   // interchange Pink
    { name: "Kaushambi", line: "Blue" },
    { name: "Vaishali", line: "Blue" },
    // Branch 2: Noida
    { name: "Akshardham", line: "Blue" },
    { name: "Mayur Vihar Phase 1", line: "Blue" },
    { name: "Mayur Vihar Extension", line: "Blue" },
    { name: "New Ashok Nagar", line: "Blue" },
    { name: "Noida Sector 15", line: "Blue" },
    { name: "Noida Sector 16", line: "Blue" },
    { name: "Noida Sector 18", line: "Blue" },
    { name: "Botanical Garden", line: "Blue" },
    { name: "Golf Course", line: "Blue" },
    { name: "Noida City Centre", line: "Blue" },
    { name: "Noida Sector 34", line: "Blue" },
    { name: "Noida Sector 52", line: "Blue" },
    { name: "Noida Sector 61", line: "Blue" },
    { name: "Noida Sector 59", line: "Blue" },
    { name: "Noida Sector 62", line: "Blue" },
    { name: "Noida Electronic City", line: "Blue" },

    // ── RED LINE (Rithala ↔ Shaheed Sthal) ──────────────────────
    { name: "Rithala", line: "Red" },
    { name: "Rohini West", line: "Red" },
    { name: "Rohini East", line: "Red" },
    { name: "Pitam Pura", line: "Red" },
    { name: "Kohat Enclave", line: "Red" },
    { name: "Netaji Subhash Place", line: "Red" }, // interchange Pink
    { name: "Keshav Puram", line: "Red" },
    { name: "Kanhaiya Nagar", line: "Red" },
    { name: "Inderlok", line: "Red" },             // interchange Green
    { name: "Shastri Nagar", line: "Red" },
    { name: "Pratap Nagar", line: "Red" },
    { name: "Pulbangash", line: "Red" },
    { name: "Tis Hazari", line: "Red" },
    { name: "Kashmere Gate", line: "Red" },        // interchange Yellow
    { name: "Shastri Park", line: "Red" },
    { name: "Seelampur", line: "Red" },
    { name: "Welcome", line: "Red" },              // interchange Pink
    { name: "Shahdara", line: "Red" },
    { name: "Mansarovar Park", line: "Red" },
    { name: "Jhilmil", line: "Red" },
    { name: "Dilshad Garden", line: "Red" },
    { name: "Shaheed Nagar", line: "Red" },
    { name: "Shaheed Sthal", line: "Red" },

    // ── GREEN LINE (Inderlok ↔ Brigadier Hoshiyar Singh) ─────────
    { name: "Inderlok", line: "Green" },           // interchange Red
    { name: "Ashok Park Main", line: "Green" },
    { name: "Punjabi Bagh West", line: "Green" },
    { name: "ESI Hospital", line: "Green" },
    { name: "Rajouri Garden", line: "Green" },     // interchange Blue, Pink
    { name: "Madipur", line: "Green" },
    { name: "Paschim Vihar East", line: "Green" },
    { name: "Paschim Vihar West", line: "Green" },
    { name: "Peeragarhi", line: "Green" },
    { name: "Udyog Nagar", line: "Green" },
    { name: "Surajmal Stadium", line: "Green" },
    { name: "Nangloi", line: "Green" },
    { name: "Nangloi Railway Station", line: "Green" },
    { name: "Rajdhani Park", line: "Green" },
    { name: "Mundka", line: "Green" },
    { name: "Mundka Industrial Area", line: "Green" },
    { name: "Ghevra", line: "Green" },
    { name: "Tikri Kalan", line: "Green" },
    { name: "Tikri Border", line: "Green" },
    { name: "Pandit Shree Ram Sharma", line: "Green" },
    { name: "Bahadurgarh City", line: "Green" },
    { name: "Brigadier Hoshiyar Singh", line: "Green" },
    // Green branch: Kirti Nagar ↔ Inderlok
    { name: "Kirti Nagar", line: "Green" },        // interchange Blue
    { name: "Satguru Ram Singh Marg", line: "Green" },
    { name: "Nangloi", line: "Green" },

    // ── VIOLET LINE (Kashmere Gate ↔ Raja Nahar Singh) ──────────
    { name: "Kashmere Gate", line: "Violet" },
    { name: "Lal Quila", line: "Violet" },
    { name: "Jama Masjid", line: "Violet" },
    { name: "Delhi Gate", line: "Violet" },
    { name: "ITO", line: "Violet" },
    { name: "Mandi House", line: "Violet" },       // interchange Blue
    { name: "Janpath", line: "Violet" },
    { name: "Central Secretariat", line: "Violet" }, // interchange Yellow
    { name: "Khan Market", line: "Violet" },
    { name: "Jawaharlal Nehru Stadium", line: "Violet" },
    { name: "Jangpura", line: "Violet" },
    { name: "Lajpat Nagar", line: "Violet" },      // interchange Pink
    { name: "Moolchand", line: "Violet" },
    { name: "Kailash Colony", line: "Violet" },
    { name: "Nehru Place", line: "Violet" },
    { name: "Kalkaji Mandir", line: "Violet" },
    { name: "Govindpuri", line: "Violet" },
    { name: "Harkesh Nagar Okhla", line: "Violet" },
    { name: "Jasola Apollo", line: "Violet" },
    { name: "Sarita Vihar", line: "Violet" },
    { name: "Mohan Estate", line: "Violet" },
    { name: "Tughlakabad", line: "Violet" },
    { name: "Badarpur Border", line: "Violet" },
    { name: "Sarai", line: "Violet" },
    { name: "NHPC Chowk", line: "Violet" },
    { name: "Mewala Maharajpur", line: "Violet" },
    { name: "Sector 28 Faridabad", line: "Violet" },
    { name: "Badkal Mor", line: "Violet" },
    { name: "Old Faridabad", line: "Violet" },
    { name: "Neelam Chowk Ajronda", line: "Violet" },
    { name: "Bata Chowk", line: "Violet" },
    { name: "Escorts Mujesar", line: "Violet" },
    { name: "Sant Surdas Sihi", line: "Violet" },
    { name: "Raja Nahar Singh", line: "Violet" },

    // ── PINK LINE (Majlis Park ↔ Shiv Vihar) ────────────────────
    { name: "Majlis Park", line: "Pink" },
    { name: "Azadpur", line: "Pink" },             // interchange Yellow
    { name: "Shalimar Bagh", line: "Pink" },
    { name: "Netaji Subhash Place", line: "Pink" }, // interchange Red
    { name: "Shakurpur", line: "Pink" },
    { name: "Punjabi Bagh East", line: "Pink" },
    { name: "ESI Basai Darapur", line: "Pink" },
    { name: "Rajouri Garden", line: "Pink" },      // interchange Blue, Green
    { name: "Mayapuri", line: "Pink" },
    { name: "Naraina Vihar", line: "Pink" },
    { name: "Delhi Cantonment", line: "Pink" },
    { name: "Durgabai Deshmukh South Campus", line: "Pink" },
    { name: "Sir M Visvesvaraya Moti Bagh", line: "Pink" },
    { name: "Bhikaji Cama Place", line: "Pink" },
    { name: "Sarojini Nagar", line: "Pink" },
    { name: "INA", line: "Pink" },                 // interchange Yellow
    { name: "South Extension", line: "Pink" },
    { name: "Lajpat Nagar", line: "Pink" },        // interchange Violet
    { name: "Vinobapuri", line: "Pink" },
    { name: "Ashram", line: "Pink" },
    { name: "Hazrat Nizamuddin", line: "Pink" },
    { name: "Mayur Vihar Phase 1", line: "Pink" }, // interchange Blue
    { name: "Mayur Vihar Pocket 1", line: "Pink" },
    { name: "Trilokpuri Sanjay Lake", line: "Pink" },
    { name: "East Vinod Nagar Mayur Vihar 2", line: "Pink" },
    { name: "Mandawali West Vinod Nagar", line: "Pink" },
    { name: "IP Extension", line: "Pink" },
    { name: "Anand Vihar ISBT", line: "Pink" },    // interchange Blue
    { name: "Karkarduma", line: "Pink" },
    { name: "Karkarduma Court", line: "Pink" },
    { name: "Krishna Nagar", line: "Pink" },
    { name: "East Azad Nagar", line: "Pink" },
    { name: "Welcome", line: "Pink" },             // interchange Red
    { name: "Jaffrabad", line: "Pink" },
    { name: "Maujpur Babarpur", line: "Pink" },
    { name: "Gokulpuri", line: "Pink" },
    { name: "Johripur", line: "Pink" },
    { name: "Shiv Vihar", line: "Pink" },

    // ── AIRPORT LINE (New Delhi ↔ Dwarka Sector 21) ──────────────
    { name: "New Delhi", line: "Airport" },        // interchange Yellow
    { name: "Shivaji Stadium", line: "Airport" },
    { name: "Dhaula Kuan", line: "Airport" },
    { name: "Delhi Aerocity", line: "Airport" },
    { name: "IGI Airport", line: "Airport" },
    { name: "Dwarka Sector 21", line: "Airport" }, // interchange Blue
];

// ═══════════════════════════════════════════════════════════════
//  CONNECTIONS DATA
//  Format: { from, to, line, time (mins), fare (₹) }
//  Bidirectional — Graph.js handles reverse automatically
// ═══════════════════════════════════════════════════════════════

const connections = [
    // ── YELLOW LINE ──────────────────────────────────────────────
    { from: "Samaypur Badli", to: "Rohini Sector 18 19", line: "Yellow", time: 2, fare: 10 },
    { from: "Rohini Sector 18 19", to: "Haiderpur Badli Mor", line: "Yellow", time: 2, fare: 10 },
    { from: "Haiderpur Badli Mor", to: "Jahangirpuri", line: "Yellow", time: 2, fare: 10 },
    { from: "Jahangirpuri", to: "Adarsh Nagar", line: "Yellow", time: 2, fare: 10 },
    { from: "Adarsh Nagar", to: "Azadpur", line: "Yellow", time: 2, fare: 10 },
    { from: "Azadpur", to: "Model Town", line: "Yellow", time: 2, fare: 10 },
    { from: "Model Town", to: "GTB Nagar", line: "Yellow", time: 2, fare: 10 },
    { from: "GTB Nagar", to: "Vishwa Vidyalaya", line: "Yellow", time: 2, fare: 10 },
    { from: "Vishwa Vidyalaya", to: "Vidhan Sabha", line: "Yellow", time: 2, fare: 10 },
    { from: "Vidhan Sabha", to: "Civil Lines", line: "Yellow", time: 2, fare: 10 },
    { from: "Civil Lines", to: "Kashmere Gate", line: "Yellow", time: 2, fare: 10 },
    { from: "Kashmere Gate", to: "Chandni Chowk", line: "Yellow", time: 2, fare: 10 },
    { from: "Chandni Chowk", to: "Chawri Bazar", line: "Yellow", time: 2, fare: 10 },
    { from: "Chawri Bazar", to: "New Delhi", line: "Yellow", time: 2, fare: 10 },
    { from: "New Delhi", to: "Rajiv Chowk", line: "Yellow", time: 2, fare: 10 },
    { from: "Rajiv Chowk", to: "Patel Chowk", line: "Yellow", time: 2, fare: 10 },
    { from: "Patel Chowk", to: "Central Secretariat", line: "Yellow", time: 2, fare: 10 },
    { from: "Central Secretariat", to: "Udyog Bhawan", line: "Yellow", time: 2, fare: 10 },
    { from: "Udyog Bhawan", to: "Lok Kalyan Marg", line: "Yellow", time: 2, fare: 10 },
    { from: "Lok Kalyan Marg", to: "Jor Bagh", line: "Yellow", time: 2, fare: 10 },
    { from: "Jor Bagh", to: "INA", line: "Yellow", time: 2, fare: 10 },
    { from: "INA", to: "AIIMS", line: "Yellow", time: 2, fare: 10 },
    { from: "AIIMS", to: "Green Park", line: "Yellow", time: 2, fare: 10 },
    { from: "Green Park", to: "Hauz Khas", line: "Yellow", time: 2, fare: 10 },
    { from: "Hauz Khas", to: "Malviya Nagar", line: "Yellow", time: 2, fare: 10 },
    { from: "Malviya Nagar", to: "Saket", line: "Yellow", time: 2, fare: 10 },
    { from: "Saket", to: "Qutab Minar", line: "Yellow", time: 3, fare: 10 },
    { from: "Qutab Minar", to: "Chhattarpur", line: "Yellow", time: 3, fare: 10 },
    { from: "Chhattarpur", to: "Sultanpur", line: "Yellow", time: 3, fare: 10 },
    { from: "Sultanpur", to: "Ghitorni", line: "Yellow", time: 3, fare: 10 },
    { from: "Ghitorni", to: "Arjan Garh", line: "Yellow", time: 3, fare: 10 },
    { from: "Arjan Garh", to: "Guru Dronacharya", line: "Yellow", time: 3, fare: 20 },
    { from: "Guru Dronacharya", to: "Sikandarpur", line: "Yellow", time: 2, fare: 20 },
    { from: "Sikandarpur", to: "MG Road", line: "Yellow", time: 2, fare: 20 },
    { from: "MG Road", to: "IFFCO Chowk", line: "Yellow", time: 2, fare: 20 },
    { from: "IFFCO Chowk", to: "HUDA City Centre", line: "Yellow", time: 3, fare: 20 },

    // ── BLUE LINE (Main: Dwarka Sec 21 → Yamuna Bank) ────────────
    { from: "Dwarka Sector 21", to: "Dwarka Sector 8", line: "Blue", time: 3, fare: 10 },
    { from: "Dwarka Sector 8", to: "Dwarka Sector 9", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 9", to: "Dwarka Sector 10", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 10", to: "Dwarka Sector 11", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 11", to: "Dwarka Sector 12", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 12", to: "Dwarka Sector 13", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 13", to: "Dwarka Sector 14", line: "Blue", time: 2, fare: 10 },
    { from: "Dwarka Sector 14", to: "Dwarka", line: "Blue", time: 3, fare: 10 },
    { from: "Dwarka", to: "Dwarka Mor", line: "Blue", time: 3, fare: 10 },
    { from: "Dwarka Mor", to: "Nawada", line: "Blue", time: 2, fare: 10 },
    { from: "Nawada", to: "Uttam Nagar West", line: "Blue", time: 2, fare: 10 },
    { from: "Uttam Nagar West", to: "Uttam Nagar East", line: "Blue", time: 2, fare: 10 },
    { from: "Uttam Nagar East", to: "Janakpuri West", line: "Blue", time: 2, fare: 10 },
    { from: "Janakpuri West", to: "Janakpuri East", line: "Blue", time: 2, fare: 10 },
    { from: "Janakpuri East", to: "Tilak Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Tilak Nagar", to: "Subhash Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Subhash Nagar", to: "Tagore Garden", line: "Blue", time: 2, fare: 10 },
    { from: "Tagore Garden", to: "Rajouri Garden", line: "Blue", time: 2, fare: 10 },
    { from: "Rajouri Garden", to: "Ramesh Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Ramesh Nagar", to: "Moti Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Moti Nagar", to: "Kirti Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Kirti Nagar", to: "Shadipur", line: "Blue", time: 2, fare: 10 },
    { from: "Shadipur", to: "Patel Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "Patel Nagar", to: "Rajendra Place", line: "Blue", time: 2, fare: 10 },
    { from: "Rajendra Place", to: "Karol Bagh", line: "Blue", time: 2, fare: 10 },
    { from: "Karol Bagh", to: "Jhandewalan", line: "Blue", time: 2, fare: 10 },
    { from: "Jhandewalan", to: "RK Ashram Marg", line: "Blue", time: 2, fare: 10 },
    { from: "RK Ashram Marg", to: "Rajiv Chowk", line: "Blue", time: 2, fare: 10 },
    { from: "Rajiv Chowk", to: "Barakhamba Road", line: "Blue", time: 2, fare: 10 },
    { from: "Barakhamba Road", to: "Mandi House", line: "Blue", time: 2, fare: 10 },
    { from: "Mandi House", to: "Pragati Maidan", line: "Blue", time: 2, fare: 10 },
    { from: "Pragati Maidan", to: "Indraprastha", line: "Blue", time: 2, fare: 10 },
    { from: "Indraprastha", to: "Yamuna Bank", line: "Blue", time: 3, fare: 10 },
    // Blue branch 1: Yamuna Bank → Vaishali
    { from: "Yamuna Bank", to: "Karkarduma", line: "Blue", time: 3, fare: 10 },
    { from: "Karkarduma", to: "Karkarduma Court", line: "Blue", time: 2, fare: 10 },
    { from: "Karkarduma Court", to: "Anand Vihar ISBT", line: "Blue", time: 2, fare: 10 },
    { from: "Anand Vihar ISBT", to: "Kaushambi", line: "Blue", time: 3, fare: 20 },
    { from: "Kaushambi", to: "Vaishali", line: "Blue", time: 2, fare: 20 },
    // Blue branch 2: Yamuna Bank → Noida Electronic City
    { from: "Yamuna Bank", to: "Akshardham", line: "Blue", time: 3, fare: 10 },
    { from: "Akshardham", to: "Mayur Vihar Phase 1", line: "Blue", time: 3, fare: 10 },
    { from: "Mayur Vihar Phase 1", to: "Mayur Vihar Extension", line: "Blue", time: 2, fare: 10 },
    { from: "Mayur Vihar Extension", to: "New Ashok Nagar", line: "Blue", time: 2, fare: 10 },
    { from: "New Ashok Nagar", to: "Noida Sector 15", line: "Blue", time: 3, fare: 20 },
    { from: "Noida Sector 15", to: "Noida Sector 16", line: "Blue", time: 2, fare: 20 },
    { from: "Noida Sector 16", to: "Noida Sector 18", line: "Blue", time: 2, fare: 20 },
    { from: "Noida Sector 18", to: "Botanical Garden", line: "Blue", time: 3, fare: 20 },
    { from: "Botanical Garden", to: "Golf Course", line: "Blue", time: 2, fare: 20 },
    { from: "Golf Course", to: "Noida City Centre", line: "Blue", time: 2, fare: 20 },
    { from: "Noida City Centre", to: "Noida Sector 34", line: "Blue", time: 3, fare: 20 },
    { from: "Noida Sector 34", to: "Noida Sector 52", line: "Blue", time: 3, fare: 20 },
    { from: "Noida Sector 52", to: "Noida Sector 61", line: "Blue", time: 2, fare: 20 },
    { from: "Noida Sector 61", to: "Noida Sector 59", line: "Blue", time: 2, fare: 20 },
    { from: "Noida Sector 59", to: "Noida Sector 62", line: "Blue", time: 2, fare: 20 },
    { from: "Noida Sector 62", to: "Noida Electronic City", line: "Blue", time: 3, fare: 20 },

    // ── RED LINE ──────────────────────────────────────────────────
    { from: "Rithala", to: "Rohini West", line: "Red", time: 2, fare: 10 },
    { from: "Rohini West", to: "Rohini East", line: "Red", time: 2, fare: 10 },
    { from: "Rohini East", to: "Pitam Pura", line: "Red", time: 2, fare: 10 },
    { from: "Pitam Pura", to: "Kohat Enclave", line: "Red", time: 2, fare: 10 },
    { from: "Kohat Enclave", to: "Netaji Subhash Place", line: "Red", time: 2, fare: 10 },
    { from: "Netaji Subhash Place", to: "Keshav Puram", line: "Red", time: 2, fare: 10 },
    { from: "Keshav Puram", to: "Kanhaiya Nagar", line: "Red", time: 2, fare: 10 },
    { from: "Kanhaiya Nagar", to: "Inderlok", line: "Red", time: 2, fare: 10 },
    { from: "Inderlok", to: "Shastri Nagar", line: "Red", time: 2, fare: 10 },
    { from: "Shastri Nagar", to: "Pratap Nagar", line: "Red", time: 2, fare: 10 },
    { from: "Pratap Nagar", to: "Pulbangash", line: "Red", time: 2, fare: 10 },
    { from: "Pulbangash", to: "Tis Hazari", line: "Red", time: 2, fare: 10 },
    { from: "Tis Hazari", to: "Kashmere Gate", line: "Red", time: 2, fare: 10 },
    { from: "Kashmere Gate", to: "Shastri Park", line: "Red", time: 3, fare: 10 },
    { from: "Shastri Park", to: "Seelampur", line: "Red", time: 2, fare: 10 },
    { from: "Seelampur", to: "Welcome", line: "Red", time: 2, fare: 10 },
    { from: "Welcome", to: "Shahdara", line: "Red", time: 2, fare: 10 },
    { from: "Shahdara", to: "Mansarovar Park", line: "Red", time: 2, fare: 10 },
    { from: "Mansarovar Park", to: "Jhilmil", line: "Red", time: 2, fare: 10 },
    { from: "Jhilmil", to: "Dilshad Garden", line: "Red", time: 2, fare: 10 },
    { from: "Dilshad Garden", to: "Shaheed Nagar", line: "Red", time: 3, fare: 10 },
    { from: "Shaheed Nagar", to: "Shaheed Sthal", line: "Red", time: 3, fare: 10 },

    // ── GREEN LINE ────────────────────────────────────────────────
    { from: "Inderlok", to: "Ashok Park Main", line: "Green", time: 2, fare: 10 },
    { from: "Ashok Park Main", to: "Punjabi Bagh West", line: "Green", time: 2, fare: 10 },
    { from: "Punjabi Bagh West", to: "ESI Hospital", line: "Green", time: 2, fare: 10 },
    { from: "ESI Hospital", to: "Rajouri Garden", line: "Green", time: 2, fare: 10 },
    { from: "Rajouri Garden", to: "Madipur", line: "Green", time: 2, fare: 10 },
    { from: "Madipur", to: "Paschim Vihar East", line: "Green", time: 2, fare: 10 },
    { from: "Paschim Vihar East", to: "Paschim Vihar West", line: "Green", time: 2, fare: 10 },
    { from: "Paschim Vihar West", to: "Peeragarhi", line: "Green", time: 2, fare: 10 },
    { from: "Peeragarhi", to: "Udyog Nagar", line: "Green", time: 2, fare: 10 },
    { from: "Udyog Nagar", to: "Surajmal Stadium", line: "Green", time: 2, fare: 10 },
    { from: "Surajmal Stadium", to: "Nangloi", line: "Green", time: 2, fare: 10 },
    { from: "Nangloi", to: "Nangloi Railway Station", line: "Green", time: 2, fare: 10 },
    { from: "Nangloi Railway Station", to: "Rajdhani Park", line: "Green", time: 2, fare: 10 },
    { from: "Rajdhani Park", to: "Mundka", line: "Green", time: 3, fare: 10 },
    { from: "Mundka", to: "Mundka Industrial Area", line: "Green", time: 2, fare: 10 },
    { from: "Mundka Industrial Area", to: "Ghevra", line: "Green", time: 3, fare: 10 },
    { from: "Ghevra", to: "Tikri Kalan", line: "Green", time: 3, fare: 10 },
    { from: "Tikri Kalan", to: "Tikri Border", line: "Green", time: 2, fare: 10 },
    { from: "Tikri Border", to: "Pandit Shree Ram Sharma", line: "Green", time: 3, fare: 20 },
    { from: "Pandit Shree Ram Sharma", to: "Bahadurgarh City", line: "Green", time: 2, fare: 20 },
    { from: "Bahadurgarh City", to: "Brigadier Hoshiyar Singh", line: "Green", time: 2, fare: 20 },
    // Green branch: Kirti Nagar ↔ Inderlok via Satguru
    { from: "Kirti Nagar", to: "Satguru Ram Singh Marg", line: "Green", time: 2, fare: 10 },
    { from: "Satguru Ram Singh Marg", to: "Inderlok", line: "Green", time: 2, fare: 10 },

    // ── VIOLET LINE ───────────────────────────────────────────────
    { from: "Kashmere Gate", to: "Lal Quila", line: "Violet", time: 3, fare: 10 },
    { from: "Lal Quila", to: "Jama Masjid", line: "Violet", time: 2, fare: 10 },
    { from: "Jama Masjid", to: "Delhi Gate", line: "Violet", time: 2, fare: 10 },
    { from: "Delhi Gate", to: "ITO", line: "Violet", time: 2, fare: 10 },
    { from: "ITO", to: "Mandi House", line: "Violet", time: 2, fare: 10 },
    { from: "Mandi House", to: "Janpath", line: "Violet", time: 2, fare: 10 },
    { from: "Janpath", to: "Central Secretariat", line: "Violet", time: 2, fare: 10 },
    { from: "Central Secretariat", to: "Khan Market", line: "Violet", time: 2, fare: 10 },
    { from: "Khan Market", to: "Jawaharlal Nehru Stadium", line: "Violet", time: 2, fare: 10 },
    { from: "Jawaharlal Nehru Stadium", to: "Jangpura", line: "Violet", time: 2, fare: 10 },
    { from: "Jangpura", to: "Lajpat Nagar", line: "Violet", time: 2, fare: 10 },
    { from: "Lajpat Nagar", to: "Moolchand", line: "Violet", time: 2, fare: 10 },
    { from: "Moolchand", to: "Kailash Colony", line: "Violet", time: 2, fare: 10 },
    { from: "Kailash Colony", to: "Nehru Place", line: "Violet", time: 2, fare: 10 },
    { from: "Nehru Place", to: "Kalkaji Mandir", line: "Violet", time: 2, fare: 10 },
    { from: "Kalkaji Mandir", to: "Govindpuri", line: "Violet", time: 2, fare: 10 },
    { from: "Govindpuri", to: "Harkesh Nagar Okhla", line: "Violet", time: 2, fare: 10 },
    { from: "Harkesh Nagar Okhla", to: "Jasola Apollo", line: "Violet", time: 3, fare: 10 },
    { from: "Jasola Apollo", to: "Sarita Vihar", line: "Violet", time: 2, fare: 10 },
    { from: "Sarita Vihar", to: "Mohan Estate", line: "Violet", time: 3, fare: 10 },
    { from: "Mohan Estate", to: "Tughlakabad", line: "Violet", time: 3, fare: 10 },
    { from: "Tughlakabad", to: "Badarpur Border", line: "Violet", time: 3, fare: 10 },
    { from: "Badarpur Border", to: "Sarai", line: "Violet", time: 3, fare: 20 },
    { from: "Sarai", to: "NHPC Chowk", line: "Violet", time: 2, fare: 20 },
    { from: "NHPC Chowk", to: "Mewala Maharajpur", line: "Violet", time: 2, fare: 20 },
    { from: "Mewala Maharajpur", to: "Sector 28 Faridabad", line: "Violet", time: 2, fare: 20 },
    { from: "Sector 28 Faridabad", to: "Badkal Mor", line: "Violet", time: 2, fare: 20 },
    { from: "Badkal Mor", to: "Old Faridabad", line: "Violet", time: 2, fare: 20 },
    { from: "Old Faridabad", to: "Neelam Chowk Ajronda", line: "Violet", time: 2, fare: 20 },
    { from: "Neelam Chowk Ajronda", to: "Bata Chowk", line: "Violet", time: 2, fare: 20 },
    { from: "Bata Chowk", to: "Escorts Mujesar", line: "Violet", time: 2, fare: 20 },
    { from: "Escorts Mujesar", to: "Sant Surdas Sihi", line: "Violet", time: 3, fare: 20 },
    { from: "Sant Surdas Sihi", to: "Raja Nahar Singh", line: "Violet", time: 3, fare: 20 },

    // ── PINK LINE ─────────────────────────────────────────────────
    { from: "Majlis Park", to: "Azadpur", line: "Pink", time: 3, fare: 10 },
    { from: "Azadpur", to: "Shalimar Bagh", line: "Pink", time: 2, fare: 10 },
    { from: "Shalimar Bagh", to: "Netaji Subhash Place", line: "Pink", time: 2, fare: 10 },
    { from: "Netaji Subhash Place", to: "Shakurpur", line: "Pink", time: 2, fare: 10 },
    { from: "Shakurpur", to: "Punjabi Bagh East", line: "Pink", time: 2, fare: 10 },
    { from: "Punjabi Bagh East", to: "ESI Basai Darapur", line: "Pink", time: 2, fare: 10 },
    { from: "ESI Basai Darapur", to: "Rajouri Garden", line: "Pink", time: 2, fare: 10 },
    { from: "Rajouri Garden", to: "Mayapuri", line: "Pink", time: 3, fare: 10 },
    { from: "Mayapuri", to: "Naraina Vihar", line: "Pink", time: 2, fare: 10 },
    { from: "Naraina Vihar", to: "Delhi Cantonment", line: "Pink", time: 3, fare: 10 },
    { from: "Delhi Cantonment", to: "Durgabai Deshmukh South Campus", line: "Pink", time: 2, fare: 10 },
    { from: "Durgabai Deshmukh South Campus", to: "Sir M Visvesvaraya Moti Bagh", line: "Pink", time: 2, fare: 10 },
    { from: "Sir M Visvesvaraya Moti Bagh", to: "Bhikaji Cama Place", line: "Pink", time: 2, fare: 10 },
    { from: "Bhikaji Cama Place", to: "Sarojini Nagar", line: "Pink", time: 2, fare: 10 },
    { from: "Sarojini Nagar", to: "INA", line: "Pink", time: 2, fare: 10 },
    { from: "INA", to: "South Extension", line: "Pink", time: 2, fare: 10 },
    { from: "South Extension", to: "Lajpat Nagar", line: "Pink", time: 2, fare: 10 },
    { from: "Lajpat Nagar", to: "Vinobapuri", line: "Pink", time: 2, fare: 10 },
    { from: "Vinobapuri", to: "Ashram", line: "Pink", time: 2, fare: 10 },
    { from: "Ashram", to: "Hazrat Nizamuddin", line: "Pink", time: 2, fare: 10 },
    { from: "Hazrat Nizamuddin", to: "Mayur Vihar Phase 1", line: "Pink", time: 3, fare: 10 },
    { from: "Mayur Vihar Phase 1", to: "Mayur Vihar Pocket 1", line: "Pink", time: 2, fare: 10 },
    { from: "Mayur Vihar Pocket 1", to: "Trilokpuri Sanjay Lake", line: "Pink", time: 2, fare: 10 },
    { from: "Trilokpuri Sanjay Lake", to: "East Vinod Nagar Mayur Vihar 2", line: "Pink", time: 2, fare: 10 },
    { from: "East Vinod Nagar Mayur Vihar 2", to: "Mandawali West Vinod Nagar", line: "Pink", time: 2, fare: 10 },
    { from: "Mandawali West Vinod Nagar", to: "IP Extension", line: "Pink", time: 2, fare: 10 },
    { from: "IP Extension", to: "Anand Vihar ISBT", line: "Pink", time: 2, fare: 10 },
    { from: "Anand Vihar ISBT", to: "Karkarduma", line: "Pink", time: 2, fare: 10 },
    { from: "Karkarduma", to: "Karkarduma Court", line: "Pink", time: 2, fare: 10 },
    { from: "Karkarduma Court", to: "Krishna Nagar", line: "Pink", time: 2, fare: 10 },
    { from: "Krishna Nagar", to: "East Azad Nagar", line: "Pink", time: 2, fare: 10 },
    { from: "East Azad Nagar", to: "Welcome", line: "Pink", time: 2, fare: 10 },
    { from: "Welcome", to: "Jaffrabad", line: "Pink", time: 2, fare: 10 },
    { from: "Jaffrabad", to: "Maujpur Babarpur", line: "Pink", time: 2, fare: 10 },
    { from: "Maujpur Babarpur", to: "Gokulpuri", line: "Pink", time: 2, fare: 10 },
    { from: "Gokulpuri", to: "Johripur", line: "Pink", time: 2, fare: 10 },
    { from: "Johripur", to: "Shiv Vihar", line: "Pink", time: 3, fare: 10 },

    // ── AIRPORT LINE ──────────────────────────────────────────────
    { from: "New Delhi", to: "Shivaji Stadium", line: "Airport", time: 3, fare: 60 },
    { from: "Shivaji Stadium", to: "Dhaula Kuan", line: "Airport", time: 5, fare: 60 },
    { from: "Dhaula Kuan", to: "Delhi Aerocity", line: "Airport", time: 5, fare: 60 },
    { from: "Delhi Aerocity", to: "IGI Airport", line: "Airport", time: 4, fare: 60 },
    { from: "IGI Airport", to: "Dwarka Sector 21", line: "Airport", time: 8, fare: 60 },
];

// ═══════════════════════════════════════════════════════════════
//  SEED FUNCTION
// ═══════════════════════════════════════════════════════════════
async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        // Clear existing data
        await Station.deleteMany({});
        await Connection.deleteMany({});
        console.log("🗑️  Old data cleared");

        // Deduplicate stations by name+line
        const uniqueStations = [];
        const seen = new Set();
        for (const s of stations) {
            const key = `${s.name}|${s.line}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueStations.push(s);
            }
        }

        await Station.insertMany(uniqueStations);
        console.log(`✅ ${uniqueStations.length} stations inserted`);

        await Connection.insertMany(connections);
        console.log(`✅ ${connections.length} connections inserted`);

        console.log("\n🚇 Delhi Metro seed complete!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seed failed:", err.message);
        process.exit(1);
    }
}

seed();