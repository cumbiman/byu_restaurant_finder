# Restaurant Coding Exercise

This is a coding exercise to find open restaurants from a JSON file using a date and time chosen by the user.

This API is intended to be run as a Node.js Azure Function. A live example can be viewed at <https://restaurant-finder.azurewebsites.net/api/RestaurantFinder?date=[DATE]&time=[TIME]>, with the [DATE] query parameter replaced with a url-safe date (i.e. - 2022-10-20) and the [TIME] query parameter replaced with a url-safe time (i.e. - 12:30%20pm).

For example, navigating to <https://restaurant-finder.azurewebsites.net/api/RestaurantFinder?date=2022-09-01&time=7:30%20pm> will return the following `application/json` results:

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

## To run the function app locally

1. Either install the [Azure Functions VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) or [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cwindows%2Cnode%2Cportal%2Cbash#start).
2. Run `func start` from the command line or "Execute function now..." from the function in the Azure plugins local workspace.
3. Navigate to <http://localhost:7071/api/RestaurantFinder?date=[DATE]&time=[TIME]> to receive results from the local endpoint.

## To run the unit tests
1. Enter `npm install` in a command prompt at the root of the project. This will install the Jest testing tool.
2. Enter `npm test` in a command prompt at the root of the project. This will initiate the tests and return the results.
3. If you would like to review the test coverage, run `npm run test-coverage`.