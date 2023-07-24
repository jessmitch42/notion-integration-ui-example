// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json()); // for parsing application/json

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/databases", async function (request, response) {
  const pageId = process.env.NOTION_PAGE_ID;
  const title = request.body.dbName;

  try {
    const newDb = await notion.databases.create({
      parent: {
        type: "page_id",
        page_id: "98ad959b-2b6a-4774-80ee-00246fb0ea9b",
      },
      icon: {
        type: "emoji",
        emoji: "📝",
      },
      cover: {
        type: "external",
        external: {
          url: "https://website.domain/images/image.png",
        },
      },
      title: [
        {
          type: "text",
          text: {
            content: "Grocery List",
            link: null,
          },
        },
      ],
      properties: {
        Name: {
          title: {},
        },
        Description: {
          rich_text: {},
        },
        "In stock": {
          checkbox: {},
        },
        "Food group": {
          select: {
            options: [
              {
                name: "🥦Vegetable",
                color: "green",
              },
              {
                name: "🍎Fruit",
                color: "red",
              },
              {
                name: "💪Protein",
                color: "yellow",
              },
            ],
          },
        },
        Price: {
          number: {
            format: "dollar",
          },
        },
        "Last ordered": {
          date: {},
        },
        Meals: {
          relation: {
            database_id: "668d797c-76fa-4934-9b05-ad288df2d136",
            single_property: {},
          },
        },
        "Number of meals": {
          rollup: {
            rollup_property_name: "Name",
            relation_property_name: "Meals",
            function: "count",
          },
        },
        "Store availability": {
          type: "multi_select",
          multi_select: {
            options: [
              {
                name: "Duc Loi Market",
                color: "blue",
              },
              {
                name: "Rainbow Grocery",
                color: "gray",
              },
              {
                name: "Nijiya Market",
                color: "purple",
              },
              {
                name: "Gus'''s Community Market",
                color: "yellow",
              },
            ],
          },
        },
        "+1": {
          people: {},
        },
        Photo: {
          files: {},
        },
      },
    });
    console.log(newDb);
    response.json({ message: "success!", data: newDb });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

app.post("/pages", async function (request, response) {
  const dbID = request.body.dbID;
  const pageName = request.body.pageName;
  const header = request.body.header;

  try {
    const newPage = await notion.pages.create({
      parent: {
        type: "database_id",
        database_id: dbID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: pageName,
              },
            },
          ],
        },
      },
      children: [
        {
          object: "block",
          heading_2: {
            rich_text: [
              {
                text: {
                  content: header,
                },
              },
            ],
          },
        },
      ],
    });
    response.json({ message: "success!", data: newPage });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

app.post("/blocks", async function (request, response) {
  const pageID = request.body.pageID;
  const content = request.body.content;

  try {
    const newBlock = await notion.blocks.children.append({
      block_id: pageID, // a block ID can be a page ID
      children: [
        {
          paragraph: {
            rich_text: [
              {
                text: {
                  content: content,
                },
              },
            ],
          },
        },
      ],
    });
    response.json({ message: "success!", data: newBlock });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

app.post("/comments", async function (request, response) {
  const pageID = request.body.pageID;
  const comment = request.body.comment;

  try {
    const newComment = await notion.comments.create({
      parent: {
        page_id: pageID,
      },
      rich_text: [
        {
          text: {
            content: comment,
          },
        },
      ],
    });
    response.json({ message: "success!", data: newComment });
  } catch (error) {
    response.json({ message: "error", error });
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
