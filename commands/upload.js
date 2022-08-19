const {
  SlashCommandBuilder
} = require('@discordjs/builders');
const fetch = require('cross-fetch')
const { XMLValidator } = require("fast-xml-parser");


module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload a example to Scratch for Discord')
    .addAttachmentOption(option => option.setName('file').setDescription('The blocks.xml file').setRequired(true))
    .addStringOption(option =>
      option.setName('title').setDescription('Title of the example').setRequired(true))
    .addStringOption(option =>
      option.setName('description').setDescription('Description of the example').setRequired(true)),


  
  async execute(interaction, client) {
        var author = interaction.user.id
    await interaction.deferReply();
      var file = interaction.options.getAttachment('file').url
      var title = interaction.options.getString('title');
      var desc = interaction.options.getString('description');
      var fileIsXml = occurrences(file, ".xml")
      if (fileIsXml == 1) {
        fetch(file).then(res => res.text()).then(async (body) => {
          var blockCount = 0
          var blockCount = occurrences(body, "<block")
          blockCount = blockCount + occurrences(body, "<shadow")
          const result = XMLValidator.validate(body, {
            allowBooleanAttributes: true
          });
          if (result != true) return await interaction.editReply("error parsing your XML data please make sure you uploaded the blocks.xml file found in the zip file when downloading your bot")
          if (blockCount < 5) {
            await interaction.editReply("There must be atleast 5 blocks in your example")
          } else {

                var obj = {
                  name: title,
                  desc: desc,
                  author: `${interaction.user.username}#${interaction.user.discriminator}`,
                  sessionID: author,
                  xml: body,
                  count: blockCount,
                  corsBypass: process.env['apiKey']
                }

                fetch('https://469exampletest.jeremygamer13.repl.co/api/upload', {
                  method: 'POST',
                  mode: "cors",
                  headers: {
                    'Content-Type': 'application/json',
                  },

                  body: JSON.stringify(obj),
                }).then(res => res.json()).then(async (json) => {
                  if (json.limitedUntil != null) {
                     await interaction.editReply(`Seems like you've hit the rate limit, you can submit again <t:${json.limitedUntil}:R>`)
                  } else if (json.error) {
                    await interaction.editReply("Error: " + String(json.error))
                  } else {
                   await interaction.editReply("Example Uploaded!")
                  }
                  console.log(json)
                })
        

          }

        })
      } else {
        await interaction.editReply("Please upload a valid XML file")
      }
 
  },
}

// ---------------------------------------------------------

function occurrences(string, subString, allowOverlapping) {

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}