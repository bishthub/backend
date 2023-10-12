const axios = require('axios');

exports.getuserData = async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress;

    if (walletAddress == ':walletAddress')
      return res.status(400).json({ error: 'Address cant be blank' });

    const apiUrl = `https://restapi.nftscan.com/api/v2/account/own/${walletAddress}`;

    const ercType = req.query.erc_type || 'erc721';
    const showAttribute = req.query.show_attribute || 'false';
    const sortField = req.query.sort_field || '';
    const sortDirection = req.query.sort_direction || '';

    const headers = {
      'X-API-KEY': 'YYfPYkvejpby2oolf8Ub1M3w',
    };

    const response = await axios.get(apiUrl, {
      params: {
        erc_type: ercType,
        show_attribute: showAttribute,
        sort_field: sortField,
        sort_direction: sortDirection,
      },
      headers,
    });

    // Extract the content array from the response
    const content = response.data.data.content.map((item) => ({
      contract_address: item.contract_address,
      contract_name: item.contract_name,
      token_id: item.token_id,
      nftscan_uri: item.nftscan_uri || `ipfs://${item.image_uri}`,
    }));

    // Create a modified response object with total and the modified content
    const modifiedResponse = {
      total: response.data.data.total,
      content,
    };

    res.status(200).json(modifiedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
