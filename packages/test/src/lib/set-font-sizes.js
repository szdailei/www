async function setFontSizes(page, standardSize) {
  const client = await page.target().createCDPSession();
  await client.send('Page.enable');
  await client.send('Page.setFontSizes', {
    fontSizes: {
      standard: standardSize,
    },
  });
}

export default setFontSizes;
