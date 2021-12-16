const { verifyRequest, agreeWithRules, respond } = require('./functions');
const roleConfig = require('./config.json');

// eslint-disable-next-line consistent-return
module.exports = async (req, res) => {
  if (!req.headers['x-signature-ed25519'] || !req.headers['x-signature-timestamp']) return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  if (!await verifyRequest(req)) return res.status(401).send('');

  try {
    const interaction = req.body;

    if (interaction.type === 1) return res.status(200).send({ type: 1 });
    if (interaction.data.custom_id === 'agreewithrules') {
      if (interaction.member.roles.includes(roleConfig.roleId)) return respond(interaction, res, { type: 4, data: { content: 'You\'ve already agreed to the rules!', flags: 64 } });
      return agreeWithRules(interaction, res, interaction.member.user.id);
    }
  } catch (e) {
    res.status(500).send('An error has occured.');
    console.error(e);
  }
};
