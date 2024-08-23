# Foundation Backend Challenge

## Overview

This project is a backend service that fetches and stores token data from the [Uniswap V3 subgraph](https://thegraph.com/explorer/subgraphs/5zvR82QoaXYFyDEKLZ9t6v9adgnptxYpKpSbxtgVENFV?view=Query&chain=arbitrum-one#query-subgraph), and provides an API to retrieve chart data for various tokens. It uses `Node.js`, `Express`, `TypeScript`, and `PostgreSQL`.

This solution is way over-engineered; I wanted to use this as an exercise in creating something that could have a much much more powerful scale. The part of the system that runs the main data load is set up with asynchronous tasks with Promises completing in parallel  - so that if needed, this could really be left to run on a much much larger scale. 

I thought long and hard about the concurrency situation in this project. There's a lot less data then I initially expected and real multi-threading isn't truly needed; However, it's easy to see that running the pagination queries that return potentially hundreds of thousands of records and then needing the save them could cause a lot of concurrency and blocking issues.

To implement actual multithreading for this operation, one could consider:

* Using Node.js Worker Threads: You could create a worker pool to distribute the GraphQL requests across multiple threads.
* Implementing a queue system: You could use a job queue (like Bull) to distribute work across multiple Node.js processes.
* Parallel processing: If fetching data for multiple tokens, one could use `Promise.all()` to fetch data for different tokens in parallel. This method is already used in `gqlPoller.ts` class.

While I used `Node.js` and `Express` to write this and there's asynchronous processing going on, it's important to mention that Node is a single-threaded process; However, Node was simple to use and set up for this small proof of concept, so I ended up using that.

`Jest` was used for testing, both unit and integration tests. Instructions for running tests are below. 

### Sections: ###

#### There are 2 main parts of this repo: ####
1. A *graphQL server-based application* that will bring in data from Uniswap Subgraph, and save it to the Postgres DB
2. A *REST API endpoint* that can produce an aggregate of the data saved in step 1 based on input of a `token` and aggregation time in hours. 

Both sections use asynchronous programming with promises; the REST API will deliver fast results while the dataset is small; when the data gets to be more voluminous, a stored procedure will definitely be more useful to speed up the processing. (see future improvements section). 

#### Database ####
Data picked up from Uniswap is saved in 2 tables: 
1. token_hour_data
2. tokens

Schemas: 
```SQL 
CREATE TABLE IF NOT EXISTS public.tokens
(
    address text COLLATE pg_catalog."default" NOT NULL,
    name text COLLATE pg_catalog."default" NOT NULL,
    symbol text COLLATE pg_catalog."default" NOT NULL,
    total_supply numeric NOT NULL,
    volume_usd numeric NOT NULL,
    decimals integer NOT NULL,
    CONSTRAINT tokens_pkey PRIMARY KEY (address)
)
```

```SQL 
CREATE TABLE IF NOT EXISTS public.token_hour_data
(
    id integer NOT NULL DEFAULT nextval('token_hour_data_id_seq'::regclass),
    token_address text COLLATE pg_catalog."default",
    date timestamp without time zone NOT NULL,
    open numeric NOT NULL,
    high numeric NOT NULL,
    low numeric NOT NULL,
    close numeric NOT NULL,
    price_usd numeric NOT NULL,
    CONSTRAINT token_hour_data_pkey PRIMARY KEY (id),
    CONSTRAINT token_hour_data_token_address_date_key UNIQUE (token_address, date)
)
```
The `token_hour_data` maps to the `tokens` on the `token_hour_data.token_address => tokens.address` fields

The final aggregation that produces the results for the API call queries these tables and aggregates the data appropriately.

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

4. **Install the database:**
   * Install a Postgres instance locally, or connect to an existing one;
   * a client, like pgAdmin, is useful for testing as well - but unnecessary.
   * The needed `db name` is set up in the `.env` file; nothing needs to be initialized since the code will take care of creating the needed tables.
   * This will need to be more thoroughly set up in a real application

## Usage

## Starting the GraphQL ingesting Server and API Server
Run the following command to run the historical import:
```bash
npm run start
```
This will run the initial historical ingestion, and then run *hourly* to ingest new data *hourly* , using the `setTimeout` method.

I decided that hourly would be a decent interval to run the polling on - not too often and not too sparse. This should be re-evaluated as the app gets tested more. 

This will also start the API Server once the ingestion is complete;

The server will start on http://localhost:3000.

### API Endpoints ###

`GET /getChartData`: Retrieves chart data for a specific token

### Query parameters: ###
* `tokenSymbol`: The symbol of the token (e.g., WBTC, SHIB, GNO)
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

For running tests: (will do a complete re-build every time)
 ```bash
npm run test:clean
 ```

### Building the Project ###
To compile TypeScript to JavaScript:

 ```bash
npm run build
 ```

## Future todo: ##

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
* Configuration management for dev/stage/prod environments
* Protection against dependency injection
* Better logging - perhaps using `Data Dog` or `Winston`
* Rate Limiting on the API to prevent abuse
* CI/CD pipeline for automated testing and deployment
* Add performance monitoring and application metrics collection
* Better error handling
* More detailed comments - although I have tried to make the code easy to read

  
