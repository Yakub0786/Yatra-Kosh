/* ==========================================================================
   data.js — the site catalogue.
   Plain JS objects so the site runs from a file:// path or any static host
   with no backend. v2: expanded destinations + package tours + agency content.
   ========================================================================== */

const REGIONS = ['North', 'South', 'West', 'East', 'Northeast'];

const DESTINATIONS = [
  { id:'goa', name:'Goa', state:'Goa', region:'West', scene:'beach', palette:'sea',
    tagline:'Beaches, bakeries and Portuguese lanes',
    blurb:'North Goa for the crowds and the cafés, South Goa for the quiet. Either way you will spend more time on a scooter than you planned.',
    best:'November – February', nights:3, tags:['Beach','Nightlife','Heritage'] },

  { id:'manali', name:'Manali', state:'Himachal Pradesh', region:'North', scene:'mountain', palette:'snow',
    tagline:'Apple orchards under the Pir Panjal',
    blurb:'Old Manali for slow mornings, Solang for snow and paragliding, and the Atal Tunnel for a day trip into Lahaul.',
    best:'March – June, October', nights:4, tags:['Mountains','Adventure','Snow'] },

  { id:'jaipur', name:'Jaipur', state:'Rajasthan', region:'North', scene:'fort', palette:'sand',
    tagline:'Pink sandstone and stepwell shadows',
    blurb:'Amber Fort at opening time, Hawa Mahal from the café across the road, and Chokhi Dhani if you want the full folk-evening treatment.',
    best:'October – March', nights:3, tags:['Heritage','Forts','Food'] },

  { id:'kerala', name:'Alleppey', state:'Kerala', region:'South', scene:'backwater', palette:'forest',
    tagline:'Houseboats on the Vembanad backwaters',
    blurb:'An overnight houseboat is the point. Book a smaller boat for the narrow canals rather than the wide, busy lake route.',
    best:'September – March', nights:3, tags:['Backwaters','Ayurveda','Slow travel'] },

  { id:'ladakh', name:'Leh–Ladakh', state:'Ladakh', region:'North', scene:'mountain', palette:'dusk',
    tagline:'High desert, higher passes',
    blurb:'Give yourself two full days in Leh to acclimatise before Pangong or Nubra. Altitude is not something you can hurry.',
    best:'May – September', nights:6, tags:['Mountains','Road trip','Monasteries'] },

  { id:'andaman', name:'Havelock', state:'Andaman Islands', region:'South', scene:'beach', palette:'sea',
    tagline:'Radhanagar, and water you can see your feet through',
    blurb:'Ferries book out weeks ahead in season. Scuba at Nemo Reef is beginner-friendly and worth the early start.',
    best:'October – May', nights:4, tags:['Islands','Diving','Beach'] },

  { id:'rishikesh', name:'Rishikesh', state:'Uttarakhand', region:'North', scene:'hills', palette:'forest',
    tagline:'Rapids by day, Ganga aarti by dusk',
    blurb:'Rafting from Shivpuri, cliff jumping if you are brave, and the evening aarti at Parmarth Niketan which is free and always full.',
    best:'September – November, February – May', nights:2, tags:['Adventure','Yoga','River'] },

  { id:'udaipur', name:'Udaipur', state:'Rajasthan', region:'North', scene:'fort', palette:'rose',
    tagline:'Lake palaces and rooftop sunsets',
    blurb:'City Palace early, boat ride on Pichola late, and a rooftop dinner in Lal Ghat with the lake lit up below.',
    best:'September – March', nights:2, tags:['Lakes','Heritage','Romantic'] },

  { id:'shillong', name:'Shillong', state:'Meghalaya', region:'Northeast', scene:'hills', palette:'forest',
    tagline:'Living root bridges and rain that means it',
    blurb:'Base yourself in Shillong, day-trip to Cherrapunji and Dawki. The double-decker root bridge trek is 3,500 steps down and back up.',
    best:'October – April', nights:4, tags:['Waterfalls','Trekking','Northeast'] },

  { id:'jaisalmer', name:'Jaisalmer', state:'Rajasthan', region:'North', scene:'desert', palette:'sand',
    tagline:'A fort people still live inside',
    blurb:'Sam dunes for the camel sunset, but stay a night in a haveli inside the fort — it empties out beautifully after the day crowds leave.',
    best:'November – February', nights:2, tags:['Desert','Forts','Camping'] },

  { id:'munnar', name:'Munnar', state:'Kerala', region:'South', scene:'hills', palette:'forest',
    tagline:'Tea slopes rolled out to the horizon',
    blurb:'Stay above the town for the view, walk the Kolukkumalai estate at sunrise, and budget a full day for Eravikulam if you want the Nilgiri tahr.',
    best:'September – March', nights:2, tags:['Hills','Tea estates','Honeymoon'] },

  { id:'coorg', name:'Coorg', state:'Karnataka', region:'South', scene:'hills', palette:'forest',
    tagline:'Coffee estates and Kaveri mist',
    blurb:'Abbey Falls in the morning before the buses arrive, a homestay inside a working estate, and Dubare for a river-and-elephant afternoon.',
    best:'October – March', nights:3, tags:['Coffee estates','Homestay','Slow travel'] },

  { id:'pondicherry', name:'Pondicherry', state:'Puducherry', region:'South', scene:'beach', palette:'rose',
    tagline:'French lanes and a Bay of Bengal sunrise',
    blurb:'Cycle the White Town at dawn before the heat, and keep an afternoon free for Auroville. Bring cash — half the cafés do not take cards.',
    best:'October – February', nights:2, tags:['Heritage','Beach','Cafés'] },

  { id:'nainital', name:'Nainital', state:'Uttarakhand', region:'North', scene:'hills', palette:'snow',
    tagline:'A lake town built into the Kumaon hills',
    blurb:'Naina Peak for the sunrise crowd, a quiet paddle on the lake at dusk, and Bhimtal twenty minutes out if Nainital itself feels too busy.',
    best:'March – June, September – November', nights:2, tags:['Lakes','Hills','Family'] },

  { id:'darjeeling', name:'Darjeeling', state:'West Bengal', region:'East', scene:'hills', palette:'snow',
    tagline:'Toy trains and the first light on Kanchenjunga',
    blurb:'Tiger Hill before dawn for the sunrise, a tea estate tour mid-morning, and the Darjeeling Himalayan Railway if you can get a seat.',
    best:'March – May, October – November', nights:3, tags:['Tea estates','Mountains','Heritage'] },

  { id:'gangtok', name:'Gangtok', state:'Sikkim', region:'Northeast', scene:'mountain', palette:'snow',
    tagline:'Prayer flags above the clouds',
    blurb:'MG Marg in the evening, Tsomgo Lake if the pass is open, and a permit sorted a day ahead for Nathula.',
    best:'March – June, October – December', nights:4, tags:['Mountains','Monasteries','Road trip'] },

  { id:'varanasi', name:'Varanasi', state:'Uttar Pradesh', region:'North', scene:'fort', palette:'sand',
    tagline:'The ghats at first light',
    blurb:'A dawn boat ride down the Ganga is the thing everyone remembers. Evening Ganga aarti at Dashashwamedh is loud, crowded, and worth every minute.',
    best:'October – March', nights:2, tags:['Heritage','Spiritual','River'] },

  { id:'hampi', name:'Hampi', state:'Karnataka', region:'South', scene:'fort', palette:'sand',
    tagline:'Boulders, ruins and a lost empire',
    blurb:'Rent a cycle and lose a day among the Vijayanagara ruins. Sunset from Matanga Hill, and a coracle across the river to the quieter Hippie Island side.',
    best:'October – February', nights:3, tags:['Heritage','Ruins','Backpacking'] },

  { id:'amritsar', name:'Amritsar', state:'Punjab', region:'North', scene:'fort', palette:'rose',
    tagline:'The Golden Temple, and the langar that never stops',
    blurb:'The Harmandir Sahib at 4am before the crowds is unforgettable. Stay for the langar, then make the evening Wagah border ceremony an hour before sunset.',
    best:'October – March', nights:2, tags:['Heritage','Spiritual','Food'] },

  { id:'andaman-neil', name:'Neil Island', state:'Andaman Islands', region:'South', scene:'beach', palette:'sea',
    tagline:'Havelock\u2019s quieter neighbour',
    blurb:'A ferry hop from Havelock and a fraction of the crowd. Natural Bridge at low tide, Bharatpur for easy snorkelling, and Laxmanpur for the sunset.',
    best:'October – May', nights:3, tags:['Islands','Beach','Snorkelling'] },

  { id:'sinhagad', name:'Sinhagad Fort', state:'Maharashtra', region:'West', scene:'fort', palette:'forest',
    tagline:'A hill fort with pithla-bhakri at the top',
    blurb:'A steep but short climb (or a drive) up to a fort with real history and a serious view over the Sahyadris. Go early on a weekday — weekends are packed with Pune day-trippers — and eat the hot pithla-bhakri and kanda bhaji at the stalls near the top.',
    best:'June – February', nights:1, tags:['Forts','Trekking','Day trip'] },

  { id:'raigad', name:'Raigad Fort', state:'Maharashtra', region:'West', scene:'fort', palette:'dusk',
    tagline:'Shivaji\u2019s capital, reached by ropeway',
    blurb:'The capital of the Maratha empire, on a plateau 800m up. Take the ropeway if the climb of 1,400-odd steps sounds like too much, and give yourself a full day for the palace ruins, the market street, and the king\u2019s tomb.',
    best:'July – February', nights:1, tags:['Forts','Heritage','Trekking'] },

  { id:'diveagar', name:'Diveagar Beach', state:'Maharashtra', region:'West', scene:'beach', palette:'sea',
    tagline:'A quiet Konkan beach, casuarina-lined',
    blurb:'A long, clean, usually-empty stretch of Konkan coast, backed by suru trees and coconut palms. Homestays serve fresh Malvani seafood thalis, and the Suvarna Ganesh temple is a short ride away.',
    best:'October – March', nights:2, tags:['Beach','Konkan','Slow travel'] },

  { id:'ambyvalley', name:'Aamby Valley', state:'Maharashtra', region:'West', scene:'hills', palette:'forest',
    tagline:'A planned resort city in the Sahyadris',
    blurb:'A gated resort township near Lonavala with a lake, an airstrip, and manicured everything. It reads as more theme-park than wilderness, but the monsoon greenery and the cool air make it a genuine escape from Mumbai heat.',
    best:'August – February', nights:2, tags:['Resort','Lakes','Luxury'] },

  { id:'lonavala', name:'Lonavala', state:'Maharashtra', region:'West', scene:'hills', palette:'forest',
    tagline:'Monsoon waterfalls and warm chikki',
    blurb:'The default weekend hill station for both Mumbai and Pune. Come in the monsoon for the waterfalls at Bhushi Dam and the mist over Tiger\u2019s Leap, and leave with a bag of the chikki the town is famous for.',
    best:'July – February', nights:2, tags:['Hills','Waterfalls','Weekend getaway'] },

  { id:'goldentemple', name:'Golden Temple', state:'Punjab', region:'North', scene:'fort', palette:'sand',
    tagline:'Harmandir Sahib, gold on still water',
    blurb:'The holiest gurdwara in Sikhism, its gold sanctum mirrored in the sarovar around it. Arrive before dawn for the quiet, sit for the langar that feeds tens of thousands a day, and stay for the palki ceremony at night.',
    best:'October – March', nights:2, tags:['Spiritual','Heritage','Food'] },

  { id:'ooty', name:'Ooty', state:'Tamil Nadu', region:'South', scene:'hills', palette:'forest',
    tagline:'The Nilgiri toy train and tea-covered slopes',
    blurb:'The queen of the Nilgiris, reached best on the UNESCO-listed mountain railway from Mettupalayam. Botanical gardens, a boating lake, and endless tea estates — cliché in the best way, and cool year-round.',
    best:'October – June', nights:3, tags:['Hills','Tea estates','Toy train'] }
];

/* hotels: [dest, name, area, stars, pricePerNight, rating, reviews, amenities, blurb] */
const HOTEL_ROWS = [
  ['goa','Casa Anjuna Beach Resort','Anjuna',4,4200,4.4,218,'pool,wifi,breakfast,ac,parking','Two minutes from the flea market, with a pool that stays open till midnight.'],
  ['goa','Palolem Palm Huts','Palolem',3,1850,4.1,164,'wifi,breakfast,beachfront','Bamboo huts a step from the sand. Basic, clean, and right on the quiet end of the beach.'],
  ['goa','The Fontainhas Heritage Stay','Panjim',4,3600,4.6,97,'wifi,breakfast,ac,heritage','A restored Portuguese townhouse in the Latin Quarter, walkable to the Mandovi promenade.'],
  ['goa','Baga Grand Hotel','Baga',3,2400,3.8,302,'pool,wifi,ac,bar,parking','Central, loud, and cheap. Ask for a room away from the street side.'],
  ['goa','Cavelossim Sands Resort','Cavelossim',5,7800,4.7,141,'pool,spa,wifi,breakfast,ac,beachfront','South Goa quiet with a private beach path and a genuinely good breakfast spread.'],

  ['manali','Old Manali Orchard Lodge','Old Manali',3,2200,4.3,186,'wifi,breakfast,heater,parking','Inside an apple orchard, ten minutes uphill from the cafés on the main lane.'],
  ['manali','Solang Valley Retreat','Solang',4,4800,4.5,132,'wifi,breakfast,heater,ac,restaurant','Valley-facing rooms with the ropeway visible from the balcony.'],
  ['manali','Hotel Snow Crest','Mall Road',3,1900,3.9,241,'wifi,heater,restaurant,parking','Right on Mall Road. Convenient rather than charming.'],
  ['manali','The Riverbend Cottages','Vashisht',4,3900,4.6,88,'wifi,breakfast,heater,spa','Beas-facing cottages with a wood stove and a hot spring five minutes away.'],
  ['manali','Naggar Castle View Inn','Naggar',3,2600,4.2,74,'wifi,breakfast,heater,heritage','Quiet, old-town Naggar, twenty minutes from the Manali crowds.'],

  ['jaipur','Amber Haveli','Amer',4,4100,4.5,203,'pool,wifi,breakfast,ac,heritage','A converted haveli below Amber Fort, with a courtyard that catches the evening light.'],
  ['jaipur','Pink City Boutique Hotel','C-Scheme',4,3400,4.3,177,'wifi,breakfast,ac,restaurant,parking','Central, modern, and a ten-minute auto ride from the old city gates.'],
  ['jaipur','Hotel Jantar Residency','Bapu Bazaar',3,1700,3.7,289,'wifi,ac,parking','Budget rooms in the middle of the bazaar. Noisy until about ten at night.'],
  ['jaipur','Rambagh Terrace Suites','Rambagh',5,9600,4.8,116,'pool,spa,wifi,breakfast,ac,restaurant','Garden suites, a serious spa, and high tea on the lawn.'],
  ['jaipur','Nahargarh Sunset Stay','Nahargarh Road',3,2300,4.0,131,'wifi,breakfast,ac,restaurant','Walk up to the fort for sunset and be back for dinner.'],

  ['kerala','Vembanad Houseboat Deluxe','Punnamada',4,6500,4.6,158,'ac,meals,houseboat,wifi','Two-bedroom houseboat with an upper deck and all meals cooked on board.'],
  ['kerala','Backwater Village Homestay','Kumarakom',3,1600,4.4,203,'wifi,breakfast,ac','A family home on a canal. Bicycle included, which is how you should see the village.'],
  ['kerala','Marari Beach Cottages','Mararikulam',4,4400,4.5,124,'pool,wifi,breakfast,ac,beachfront','Fishing-village beach that almost nobody visits. Twenty minutes from Alleppey town.'],
  ['kerala','Alleppey Lake Resort','Finishing Point',4,3800,4.2,167,'pool,wifi,breakfast,ac,restaurant','Walk-out access to the boat jetty, useful if you have an early houseboat check-in.'],
  ['kerala','Ayur Leaf Wellness Stay','Thanneermukkom',5,7200,4.7,89,'spa,pool,wifi,meals,ac','Full Ayurvedic programmes with a resident doctor. Minimum three nights.'],

  ['ladakh','Leh Old Town Guesthouse','Leh',3,1800,4.3,192,'wifi,breakfast,heater','Below the palace, in the restored old-town lanes. Steep walk, worth it.'],
  ['ladakh','Nubra Dunes Camp','Hunder',3,3200,4.4,108,'meals,heater,camping','Swiss tents at the edge of the cold desert, near the double-humped camel dunes.'],
  ['ladakh','Pangong Lakeview Camp','Spangmik',3,3600,4.1,146,'meals,heater,camping','Basic camp, incredible location. No wifi and the power cuts out around eleven.'],
  ['ladakh','The Grand Dragon Leh','Leh',5,11000,4.8,133,'wifi,breakfast,heater,spa,restaurant,ac','The most comfortable bed in Ladakh, with oxygen support on request.'],
  ['ladakh','Thiksey Monastery Stay','Thiksey',3,2100,4.5,67,'meals,heater,heritage','Simple rooms attached to the monastery. Morning prayers start at six.'],

  ['andaman','Radhanagar Beach Resort','Beach No.7',4,6800,4.6,174,'pool,wifi,breakfast,ac,beachfront','Two minutes from the beach that everyone comes here for.'],
  ['andaman','Havelock Dive Lodge','Govind Nagar',3,2900,4.3,151,'wifi,breakfast,ac,diving','Runs its own PADI school. Packages combine the room and the certification.'],
  ['andaman','Neil Island Coral Cottages','Neil Island',3,2400,4.2,96,'wifi,breakfast,beachfront','A ferry hop from Havelock and noticeably quieter.'],
  ['andaman','Barefoot Jungle Villas','Beach No.5',5,12500,4.9,78,'pool,spa,wifi,meals,ac,beachfront','Timber villas inside the forest with a private beach stretch.'],
  ['andaman','Port Blair Harbour Inn','Port Blair',3,1900,3.8,224,'wifi,ac,parking,restaurant','Useful for the night before an early ferry. Not a destination in itself.'],

  ['rishikesh','Ganga Kinare Riverside','Lakshman Jhula',4,3800,4.5,189,'wifi,breakfast,ac,yoga,restaurant','River-facing balconies and a private ghat for the evening aarti.'],
  ['rishikesh','Shivpuri Rafting Camp','Shivpuri',3,1700,4.2,213,'meals,camping,rafting','Riverside tents with rafting included. Bring a torch.'],
  ['rishikesh','Tapovan Yoga Retreat','Tapovan',3,2200,4.4,167,'wifi,meals,yoga,ac','Daily hatha classes at six and four. Silent hours after nine.'],
  ['rishikesh','Aloha on the Ganges','Tapovan',5,8400,4.7,94,'pool,spa,wifi,breakfast,ac,restaurant','The comfortable option, with a pool that looks straight down the river.'],

  ['udaipur','Lal Ghat Haveli','Lal Ghat',3,2100,4.4,232,'wifi,breakfast,heritage,restaurant','Rooftop with a full view of the City Palace and the lake behind it.'],
  ['udaipur','Pichola Lake Resort','Ambrai',4,5200,4.6,148,'pool,wifi,breakfast,ac,restaurant','Sunset side of the lake, which is the side you want for photographs.'],
  ['udaipur','Fateh Sagar Boutique Stay','Fateh Sagar',4,3600,4.3,119,'wifi,breakfast,ac,parking','Away from the tourist crush, near the quieter of the two lakes.'],
  ['udaipur','Jagmandir Palace Suites','Jag Mandir',5,14500,4.9,64,'pool,spa,wifi,meals,ac,heritage','An island palace reached only by boat. Priced accordingly.'],

  ['shillong','Cherrapunji Cliff Resort','Sohra',4,4600,4.5,127,'wifi,breakfast,restaurant,heater','Rooms facing the Bangladesh plains, with the valley clouding over most afternoons.'],
  ['shillong','Police Bazaar Guest House','Police Bazaar',3,1500,3.9,198,'wifi,heater,parking','Cheap, central, and walkable to everything in Shillong town.'],
  ['shillong','Dawki Riverside Camp','Dawki',3,2600,4.3,89,'meals,camping','Tents by the Umngot, which is the river with the transparent water.'],
  ['shillong','Ri Kynjai Serenity','Umiam Lake',5,9800,4.8,102,'spa,wifi,breakfast,ac,restaurant','Khasi-style cottages above Umiam Lake. Twenty minutes out of town.'],

  ['jaisalmer','Fort Haveli Jaisalmer','Inside the Fort',3,2200,4.4,176,'wifi,breakfast,heritage,restaurant','A 300-year-old haveli inside the living fort. Rooftop dinners in winter.'],
  ['jaisalmer','Sam Desert Camp','Sam Dunes',4,3900,4.3,208,'meals,camping,ac','Camel ride, folk music, and a tent with an actual bathroom.'],
  ['jaisalmer','Gadisar Lake View Hotel','Gadisar',3,1600,3.9,143,'wifi,ac,parking,restaurant','Quiet, close to the lake, and a short walk from the fort gate.'],
  ['jaisalmer','Suryagarh Desert Palace','Kahala Phata',5,13800,4.9,87,'pool,spa,wifi,meals,ac,heritage','A fortress-style hotel in open desert. Sunrise breakfasts on the dunes.'],

  ['munnar','Tea Country Resort','Devikulam',4,4300,4.5,142,'wifi,breakfast,ac,restaurant','Estate-facing rooms with a private tea-tasting room downstairs.'],
  ['munnar','Kolukkumalai Base Camp','Kolukkumalai',3,2600,4.4,88,'meals,camping,heater','The base camp for the sunrise jeep ride to the highest organic tea estate.'],
  ['munnar','Windermere Munnar','Chinnakanal',5,8900,4.8,97,'pool,spa,wifi,breakfast,ac,restaurant','Colonial-style cottages with fireplaces and a view down the valley.'],
  ['munnar','Green Valley Homestay','Pothamedu',3,1900,4.3,131,'wifi,breakfast,parking','A working spice garden attached, and a home-cooked Kerala breakfast every morning.'],

  ['coorg','Plantation Trail Estate','Madikeri',4,4700,4.6,118,'pool,wifi,breakfast,ac,restaurant','A working coffee estate with guided walks through the plantation.'],
  ['coorg','Dubare Riverside Camp','Dubare',3,2300,4.2,96,'meals,camping,rafting','Elephant camp mornings and a riverside bonfire most nights.'],
  ['coorg','Coorg Wilderness Resort','Galibeedu',5,9200,4.7,104,'pool,spa,wifi,breakfast,ac,restaurant','Treehouse-style villas above the canopy, ten minutes from Abbey Falls.'],
  ['coorg','Namdroling Homestay','Kushalnagar',3,1800,4.4,73,'wifi,breakfast,parking','Walking distance from the Golden Temple, run by a Kodava family for three generations.'],

  ['pondicherry','White Town Heritage Villa','White Town',4,4600,4.6,156,'wifi,breakfast,ac,heritage','A French-colonial villa two streets from the promenade, courtyard breakfast included.'],
  ['pondicherry','Auroville Eco Stay','Auroville',3,2100,4.3,84,'wifi,breakfast,meals','Simple rooms inside the Auroville township, quiet and deliberately unplugged.'],
  ['pondicherry','Promenade Bay Resort','Beach Road',5,8600,4.8,91,'pool,spa,wifi,breakfast,ac,restaurant','Sea-facing rooms right on the promenade, best sunrise view in town.'],
  ['pondicherry','Rue Bussy Boutique','Rue Bussy',4,3400,4.5,102,'wifi,breakfast,ac','Colourful, small, and booked out weeks ahead in December.'],

  ['nainital','Naini Lake View Hotel','Mallital',4,3800,4.4,167,'wifi,breakfast,ac,restaurant','Rooms above the lake, five minutes from the boat club.'],
  ['nainital','Bhimtal Orchard Cottage','Bhimtal',3,2200,4.3,79,'wifi,breakfast,parking','A quieter lake, twenty minutes out, with an apple orchard on the property.'],
  ['nainital','Snow View Heritage Hotel','Mall Road',3,2600,3.9,134,'wifi,heater,restaurant,parking','Old colonial building right on the Mall, worn but full of character.'],

  ['darjeeling','Windamere Heritage Hotel','Observatory Hill',5,7600,4.7,112,'wifi,breakfast,heater,restaurant,heritage','A 19th-century planters club turned hotel, with fireplaces in every room.'],
  ['darjeeling','Tea Garden View Lodge','Ghum',3,2400,4.3,98,'wifi,breakfast,heater','Estate views on both sides, close to the toy-train loop at Batasia.'],
  ['darjeeling','Mall Road Residency','Chowrasta',3,2100,4.0,143,'wifi,heater,restaurant,parking','Central, walkable to Chowrasta square, basic but reliably clean.'],

  ['gangtok','MG Marg Boutique Stay','MG Marg',4,4200,4.5,121,'wifi,breakfast,ac,restaurant','Steps from the pedestrian promenade, mountain views from the upper floors.'],
  ['gangtok','Tsomgo Heights Retreat','Tadong',4,5100,4.6,87,'wifi,breakfast,heater,restaurant','A quieter base with the best sunrise-over-Kanchenjunga rooms in town.'],
  ['gangtok','Ranka Monastery Homestay','Ranka',3,1900,4.4,58,'wifi,breakfast,heater','A family home beside the monastery, simple and genuinely warm.'],

  ['varanasi','Ganges View Heritage','Assi Ghat',4,4200,4.6,167,'wifi,breakfast,ac,heritage,restaurant','A restored heritage house right on Assi Ghat, with a terrace over the river.'],
  ['varanasi','BrijRama Palace','Darbhanga Ghat',5,11500,4.8,124,'wifi,breakfast,ac,heritage,restaurant','An 18th-century palace on the ghats, reached by boat, with river-facing suites.'],
  ['varanasi','Old City Guesthouse','Dashashwamedh',3,1600,4.1,203,'wifi,ac','In the lanes behind the main ghat. Basic, spotless, and two minutes from the aarti.'],
  ['varanasi','Cantonment Comfort Inn','Cantonment',3,2200,3.9,148,'wifi,ac,parking,restaurant','Quieter side of the city near the station, useful for an early train out.'],

  ['hampi','Hampi Boulders Resort','Kaddirampura',4,4600,4.6,112,'pool,wifi,breakfast,ac,restaurant','Cottages tucked among the granite boulders, with a natural rock pool.'],
  ['hampi','Hippie Island Huts','Virupapur Gaddi',3,1400,4.3,178,'wifi,breakfast,riverside','Bamboo huts across the river, paddy-field views, hammocks, no rush.'],
  ['hampi','Heritage Bazaar Stay','Hampi Bazaar',3,1700,4.0,134,'wifi,breakfast','Walking distance to the Virupaksha temple, in the old bazaar itself.'],
  ['hampi','Evolve Back Hampi','Kamalapura',5,13500,4.9,88,'pool,spa,wifi,breakfast,ac,restaurant','Vijayanagara-inspired luxury with courtyards, arches, and a serious spa.'],

  ['amritsar','Golden Temple View Hotel','Heritage Street',4,3800,4.5,192,'wifi,breakfast,ac,restaurant','Rooftop with a direct line of sight to the temple, five minutes from the langar hall.'],
  ['amritsar','Ranjit\u2019s SVAASA Haveli','Mall Road',5,8200,4.7,96,'pool,spa,wifi,breakfast,ac,heritage','A 250-year-old heritage haveli, all wellness and old-Punjab charm.'],
  ['amritsar','Backpacker\u2019s Nest','Katra Ahluwalia',3,1300,4.2,221,'wifi,breakfast','Cheap, central, and a two-minute walk to the temple. Sociable rooftop.'],
  ['amritsar','Hyatt Amritsar','GT Road',5,7600,4.6,141,'pool,spa,wifi,breakfast,ac,restaurant,parking','Full-service comfort on the edge of town, best for families and drivers.'],

  ['andaman-neil','Neil Beachfront Cottages','Laxmanpur',4,4100,4.5,118,'wifi,breakfast,ac,beachfront','Steps from the sunset beach, with a handful of sea-facing cottages.'],
  ['andaman-neil','Bharatpur Dive Lodge','Bharatpur',3,2600,4.3,94,'wifi,breakfast,diving','Runs snorkelling and intro-dive trips off the calm eastern reef.'],
  ['andaman-neil','Summer Sand Beach Resort','Sitapur',4,5400,4.6,77,'pool,wifi,breakfast,ac,beachfront,restaurant','On the sunrise side, quiet and green, good for a proper unwind.'],
  ['andaman-neil','Coconut Grove Homestay','Neil Kendra',3,1800,4.4,63,'wifi,breakfast','A family place near the jetty, bicycles included, honest home cooking.'],

  ['sinhagad','Sinhagad Valley Resort','Donje',3,2400,4.1,96,'wifi,breakfast,parking,restaurant','At the base of the fort road, a handy overnight before an early-morning climb.'],
  ['sinhagad','Atkawadi Farm Stay','Atkawadi',3,1900,4.3,58,'wifi,breakfast,parking','A working farm stay in the foothills, quiet and cheap, with home-cooked Maharashtrian food.'],
  ['sinhagad','Khadakwasla Lake Lodge','Khadakwasla',4,3600,4.4,82,'wifi,breakfast,ac,restaurant','Lakeside rooms on the Pune side, a short drive from both the fort and the city.'],

  ['raigad','Raigad Hill Retreat','Pachad',4,3800,4.4,74,'wifi,breakfast,ac,restaurant,parking','At the base near the ropeway station, with fort-facing rooms and an early breakfast for climbers.'],
  ['raigad','Pachad Heritage Homestay','Pachad',3,2100,4.2,51,'wifi,breakfast,parking','A simple family stay in the village below the fort, big Maratha thalis at dinner.'],
  ['raigad','MTDC Raigad Resort','Raigad Base',3,2600,3.9,118,'wifi,restaurant,parking','The state tourism property — dated but well-placed, right where the ropeway leaves from.'],

  ['diveagar','Diveagar Beach Homestay','Diveagar',3,2200,4.5,103,'wifi,breakfast,beachfront','A Konkan family home a two-minute walk from the sand, Malvani seafood thalis on request.'],
  ['diveagar','Suvarnaganesh Beach Resort','Diveagar North',4,3900,4.4,87,'pool,wifi,breakfast,ac,beachfront,restaurant','The comfortable option, with a pool and direct beach access near the Suvarna Ganesh temple.'],
  ['diveagar','Casa Konkan','Bharadkhol',4,3400,4.6,62,'wifi,breakfast,ac,beachfront','A small boutique guesthouse on a quieter stretch, sea-facing balconies and a good kitchen.'],
  ['diveagar','Palm Shade Cottages','Diveagar',3,1800,4.2,79,'wifi,breakfast,parking','Budget cottages under the coconut palms, a short walk back from the beach road.'],

  ['ambyvalley','Aamby Valley City Resort','Aamby Valley',5,12000,4.5,134,'pool,spa,wifi,breakfast,ac,restaurant,parking','Lakeside villas inside the gated township, with the full resort-city amenities.'],
  ['ambyvalley','Lakeview Chalets','Aamby Valley',5,9800,4.4,88,'pool,wifi,breakfast,ac,restaurant','Timber chalets overlooking the artificial lake, quiet and manicured.'],
  ['ambyvalley','Sahyadri Greens','Bhurse',4,5200,4.2,66,'pool,wifi,breakfast,ac,parking','Just outside the gates, a cheaper way to be near the valley with hill views.'],

  ['lonavala','The Machan Treehouse','Jambulne',5,11500,4.7,152,'wifi,breakfast,restaurant','Eco treehouses on stilts in a private forest — the memorable splurge near Lonavala.'],
  ['lonavala','Sunny\u2019s Lonavala Villa','Tungarli',4,4600,4.4,118,'pool,wifi,breakfast,ac,parking','A hillside villa with a pool and valley views, ten minutes from the main market.'],
  ['lonavala','Kumar Resort','Lonavala',3,2800,3.9,203,'pool,wifi,ac,restaurant,parking','Central, family-focused, a little dated but reliable and walkable to the chikki shops.'],
  ['lonavala','Bhushi Dam Homestay','INS Shivaji Road',3,2100,4.2,74,'wifi,breakfast,parking','A quiet homestay close to the waterfalls, best in the monsoon.'],
  ['lonavala','Della Resorts','Kunegaon',5,13500,4.6,167,'pool,spa,wifi,breakfast,ac,restaurant,bar','The adventure-and-luxury resort, with the big activity park attached.'],

  ['goldentemple','Hotel Golden Sarovar','Heritage Street',4,4200,4.5,231,'wifi,breakfast,ac,restaurant','A two-minute walk from the temple entrance on the pedestrianised heritage street.'],
  ['goldentemple','Temple View Boutique','Jallianwala Bagh Road',4,3600,4.4,148,'wifi,breakfast,ac','Upper rooms with a clear view of the golden dome, close to Jallianwala Bagh.'],
  ['goldentemple','SGPC Sarai','Temple Complex',2,600,4.1,312,'wifi','The gurdwara\u2019s own pilgrim lodging — spartan and astonishingly cheap, right beside the sarovar.'],
  ['goldentemple','Taj Swarna','Mall Road',5,9800,4.7,176,'pool,spa,wifi,breakfast,ac,restaurant,parking','Full luxury a short ride from the temple, the choice for a comfortable base.'],

  ['ooty','Fern Hill Heritage Hotel','Fernhill',4,4800,4.4,142,'wifi,breakfast,heater,restaurant,heritage','A restored maharaja-era property on a wooded hill, all fireplaces and old wood.'],
  ['ooty','Tea Estate Bungalow','Coonoor Road',4,4200,4.6,97,'wifi,breakfast,heater','A working-estate bungalow between Ooty and Coonoor, with the tea slopes at the door.'],
  ['ooty','Lake View Lodge','Charing Cross',3,2400,4.0,188,'wifi,heater,restaurant,parking','Central and walkable to the lake and the toy-train station, plain but well-placed.'],
  ['ooty','Sterling Ooty','Fern Hill',4,5600,4.3,124,'wifi,breakfast,ac,restaurant,parking','The dependable mid-range resort, good for families doing the gardens-and-lake circuit.'],
  ['ooty','Kurinji Homestay','Kotagiri Road',3,1900,4.5,71,'wifi,breakfast,heater,parking','A Badaga family homestay towards Kotagiri, quiet and cool with home-grown produce.']
];

const AMENITY_LABELS = {
  pool:'Pool', wifi:'Free wifi', breakfast:'Breakfast', ac:'Air conditioning',
  parking:'Parking', spa:'Spa', bar:'Bar', restaurant:'Restaurant',
  beachfront:'Beachfront', heater:'Room heater', meals:'All meals',
  houseboat:'Houseboat', camping:'Camping', diving:'Diving centre',
  rafting:'Rafting', yoga:'Yoga classes', heritage:'Heritage property'
};

const HOTELS = HOTEL_ROWS.map(function (r, i) {
  const d = DESTINATIONS.find(x => x.id === r[0]);
  return {
    id: r[0] + '-' + String(i + 1).padStart(2, '0'),
    dest: r[0], destName: d ? d.name : r[0], state: d ? d.state : '',
    scene: d ? d.scene : 'mountain', palette: d ? d.palette : 'dusk',
    name: r[1], area: r[2], stars: r[3], price: r[4],
    rating: r[5], reviews: r[6],
    amenities: r[7].split(','), blurb: r[8]
  };
});

DESTINATIONS.forEach(function (d) {
  const hs = HOTELS.filter(h => h.dest === d.id);
  d.hotelCount = hs.length;
  d.fromPrice = hs.length ? Math.min.apply(null, hs.map(h => h.price)) : 0;
});

/* Places deliberately NOT in the catalogue.
   This is a designed experiment: it guarantees a realistic search-failure rate
   instead of an artificial 100% success rate. Document this in the report. */
const NOT_STOCKED = ['shimla','mussoorie','ooty','kodaikanal','auli','dalhousie','lonavala','mount abu','wayanad','spiti'];

/* ======================================================================
   Package tours — what makes this a travel agency rather than a
   hotel-only OTA. Each package bundles 2-3 destinations into one priced,
   fixed-departure itinerary with day-by-day stops.
   ====================================================================== */
const PACKAGES = [
  { id:'rajasthan-royals', name:'Rajasthan Royals', theme:'Heritage', scene:'fort', palette:'sand',
    dests:['jaipur','udaipur','jaisalmer'], nights:8, price:34500, groupSize:'2–16',
    departs:['Oct 12','Nov 09','Dec 14','Jan 18'],
    tagline:'Three forts, three lakes, one very long dinner in the desert.',
    blurb:'The classic Rajasthan circuit, paced so you are never doing more than one fort a day. Private car and driver throughout, so nobody has to argue about who navigates.',
    inclusions:['AC private car with driver, all eight days','7 nights in 4-star heritage properties','Daily breakfast, 4 dinners including the desert camp','All monument entry fees','One camel-cart sunset at Sam Dunes'],
    exclusions:['Flights or trains to and from Jaipur / from Jaisalmer','Lunch on touring days','Personal expenses and tips'],
    itinerary:[
      ['Day 1–3','Jaipur','Arrive Jaipur. Amber Fort, City Palace, Hawa Mahal, an evening at Chokhi Dhani.'],
      ['Day 4–5','Udaipur','Drive to Udaipur (6 hrs). City Palace, a Pichola boat ride, rooftop dinner in Lal Ghat.'],
      ['Day 6–8','Jaisalmer','Drive to Jaisalmer (6 hrs). Fort haveli stay, Sam Dunes camel sunset, desert camp dinner.']
    ] },

  { id:'kerala-backwaters', name:'Kerala Backwaters & Hills', theme:'Slow travel', scene:'backwater', palette:'forest',
    dests:['kerala','munnar'], nights:6, price:27800, groupSize:'2–12',
    departs:['Sep 20','Oct 25','Nov 22','Feb 14'],
    tagline:'A houseboat night, then two days doing nothing on a tea slope.',
    blurb:'Half the trip on water, half in the hills. No early starts, no long drives — this one is built for people who actually want a holiday.',
    inclusions:['Private car with driver','1 night overnight houseboat, all meals on board','5 nights in hill and backwater properties','Daily breakfast','A guided walk through a working tea estate'],
    exclusions:['Flights to Kochi','Lunch and dinner outside the houseboat night','Ayurvedic treatments (bookable locally)'],
    itinerary:[
      ['Day 1–2','Kochi → Alleppey','Arrive Kochi, drive to Alleppey. Board the houseboat by 12pm, cruise the backwaters overnight.'],
      ['Day 3–4','Alleppey → Munnar','Disembark, drive to Munnar (4 hrs). Settle in, evening at leisure.'],
      ['Day 5–6','Munnar','Eravikulam National Park, a tea-estate walk, and a free day to do as little as possible.']
    ] },

  { id:'himalayan-high-road', name:'The Himalayan High Road', theme:'Adventure', scene:'mountain', palette:'dusk',
    dests:['manali','ladakh'], nights:10, price:48000, groupSize:'4–14',
    departs:['Jun 08','Jul 06','Aug 03','Sep 07'],
    tagline:'Manali to Leh overland, over five mountain passes.',
    blurb:'The road trip every biker talks about, done in a car with someone else driving. Built-in acclimatisation days in Leh so altitude does not ruin the second half.',
    inclusions:['4x4 vehicle with experienced high-altitude driver','9 nights across Manali, Leh, Nubra and Pangong','Daily breakfast and dinner','Inner Line Permits for Nubra and Pangong','Oxygen cylinder carried in-vehicle as a precaution'],
    exclusions:['Flights to Manali or from Leh','Lunch on touring days','Travel insurance (mandatory — we can help you arrange it)'],
    itinerary:[
      ['Day 1–3','Manali','Old Manali, Solang Valley, a day trip through the Atal Tunnel into Lahaul.'],
      ['Day 4–6','Manali → Leh','Overland via Sarchu (2 days on the road), then two full days in Leh to acclimatise.'],
      ['Day 7–8','Nubra Valley','Khardung La, the cold-desert dunes at Hunder, a night in a Nubra camp.'],
      ['Day 9–10','Pangong Lake','Drive via Chang La. A night at Pangong, then return to Leh for departure.']
    ] },

  { id:'northeast-untamed', name:'Northeast Untamed', theme:'Offbeat', scene:'hills', palette:'forest',
    dests:['shillong','gangtok'], nights:9, price:41200, groupSize:'2–10',
    departs:['Oct 05','Nov 02','Mar 08','Apr 12'],
    tagline:'Living root bridges and the road to Nathu La, one trip.',
    blurb:'Two states most Indian travellers still have not been to. This one covers Meghalaya waterfalls and Sikkim monasteries without the usual back-and-forth flights, via a scenic overland link.',
    inclusions:['Private vehicle throughout, including the Shillong–Gangtok transfer','8 nights across Meghalaya and Sikkim','Daily breakfast, 5 dinners','Permits for Tsomgo Lake and (weather-permitting) Nathu La','A guide for the living-root-bridge trek'],
    exclusions:['Flights to Guwahati or from Bagdogra','Lunch on touring days','Nathu La entry if the pass is weather-closed (refunded, not guaranteed)'],
    itinerary:[
      ['Day 1–4','Shillong','Cherrapunji waterfalls, Dawki clear river, the double-decker root bridge trek at Nongriat.'],
      ['Day 5','Transfer','Scenic drive and flight connection via Guwahati to Bagdogra, on to Gangtok.'],
      ['Day 6–9','Gangtok','MG Marg, Tsomgo Lake, Nathu La (permit-dependent), a monastery morning at Rumtek.']
    ] },

  { id:'golden-triangle', name:'Golden Triangle Express', theme:'First-timer', scene:'fort', palette:'rose',
    dests:['jaipur'], nights:4, price:16800, groupSize:'2–20',
    departs:['Every Friday'],
    tagline:'Jaipur, done properly, in a long weekend.',
    blurb:'Built for people with four days and a first trip to Rajasthan. Every stop is inside a 20-minute drive of the last one — nothing here is a long-haul day.',
    inclusions:['AC car with driver, all four days','3 nights in a heritage haveli','Daily breakfast','All monument and fort entry fees'],
    exclusions:['Flights or train to Jaipur','Lunch and dinner','Chokhi Dhani evening (bookable as an add-on)'],
    itinerary:[
      ['Day 1','Arrival','Check in, an easy first evening around Bapu Bazaar.'],
      ['Day 2','Amber & City','Amber Fort at opening time, City Palace, Jantar Mantar.'],
      ['Day 3','Hawa Mahal & Nahargarh','Hawa Mahal from the café across the road, sunset at Nahargarh Fort.'],
      ['Day 4','Departure','Free morning, departure transfer.']
    ] },

  { id:'south-coast-honeymoon', name:'South Coast Honeymoon', theme:'Honeymoon', scene:'hills', palette:'rose',
    dests:['munnar','coorg'], nights:7, price:38500, groupSize:'2 only',
    departs:['On request, any date'],
    tagline:'Two hill stations, zero group tours.',
    blurb:'Private car, private walks, and rooms picked specifically for the view rather than the price. Departs whenever you want — this one is not on a fixed calendar.',
    inclusions:['Private car with driver','6 nights in couple-focused properties','Daily breakfast, 3 candlelit dinners','A private tea-estate walk in Munnar','A coffee-tasting session on a Coorg estate'],
    exclusions:['Flights to Kochi or from Bangalore','Lunch on touring days','Spa treatments (bookable locally)'],
    itinerary:[
      ['Day 1–3','Munnar','Tea-garden views, Eravikulam, a private candlelit dinner on the second night.'],
      ['Day 4','Transfer','Scenic drive to Coorg (5 hrs) through the Western Ghats.'],
      ['Day 5–7','Coorg','Abbey Falls, a working coffee estate, Dubare, and a final sunset dinner.']
    ] }
];

PACKAGES.forEach(function (p) {
  p.destNames = p.dests.map(id => (DESTINATIONS.find(d => d.id === id) || {}).name).filter(Boolean);
  p.perDay = Math.round(p.price / p.nights);
});

const THEMES = [...new Set(PACKAGES.map(p => p.theme))];

/* ======================================================================
   Agency content — testimonials and advisors (both explicitly named as
   optional pages/sections in the course brief)
   ====================================================================== */
const TESTIMONIALS = [
  { name:'Ritika Sharma', trip:'Rajasthan Royals', rating:5,
    quote:'Our driver knew exactly when each fort was least crowded. Worth it just for that.' },
  { name:'Aman & Divya', trip:'South Coast Honeymoon', rating:5,
    quote:'Asked for a quiet trip with good views and that is exactly what we got. No group, no rush.' },
  { name:'Kabir Nair', trip:'Himalayan High Road', rating:4,
    quote:'The acclimatisation days in Leh were the right call — friends who skipped them had a rough time.' },
  { name:'Sneha Iyer', trip:'Kerala Backwaters & Hills', rating:5,
    quote:'The houseboat food was better than half the restaurants we ate at in Kochi.' },
  { name:'Farhan Sheikh', trip:'Northeast Untamed', rating:5,
    quote:'Barely anyone we know has been to Meghalaya. Now I understand why more people should.' },
  { name:'Priya Deshmukh', trip:'Golden Triangle Express', rating:4,
    quote:'Perfect for a long weekend. Nothing felt rushed even with only four days.' }
];

const ADVISORS = [
  { name:'Rohan Mehta', role:'Rajasthan & the desert circuit', scene:'desert', palette:'sand',
    bio:'Grew up in Jodhpur, has driven the Jaipur–Jaisalmer road more times than he can count.' },
  { name:'Ayesha Khan', role:'Kerala & the Western Ghats', scene:'backwater', palette:'forest',
    bio:'Trained as a naturalist before switching to travel planning. Will talk your ear off about birds.' },
  { name:'Tenzin Dorje', role:'Ladakh & the high Himalaya', scene:'mountain', palette:'dusk',
    bio:'Leh-based for eleven years. The person who decides whether your acclimatisation plan is realistic.' },
  { name:'Ibaroi Lyngdoh', role:'Northeast India', scene:'hills', palette:'forest',
    bio:'From Shillong. Knows which root bridges are open and which are resting for the season.' }
];

const FAQS = [
  ['How far ahead should I book?','For Goa, Manali and Jaisalmer in peak season, four to six weeks. Havelock ferries sell out earliest — start there if the Andamans are on your list. Fixed-departure packages fill up roughly six weeks ahead.'],
  ['Can I cancel a booking or a package?','Hotel bookings: free cancellation up to 72 hours before check-in. Packages: full refund up to 21 days before departure, 50% up to 7 days, no refund inside 7 days — the vehicle and permits are booked on your behalf by then.'],
  ['Do prices include taxes?','Prices shown are per night, or per person for packages, before GST. The total on the booking or enquiry page includes tax and any property fee.'],
  ['Is there a booking fee?','No. You pay the property or package rate. We earn a commission from the hotel or the ground operator, not from you.'],
  ['What ID do I need at check-in?','Any government photo ID for Indian nationals. Foreign nationals need a passport and visa page, and Ladakh permits for Nubra and Pangong.'],
  ['Can a package be customised?','Yes — every package on this site is a starting point. Use the enquiry form on the package page and an advisor will adjust nights, hotels, or the route.'],
  ['What if the property looks different from the pictures?','Message us within two hours of check-in and we will move you or refund the stay.'],
  ['Are the photos of the exact hotel room?','Photos represent the destination and neighbourhood, and may not show the exact room you book. Where a real photo of a location isn\u2019t available, we show an illustrated view instead. The written description is always specific to the property.']
];

/* ======================================================================
   v2.1 — coupons and seeded reviews
   ====================================================================== */
const COUPONS = {
  WELCOME10:  { type:'percent', value:10, label:'10% off', appliesTo:'all' },
  FIRST500:   { type:'flat',    value:500, label:'\u20b9500 off', appliesTo:'all' },
  TRIP15:     { type:'percent', value:15, label:'15% off package tours', appliesTo:'package' },
  STAY300:    { type:'flat',    value:300, label:'\u20b9300 off hotel stays', appliesTo:'hotel' }
};

const REVIEW_NAMES = ['Aisha K.','Rohan M.','Priya S.','Karan V.','Neha R.','Arjun P.',
  'Simran K.','Vikram J.','Ananya D.','Rahul T.','Fatima A.','Suresh N.'];
const REVIEW_TEMPLATES = [
  'Exactly as described. {thing} was the highlight.',
  'Good value for the price. {thing} could be better but overall happy.',
  '{thing} made the whole trip. Would book again.',
  'Booking was smooth, {thing} was a pleasant surprise.',
  'Stayed here on our own, no complaints. {thing} stood out.',
  'A little pricier than expected but {thing} justified it.',
  'Would recommend to anyone visiting. {thing} especially.',
  'Second time booking with Yatra Kosh, consistent experience. {thing} again this time.'
];
const REVIEW_THINGS = ['the location','the staff','the breakfast','the view','the cleanliness',
  'the driver','the itinerary pacing','the room','the sunset spot','the value for money'];

/* deterministic per-entity pseudo-random so the same id always shows the same seed reviews */
function seedRand(seed){
  let s = 0;
  for (let i=0;i<String(seed).length;i++) s = (s*31 + String(seed).charCodeAt(i)) % 233280;
  return function(){ s = (s*9301+49297) % 233280; return s/233280; };
}
function seededReviews(entityId, count){
  const r = seedRand(entityId);
  const out = [];
  for (let i=0;i<count;i++){
    const name = REVIEW_NAMES[Math.floor(r()*REVIEW_NAMES.length)];
    const rating = [4,4,5,5,5,3][Math.floor(r()*6)];
    const thing = REVIEW_THINGS[Math.floor(r()*REVIEW_THINGS.length)];
    const tpl = REVIEW_TEMPLATES[Math.floor(r()*REVIEW_TEMPLATES.length)];
    const daysAgo = 4 + Math.floor(r()*160);
    out.push({ name, rating, text: tpl.replace('{thing}', thing), daysAgo });
  }
  return out;
}
