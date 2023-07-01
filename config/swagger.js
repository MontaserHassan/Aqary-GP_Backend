const express = require("express"),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

  const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Aqary API",
        version: "0.1.0",
        description:
          "Aqary API",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
      },
      servers: [
        {
          url: "http://localhost:4000",
        },
      ],
    },
    apis: ["./routes/*.js", "./routes/customer/*.js", "./routes/backOffice/*.js"],
  };
  
  const specs = swaggerJsdoc(options);

  module.exports = {
    swaggerUi,
    specs,
  };