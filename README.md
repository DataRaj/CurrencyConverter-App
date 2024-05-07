# Currency Converter

<img src="https://github.com/qur786/react-native-currency-converter/assets/79472606/2c4a4c0a-8c88-4441-9063-e0c12b5c0961" alt="Home Page" width="200" height="400" />

<img src="https://github.com/qur786/react-native-currency-converter/assets/79472606/b1c8dbf2-4db3-4920-a38f-b74e4cd26594" alt="Conversion Page" width="200" height="400" />

## Description

Currency Converter is a mobile application built with React Native that allows users to convert between over 170 currencies. It facilitates easy calculations for currency exchange rates between different countries.

## Features

- **Extensive Currency Database:** Access to 170+ currencies for accurate conversions.
- **Interactive UI Dropdown:** Utilizes [react-native-dropdown-picker](https://www.npmjs.com/package/react-native-dropdown-picker) for intuitive base and conversion currency selection.
- **Error Messaging:** Incorporated [react-native-snackbar](https://www.npmjs.com/package/react-native-snackbar) to display various error messages for seamless user experience.
- **Real-Time Exchange Rates:** Utilizes the [Fixer API](https://fixer.io/) to provide up-to-date exchange rates.
- **Flag Display:** Shows corresponding country flags using Unicode icons alongside currency names.
- **Caching with SQLite:** Implements caching of exchange data using [react-native-sqlite-storage](https://www.npmjs.com/package/react-native-sqlite-storage) to reduce network interactions, enabling faster calculations and avoiding unnecessary API requests.
- **Fallback Exchange Data:** Utilizes a JSON file as a fallback for exchange data when the SQLite DB has no prior data or when the Fixer API is inaccessible due to reasons such as API limit exhaustion.
- **Offline Page with SVG:** Added a visually appealing UI for the offline page using the `react-native-svg` package.
- **Interchange Base and Conversion Currencies:** Now you can easily switch between two already selected currencies to view the conversion rate and convert amounts between them.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `react-native run-android` or `react-native run-ios` to start the application.

## Usage

1. Select the base and conversion currencies from the dropdown.
2. Enter the amount to convert.
3. View the converted amount instantly.

## Dependencies

- react: 18.2.0
- react-native: 0.73.1
- react-native-dropdown-picker: ^5.4.6
- react-native-snackbar: ^2.6.2
- react-native-sqlite-storage: ^6.0.1
- react-native-svg: ^14.1.0

## API Reference

- [Fixer API](https://fixer.io/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
