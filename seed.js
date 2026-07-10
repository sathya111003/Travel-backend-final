const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Package = require('./models/Package');
const Destination = require('./models/Destination');
const RecentTour = require('./models/RecentTour');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for massive data seeding...');

        // Clear existing data
        await User.deleteMany();
        await Package.deleteMany();
        await Destination.deleteMany();
        await RecentTour.deleteMany();

        // 1. Create Admin
        await User.create([
            { name: "Admin User", email: "admin@travelweb.com", password: "adminpassword123", role: "admin", phone: "1234567890" },
            { name: "Sathya", email: "sathya@gmail.com", password: "password123", role: "user", phone: "9876543210" }
        ]);
        console.log('Users created');

        // 2. Create Packages
        const packages = [
            // --- KERALA ---
            {
                title: "Wayanad Nature Escape",
                description: "Experience the lush greenery and mist-covered hills of Wayanad.",
                tourOverview: "A 2-day immersive journey through the heart of Wayanad's natural beauty, featuring dams, lakes, and trekking.",
                price: 2800,
                duration: "2D/1N",
                category: "Family Trips",
                type: "domestic",
                location: { city: "Wayanad", country: "India", lat: 11.6854, lng: 76.1320 },
                images: ["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1932&auto=format&fit=crop"],
                highlights: ["Any Non Ac vehicle for 2 days", "Hotel Stay at Wayanad", "2 Breakfasts and 1 Dinner", "Jeep Safari Charges at 900 Kandi", "Guidance"],
                exclusions: ["Food not mentioned in inclusions", "Entry Tickets", "Train Tickets"],
                rates: [
                    { pax: "12 Pax", price: 2800 },
                    { pax: "10 Pax", price: 3200 },
                    { pax: "8 Pax", price: 3400 },
                    { pax: "6 Pax", price: 3600 },
                    { pax: "4 Pax", price: 3800 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Wayanad Arrival & Local Exploration",
                        activities: [
                            { time: "Morning", description: "Pickup at Calicut Junction & Proceed to Wayanad" },
                            { time: "Afternoon", description: "Banasura Sagar Dam & Parrot Park" },
                            { time: "Evening", description: "Karlad Lake & Shopping" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Adventure & Departure",
                        activities: [
                            { time: "Morning", description: "900 Kandi Jeep Safari" },
                            { time: "Afternoon", description: "Pookode Lake Exploration" },
                            { time: "Evening", description: "Kozhikode Beach & Drop at Calicut" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },
            {
                title: "Munnar & Cochin Bliss",
                description: "The perfect blend of scenic tea gardens and coastal heritage.",
                tourOverview: "Thoughtfully planned for travellers who want to explore both the scenic beauty of Munnar and the cultural charm of Cochin.",
                price: 3200,
                duration: "3D/2N",
                category: "Family Trips",
                type: "domestic",
                location: { city: "Munnar", country: "India", lat: 10.0889, lng: 77.0595 },
                images: ["https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop"],
                highlights: ["Non-AC vehicle for 3 days", "Hotel stay at Munnar & Cochin", "Jeep Safari in Munnar", "3 Breakfasts", "Travel Guidance"],
                exclusions: ["Train tickets", "Entry tickets", "Lunch & Dinner", "Personal expenses"],
                itinerary: [
                    {
                        day: 1, title: "Munnar Arrival & Sightseeing",
                        activities: [
                            { time: "Morning", description: "Pickup from Ernakulam Junction, Proceed to Munnar" },
                            { time: "Afternoon", description: "Photo Point, Elephant Camp, Echo Point" },
                            { time: "Evening", description: "Mattupatty Dam & Top Station" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Off-Road Adventure",
                        activities: [
                            { time: "Morning", description: "Off-Road Jeep Safari to Idli Hills" },
                            { time: "Afternoon", description: "Tea Plantation Walk, Viripara Waterfalls" },
                            { time: "Evening", description: "Pothamedu View Point & Shopping" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 3, title: "Cochin Heritage",
                        activities: [
                            { time: "Morning", description: "Check-out, proceed to Cochin. Fort Kochi & Jew Town" },
                            { time: "Afternoon", description: "Marine Drive, Vypin Beach" },
                            { time: "Evening", description: "DJ Boating & Drop at Ernakulam" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },
            {
                title: "Alappuzha Backwater Cruise",
                description: "Overnight stay in a traditional Kerala Houseboat.",
                tourOverview: "Experience the magic of Alleppey backwaters with an overnight cruise, traditional food, and stunning sunset views.",
                price: 3700,
                duration: "2D/1N",
                category: "Honeymoon",
                type: "domestic",
                location: { city: "Alappuzha", country: "India", lat: 9.4981, lng: 76.3388 },
                images: ["https://images.unsplash.com/photo-1593693411515-c202e974fe09?q=80&w=2069&auto=format&fit=crop"],
                highlights: ["Non AC Vehicle for 2 Days", "Boat House Stay (AC)", "All meals in Boathouse", "Snacks", "Guidance"],
                exclusions: ["Train Tickets", "Food not mentioned", "Other Expenses"],
                rates: [
                    { pax: "12 Pax", price: 3700 },
                    { pax: "10 Pax", price: 4200 },
                    { pax: "8 Pax", price: 4400 },
                    { pax: "6 Pax", price: 4800 },
                    { pax: "4 Pax", price: 4999 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Alleppey Houseboat Check-in",
                        activities: [
                            { time: "12:00 PM", description: "Check-in to Boathouse, Welcome Drink" },
                            { time: "01:30 PM", description: "Traditional Kerala Lunch on board" },
                            { time: "05:00 PM", description: "Cruise stops for anchor stay, Evening Snacks" }
                        ],
                        food: { lunch: { name: "Kerala Feast", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Church & Beach Visit",
                        activities: [
                            { time: "09:00 AM", description: "Check out from Boathouse, Alleppey Church visit" },
                            { time: "12:00 PM", description: "Lunch, Alleppey Beach & Light House" },
                            { time: "06:00 PM", description: "Drop at Alleppey Junction" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },
            {
                title: "Kochi City Wonders",
                description: "Explore the mix of history and modern culture in Kochi.",
                tourOverview: "Visit the Athirapally waterfalls, Fort Kochi, and the world-famous Lulu Mall in this 2-day city tour.",
                price: 3000,
                duration: "2D/1N",
                category: "Family Trips",
                type: "domestic",
                location: { city: "Kochi", country: "India", lat: 9.9312, lng: 76.2673 },
                images: ["https://images.unsplash.com/photo-1589982840479-78836ecb2176?q=80&w=2070&auto=format&fit=crop"],
                highlights: ["Non-AC Vehicle for 2 Days", "Hotel Stay in Kochi", "2 Breakfasts & 1 Dinner", "Guidance"],
                exclusions: ["Entry tickets", "Train tickets", "Meals not mentioned"],
                rates: [
                    { pax: "12 Pax", price: 3000 },
                    { pax: "10 Pax", price: 3300 },
                    { pax: "8 Pax", price: 3600 },
                    { pax: "6 Pax", price: 3900 },
                    { pax: "4 Pax", price: 4200 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Waterfall & Heritage",
                        activities: [
                            { time: "Morning", description: "Pickup at Ernakulam, Athirapally Waterfalls" },
                            { time: "Afternoon", description: "Meenmutty Falls or Thrissur Zoo" },
                            { time: "Evening", description: "Fort Kochi & Broadway Shopping" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Temples & Malls",
                        activities: [
                            { time: "Morning", description: "Chotanikarai Temple, Hill Palace Museum" },
                            { time: "Afternoon", description: "Lulu Mall Visit" },
                            { time: "Evening", description: "Marine Drive DJ Boating & Drop" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },

            // --- KARNATAKA ---
            {
                title: "Coorg Mist & Coffee",
                description: "The Scotland of India awaits with its coffee plantations and waterfalls.",
                tourOverview: "Explore the Tibetian Golden Temple, Dubare Elephant Camp, and the scenic Raja Seat in Madikeri.",
                price: 2800,
                duration: "2D/1N",
                category: "Family Trips",
                type: "domestic",
                location: { city: "Coorg", country: "India", lat: 12.4244, lng: 75.7382 },
                images: ["https://images.unsplash.com/photo-1590401314981-8178a9c2982d?q=80&w=2070&auto=format&fit=crop"],
                highlights: ["Non Ac Vehicle for 2 days", "Hotel Stay in Coorg", "2 Breakfasts & 1 Dinner", "Guidance"],
                exclusions: ["Entry tickets", "Train tickets"],
                rates: [
                    { pax: "12 Pax", price: 2800 },
                    { pax: "10 Pax", price: 2999 },
                    { pax: "8 Pax", price: 3299 },
                    { pax: "6 Pax", price: 3599 },
                    { pax: "4 Pax", price: 3999 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Monastery & Elephants",
                        activities: [
                            { time: "Morning", description: "Pickup at Mysore, Tibetian Golden Temple" },
                            { time: "Afternoon", description: "Nisarghadhama Bamboo Forest" },
                            { time: "Evening", description: "Dubare Elephant Camp & Chiklihole Reservoir" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Madikeri Highlights",
                        activities: [
                            { time: "Morning", description: "Madikeri Raja Seat, Abbey Falls" },
                            { time: "Afternoon", description: "Harangi Dam Visit" },
                            { time: "Evening", description: "Drop at Mysore Railway Station" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },
            {
                title: "Dandeli Jungle Camp",
                description: "Adventure and water sports in the heart of the jungle.",
                tourOverview: "Stay in a riverside resort, enjoy Zorbing, Kayaking, and Boating followed by a Rain dance with DJ.",
                price: 4200,
                duration: "2D/1N",
                category: "Adventure",
                type: "domestic",
                location: { city: "Dandeli", country: "India", lat: 15.2689, lng: 74.6139 },
                images: ["https://images.unsplash.com/photo-1533709752211-118fcaf03312?q=80&w=2070&auto=format&fit=crop"],
                highlights: ["Non AC Vehicle", "4 Times food with Non-Veg", "Campfire", "Resort stay with Pool", "Rain Dance", "Indoor/Outdoor games"],
                rates: [
                    { pax: "12 Pax", price: 4200 },
                    { pax: "10 Pax", price: 4300 },
                    { pax: "8 Pax", price: 4999 },
                    { pax: "6 Pax", price: 5555 },
                    { pax: "4 Pax", price: 5999 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Water Sports & Resort Fun",
                        activities: [
                            { time: "Morning", description: "Pickup at Hubli, Check-in at Resort" },
                            { time: "Afternoon", description: "Water Activities: Zorbing, Kayaking, Boating" },
                            { time: "Evening", description: "Leisure at Pool, Rain Dance with DJ, Campfire" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, lunch: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Nature Trek & Park",
                        activities: [
                            { time: "Morning", description: "Forest Trekking, Breakfast" },
                            { time: "Afternoon", description: "Moulangi Park, Crocodile Park" },
                            { time: "Evening", description: "Supa Dam, Eco Park & Drop Hubli" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },

            // --- TAMIL NADU ---
            {
                title: "Ooty Queen of Hills",
                description: "Enjoy the cool breeze and beautiful botanical gardens of Ooty.",
                tourOverview: "Visit Pykara Falls, the Tea Factory, and enjoy boating at the Ooty Boathouse.",
                price: 3333,
                duration: "2D/1N",
                category: "Family Trips",
                type: "domestic",
                location: { city: "Ooty", country: "India", lat: 11.4102, lng: 76.6950 },
                images: ["https://images.unsplash.com/photo-1572979643193-58ba2d4e0e41?q=80&w=2070&auto=format&fit=crop"],
                highlights: ["Non Ac Vehicle", "Hotel/Cottage Stay", "2 Breakfasts & 1 Dinner", "Guidance"],
                rates: [
                    { pax: "12 Pax", price: 3333 },
                    { pax: "10 Pax", price: 3666 },
                    { pax: "8 Pax", price: 3999 },
                    { pax: "6 Pax", price: 4444 },
                    { pax: "4 Pax", price: 4888 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Pykara & Shooting Point",
                        activities: [
                            { time: "Morning", description: "Pickup at Coimbatore, Needle Rock View Point" },
                            { time: "Afternoon", description: "Pykara Boating & Waterfalls" },
                            { time: "Evening", description: "9th Mile Shooting Point & Pine Forest" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "Botanical Garden & Shopping",
                        activities: [
                            { time: "Morning", description: "Tea & Chocolate Factory visit" },
                            { time: "Afternoon", description: "Ooty Boathouse, Botanical Garden" },
                            { time: "Evening", description: "Shopping & Return to Coimbatore" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },

            // --- INTERNATIONAL ---
            {
                title: "Bali Tropical Dream",
                description: "Beach clubs, temples, and monkey forests in paradise.",
                tourOverview: "Our Bali tour packages from Chennai offer relaxation on pristine beaches, cultural exploration, and thrilling adventures.",
                price: 45000,
                duration: "6D/5N",
                category: "International",
                type: "international",
                location: { city: "Bali", country: "Indonesia", lat: -8.4095, lng: 115.1889 },
                images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop"],
                highlights: ["5 Nights Accommodation (Kuta + Ubud)", "Daily Breakfast", "Airport Transfers", "Private Vehicle for Tours", "Watersports"],
                exclusions: ["Flight tickets", "Visa charges", "Lunch & Dinner"],
                itinerary: [
                    {
                        day: 1, title: "Arrival in Denpasar",
                        activities: [{ time: "Day", description: "Transfer to Kuta/Seminyak hotel, Leisure at beach" }],
                        food: { breakfast: { name: "None", included: false } }
                    },
                    {
                        day: 2, title: "Watersports & Uluwatu",
                        activities: [
                            { time: "Morning", description: "Banana Boat, Parasailing, Jet Ski at Tanjung Benoa" },
                            { time: "Evening", description: "Uluwatu Temple Sunset & Kecak Dance" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 3, title: "Ubud Culture",
                        activities: [
                            { time: "Morning", description: "Tegenungan Waterfall, Sacred Monkey Forest" },
                            { time: "Afternoon", description: "Tegalalang Rice Terrace & Ubud Art Market" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 4, title: "Kintamani Volcano",
                        activities: [
                            { time: "Morning", description: "View of Mount Batur Volcano" },
                            { time: "Afternoon", description: "Tirta Empul Temple & Bali Swing" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 5, title: "Nusa Penida Island",
                        activities: [{ time: "Full Day", description: "Kelingking Beach, Angel’s Billabong, Broken Beach" }],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 6, title: "Departure",
                        activities: [{ time: "Morning", description: "Shopping & Transfer to Airport" }],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },
            {
                title: "Dubai Skyline Adventure",
                description: "Luxury shopping and desert safari in the city of gold.",
                tourOverview: "Visit the world's tallest building, enjoy a Marina dhow cruise, and experience the thrills of a desert safari.",
                price: 55000,
                duration: "4D/3N",
                category: "International",
                type: "international",
                location: { city: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708 },
                images: ["https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"],
                highlights: ["3 Nights Accommodation", "Daily Breakfast", "Marina Dhow Cruise Dinner", "Dubai City Tour", "Desert Safari"],
                exclusions: ["Airfare", "Visa", "Entry Tickets"],
                itinerary: [
                    {
                        day: 1, title: "Marina Dhow Cruise",
                        activities: [{ time: "Evening", description: "Dhow Cruise at Dubai Marina with Buffet Dinner" }],
                        food: { dinner: { name: "Buffet", included: true } }
                    },
                    {
                        day: 2, title: "Burj Khalifa & Mall",
                        activities: [
                            { time: "Morning", description: "Jumeirah Mosque, Palm Jumeirah photo stop" },
                            { time: "Afternoon", description: "Burj Khalifa (124th floor) & Dubai Mall" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    },
                    {
                        day: 3, title: "Desert Safari",
                        activities: [
                            { time: "Afternoon", description: "Dune bashing, Camel ride, Sandboarding, BBQ Dinner" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "BBQ", included: true } }
                    },
                    {
                        day: 4, title: "Departure",
                        activities: [{ time: "Morning", description: "Shopping at Gold Souk, Transfer to Airport" }],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            },

            // --- NORTH INDIA ---
            {
                title: "Goa Beach Party",
                description: "Scooter rides and beach sunsets in India's party capital.",
                tourOverview: "Enjoy 2 nights in a resort with a pool, including two-wheelers for local exploration of forts and beaches.",
                price: 4444,
                duration: "3D/2N",
                category: "Adventure",
                type: "domestic",
                location: { city: "Goa", country: "India", lat: 15.2993, lng: 74.1240 },
                images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1974&auto=format&fit=crop"],
                highlights: ["2 Nights Resort Stay with Pool (AC)", "Two Wheelers Provided", "3 Breakfasts & 3 Dinners"],
                exclusions: ["Train/Flight Tickets", "Fuel for Bikes", "Parking", "Entry Tickets"],
                rates: [
                    { pax: "6 Pax", price: 4444 },
                    { pax: "4 Pax", price: 4666 }
                ],
                itinerary: [
                    {
                        day: 1, title: "Forts & Beaches",
                        activities: [
                            { time: "Morning", description: "Pickup at Madgaon, Check-in at Calangute" },
                            { time: "Afternoon", description: "Aguada Fort & Sinquerim Beach" },
                            { time: "Evening", description: "Calangute & Baga Beach" }
                        ],
                        food: { dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 2, title: "North Goa Exploration",
                        activities: [
                            { time: "Morning", description: "Chapora Fort & Vagator Beach" },
                            { time: "Afternoon", description: "Anjuna Beach & Leisure at Pool" }
                        ],
                        food: { breakfast: { name: "Included", included: true }, dinner: { name: "Included", included: true } }
                    },
                    {
                        day: 3, title: "Old Goa & Churches",
                        activities: [
                            { time: "Morning", description: "Old Goa Churches, Miramar Beach" },
                            { time: "Afternoon", description: "Panjim Market & Shantadurga Temple" }
                        ],
                        food: { breakfast: { name: "Included", included: true } }
                    }
                ]
            }
        ];

        await Package.insertMany(packages);
        console.log('Packages created');

        // 3. Create Destinations (for Navbar)
        const destinations = [
            {
                region: "Kerala",
                type: "domestic",
                cities: [
                    { name: "Wayanad", image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944", description: "Land of paddy fields and hills." },
                    { name: "Munnar", image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2", description: "Green tea plantations and cool mist." },
                    { name: "Alleppey", image: "https://images.unsplash.com/photo-1593693411515-c202e974fe09", description: "Venice of the East." },
                    { name: "Kochi", image: "https://images.unsplash.com/photo-1589982840479-78836ecb2176", description: "Queen of the Arabian Sea." },
                    { name: "Vagamon", image: "https://images.unsplash.com/photo-1533709752211-118fcaf03312", description: "Hidden gem of Kerala." },
                    { name: "Varkala", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", description: "Cliff-side beach paradise." }
                ]
            },
            {
                region: "Karnataka",
                type: "domestic",
                cities: [
                    { name: "Coorg", image: "https://images.unsplash.com/photo-1590401314981-8178a9c2982d", description: "Coffee capital of India." },
                    { name: "Dandeli", image: "https://images.unsplash.com/photo-1533709752211-118fcaf03312", description: "Adventure sports destination." },
                    { name: "Gokarna", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2", description: "Pristine beaches and temples." },
                    { name: "Mysore", image: "https://images.unsplash.com/photo-1589982840479-78836ecb2176", description: "City of palaces." }
                ]
            },
            {
                region: "International",
                type: "international",
                cities: [
                    { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4", description: "Tropical Indonesian paradise." },
                    { name: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c", description: "Luxury and modern architecture." },
                    { name: "Thailand", image: "https://images.unsplash.com/photo-1528181304800-2f140819898f", description: "Land of smiles." },
                    { name: "Malaysia", image: "https://images.unsplash.com/photo-1529439322271-42931c09bce1", description: "Truly Asia." }
                ]
            }
        ];

        await Destination.insertMany(destinations);
        console.log('Destinations created');

        // 4. Create Recent Tours
        await RecentTour.create([
            {
                title: "12-Pax Family Trip to Wayanad",
                location: "Wayanad, Kerala",
                image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944",
                description: "A wonderful family group enjoyed the lush greenery and local spices.",
                days: "2 Days"
            },
            {
                title: "Couple Adventure in Bali",
                location: "Bali, Indonesia",
                image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
                description: "Our recent honeymooners loved the Uluwatu sunset dance.",
                days: "6 Days"
            }
        ]);
        console.log('Recent Tours created');

        console.log('Massive Data Seeding Completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
