# Context
This is my implementation of the Swivl takehome challenge. There exists a route

```
POST /api/locations/{:orgId:}

Example body:
["PhoneNumber", "BrandName"]
````

That will return a body like so

```
[
  {
    location: {
      id: 1,
      orgId: 4,
    },
    variables: {
      "PhoneNumber": {
        value: "(714) 234-5678",
        inheritance: "location"
      },
      "BrandName": {
        value: "StorageUSA",
        inheritance: "org"
      },
    }
  },
  ...
]
```

# Assumptions
- I assume https://swivl-interview-e61c73ef3cf5.herokuapp.com/api/variables will always return at least one org level variable per organization.
- I also assume an org does not exist if it is not returned from https://swivl-interview-e61c73ef3cf5.herokuapp.com/api/locations. That means there could be entries for that org in /variables but we will not consider them

# Build
To build the project, run `npm run build`

# Tests
Running tests can be done with `npm run test`

# Running in dev
Running the server in dev mode can be done with `npm run dev`

# Running in production
First create a build by running `npm run build` and then run it with `node build/src/server.js`