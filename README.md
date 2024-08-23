# Foundation Backend Challenge

## Overview

This project is a backend service that fetches and stores token data from the [Uniswap V3 subgraph](https://thegraph.com/explorer/subgraphs/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV?view=Query&chain=arbitrum-one#query-subgraph), and provides an API to retrieve chart data for various tokens. It uses `Node.js`, `Express`, `TypeScript`, and `PostgreSQL`.

### Configuration ###

* A local version of `Postgres` was installed on my local machine for this purpose. The credentials are stored in the `.env` file; a temple `.env.template` file is enclosed in the repo.
* A Uniswap API key was used to query the subgraph. When running locally, a key should be created for this. A sample format is also included in the `.env.template` file under `UNISWAP_KEY`


## Features

- Fetches historical and real-time token data from Uniswap V3 subgraph
- Stores token data in a PostgreSQL database
- Provides an API endpoint to retrieve chart data for tokens
- Supports multiple tokens (`WBTC`, `SHIB`, `GNO`) as provided by the requirements
- Configurable time intervals for data aggregation

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Uniswap V3 API key

## Installation

1. **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd foundation-backend-challenge
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file (template in repo) in the root directory and add the following:
    ```env
    DB_HOST=<host URL>
    DB_PORT=<db port>
    DB_NAME=foundation_challenge
    DB_USER=your_username
    DB_PASSWORD=your_password
    UNISWAP_KEY=your_uniswap_api_key
    ```

4. **Initialize the database:**
    ```bash
    npm run start
    ```

## Usage

### Starting the Server

Run the following command to start the server:
```bash
npm run start
```

The server will start on http://localhost:3000.

## API Endpoints ##

`GET /getChartData`: Retrieves chart data for a specific token

### Query parameters: ###
*	`tokenSymbol`: The symbol of the token (e.g., WBTC, SHIB, GNO)
* `timeUnitInHours`: The time interval for data aggregation in hours
  
### Example: ###

http://localhost:3000/getChartData?tokenSymbol=WBTC&timeUnitInHours=4

(tested with Postman calls to the local server).

An example result set looks like : 

```json
[
    [
        [
            "2024-08-22T08:00:00",
            "open",
            61011.40689508929
        ],
        [
            "2024-08-22T12:00:00",
            "open",
            60941.16172355858
        ],
        [
            "2024-08-22T16:00:00",
            "open",
            0
        ],
        [
            "2024-08-22T20:00:00",
            "open",
            0
        ],
        [
            "2024-08-23T00:00:00",
            "open",
            0
        ],
        [
            "2024-08-23T04:00:00",
            "open",
            0
        ],
        [
            "2024-08-23T08:00:00",
            "open",
            0
        ]
    ],
    [
        [
            "2024-08-22T08:00:00",
            "close",
            61044.66486157462
        ],
        [
            "2024-08-22T12:00:00",
            "close",
            60725.76392989785
        ],
        [
            "2024-08-22T16:00:00",
            "close",
            0
        ],
        [
            "2024-08-22T20:00:00",
            "close",
            0
        ],
        [
            "2024-08-23T00:00:00",
            "close",
            0
        ],
        [
            "2024-08-23T04:00:00",
            "close",
            0
        ],
        [
            "2024-08-23T08:00:00",
            "close",
            0
        ]
    ],
    [
        [
            "2024-08-22T08:00:00",
            "high",
            61053.156694312056
        ],
        [
            "2024-08-22T12:00:00",
            "high",
            60953.111054070905
        ],
        [
            "2024-08-22T16:00:00",
            "high",
            0
        ],
        [
            "2024-08-22T20:00:00",
            "high",
            0
        ],
        [
            "2024-08-23T00:00:00",
            "high",
            0
        ],
        [
            "2024-08-23T04:00:00",
            "high",
            0
        ],
        [
            "2024-08-23T08:00:00",
            "high",
            0
        ]
    ],
    [
        [
            "2024-08-22T08:00:00",
            "low",
            60979.2663370757
        ],
        [
            "2024-08-22T12:00:00",
            "low",
            60725.76392989785
        ],
        [
            "2024-08-22T16:00:00",
            "low",
            0
        ],
        [
            "2024-08-22T20:00:00",
            "low",
            0
        ],
        [
            "2024-08-23T00:00:00",
            "low",
            0
        ],
        [
            "2024-08-23T04:00:00",
            "low",
            0
        ],
        [
            "2024-08-23T08:00:00",
            "low",
            0
        ]
    ],
    [
        [
            "2024-08-22T08:00:00",
            "priceUSD",
            61044.66486157462
        ],
        [
            "2024-08-22T12:00:00",
            "priceUSD",
            60725.76392989785
        ],
        [
            "2024-08-22T16:00:00",
            "priceUSD",
            0
        ],
        [
            "2024-08-22T20:00:00",
            "priceUSD",
            0
        ],
        [
            "2024-08-23T00:00:00",
            "priceUSD",
            0
        ],
        [
            "2024-08-23T04:00:00",
            "priceUSD",
            0
        ],
        [
            "2024-08-23T08:00:00",
            "priceUSD",
            0
        ]
    ]
]
```

## Development ##

### Running in Development Mode ###

To run the server in development mode with hot reloading:

 ```bash
npm run dev
 ```

## Running Tests ##

To run the test suite with full rebuild:
 ```bash
npm run dev
 ```

For debugging tests:
 ```bash
npm run test:debug
 ```

### Building the Project ###
To compile TypeScript to JavaScript:

 ```bash
npm run build
 ```

Future todo: 

* Separate out separate services for historical loading & hourly loading
* Implement graphData API call as a graphQL endpoint
* Putting in a lot more thought in the db schema:
  * proper foreign keys
  * indexing
  * stored procedure for retreiving graph data
* Using Terraform for the SQL objects, create them outside of the code
* A whole lot more tests - MUCH MORE, but unit and integration tests
* Optimizing batch writing to db - 100 is probably ok, but any more, using a COPY command might be better. Better yet, an ORM might be really helpful
* Currently, the tokens processed are hard-coded in the system. It could easily be expanded so that any token can be polled for.

  
