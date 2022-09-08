# Restaurant Coding Exercise

This is a coding exercise to find open restaurants from a JSON file using a date and time chosen by the user.

This API is intended to be run as a Node.js Azure Function. A live example can be viewed at <https://restaurant-finder.azurewebsites.net/api/RestaurantFinder?date=[DATE]&time=[TIME]>, with the [DATE] query parameter replaced with a url-safe date (i.e. - 2022-10-20) and the [TIME] query parameter replaced with a url-safe time (i.e. - 12:30%20pm).

Navigating to <https://restaurant-finder.azurewebsites.net/api/RestaurantFinder?date=2022-09-01&time=7:30%20pm> will return the following JSON results:

```JSON
{
  "restaurants": [
    "Kushi Tsuru",
    "Osakaya Restaurant",
    "The Stinking Rose",
    "McCormick & Kuleto's",
    "Mifune Restaurant",
    "The Cheesecake Factory",
    "New Delhi Indian Restaurant",
    "Iroha Restaurant",
    "Rose Pistola",
    "Alioto's Restaurant",
    "Canton Seafood & Dim Sum Restaurant",
    "All Season Restaurant",
    "Bombay Indian Restaurant",
    "Sam's Grill & Seafood Restaurant",
    "2G Japanese Brasserie",
    "Restaurant Lulu",
    "Sudachi",
    "Hanuri",
    "Herbivore",
    "Penang Garden",
    "John's Grill",
    "Quan Bac",
    "Bamboo Restaurant",
    "Burger Bar",
    "Blu Restaurant",
    "Naan 'N' Curry",
    "Shanghai China Restaurant",
    "Tres",
    "Isobune Sushi",
    "Viva Pizza Restaurant",
    "Far East Cafe",
    "Parallel 37",
    "Bai Thong Thai Cuisine",
    "Alhamra",
    "A-1 Cafe Restaurant",
    "Nick's Lighthouse",
    "Paragon Restaurant & Bar",
    "Chili Lemon Garlic",
    "Bow Hon Restaurant",
    "San Dong House",
    "Thai Stick Restaurant",
    "Cesario's",
    "Colombini Italian Cafe Bistro",
    "Sabella & La Torre",
    "Soluna Cafe and Lounge",
    "Tong Palace",
    "India Garden Restaurant",
    "Sapporo-Ya Japanese Restaurant",
    "Santorini's Mediterranean Cuisine",
    "Kyoto Sushi",
    "Marrakech Moroccan Restaurant"
  ]
}
```